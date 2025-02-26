
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getGeminiResponse } from '@/lib/gemini';
import { calculateTFIDF } from './searchUtils';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

let documentChunks: { text: string; metadata?: Record<string, any> }[] = [];

export const generateRAGResponse = async (query: string): Promise<string> => {
  console.log('Generuję odpowiedź dla zapytania:', query);

  const isAirQualityRelated = query.toLowerCase().includes('powietrz') || 
                             query.toLowerCase().includes('pm') ||
                             query.toLowerCase().includes('zanieczyszcz');

  if (documentChunks.length === 0) {
    console.log('Brak dokumentów w pamięci');
    
    // If it's an air quality query, use Gemini API even without local documents
    if (isAirQualityRelated) {
      const enhancedPrompt = `Odpowiedz na pytanie dotyczące jakości powietrza: ${query}. 
      Skup się na informacjach dotyczących wpływu na zdrowie i zalecanych działaniach profilaktycznych.`;
      return getGeminiResponse(enhancedPrompt);
    }
    
    return "Nie wgrano jeszcze żadnego dokumentu. Proszę najpierw wgrać dokument, aby móc zadawać pytania.";
  }

  const relevantChunks = searchRelevantChunks(query);
  
  if (relevantChunks.length === 0) {
    console.log('Nie znaleziono pasujących fragmentów');
    
    // For air quality queries, use Gemini API with enhanced prompt
    if (isAirQualityRelated) {
      const enhancedPrompt = `Odpowiedz na pytanie dotyczące jakości powietrza: ${query}. 
      Uwzględnij wpływ na zdrowie i zalecane działania profilaktyczne.`;
      return getGeminiResponse(enhancedPrompt);
    }
    
    return "Nie znalazłem odpowiednich informacji w wgranym dokumencie, które pomogłyby odpowiedzieć na to pytanie.";
  }

  const context = relevantChunks.join('\n\n');
  const prompt = `Na podstawie poniższego kontekstu, ${query === 'podsumuj' ? 'przedstaw krótkie podsumowanie głównych punktów dokumentu' : 'odpowiedz na pytanie'}. 
  ${isAirQualityRelated ? 'Zwróć szczególną uwagę na informacje dotyczące jakości powietrza i ich wpływu na zdrowie.' : ''}
  Jeśli odpowiedź nie znajduje się w kontekście, powiedz o tym.

  Kontekst:
  ${context}

  ${query === 'podsumuj' ? 'Podsumuj najważniejsze informacje z dokumentu.' : `Pytanie: ${query}`}`;

  console.log('Wysyłam zapytanie do Gemini z kontekstem długości:', context.length);
  return getGeminiResponse(prompt);
};

export const searchRelevantChunks = (query: string): string[] => {
  console.log('Szukam fragmentów dla zapytania:', query);
  
  if (documentChunks.length === 0) {
    console.log("Brak przetworzonych dokumentów w pamięci");
    return [];
  }

  if (query.toLowerCase() === 'podsumuj') {
    console.log('Zapytanie o podsumowanie - zwracam wszystkie fragmenty');
    return documentChunks.map(chunk => chunk.text);
  }

  const results = calculateTFIDF(
    query,
    documentChunks.map(chunk => chunk.text)
  );

  // Return top 3 most relevant chunks
  return results.slice(0, 3).map(result => result.text);
};

async function extractMainTopics(text: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Przeanalizuj poniższy tekst i wypisz 5 najważniejszych zagadnień lub tematów z tego dokumentu.
      Sformułuj je w sposób zwięzły i zrozumiały.
      
      Tekst do analizy:
      ${text}
      
      Odpowiedź sformatuj jako prostą listę 5 najważniejszych zagadnień, po jednym w linii.
      Nie numeruj punktów, nie dodawaj żadnych dodatkowych informacji.
      Każde zagadnienie powinno być krótkie (max 5-6 słów) i konkretne.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topicsString = response.text();
    
    // Podziel na linie i usuń puste oraz numerację
    return topicsString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+[\.\)-]\s*/, ''))
      .slice(0, 5); // Upewnij się, że mamy dokładnie 5 tematów
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [
      "Nie udało się przetworzyć dokumentu",
      "Spróbuj ponownie później",
      "Sprawdź czy dokument zawiera tekst",
      "Upewnij się, że dokument jest czytelny",
      "Skontaktuj się z administratorem systemu"
    ];
  }
}

export const processDocumentForRAG = async (text: string) => {
  try {
    console.log('Rozpoczynam przetwarzanie dokumentu dla RAG, długość tekstu:', text.length);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    documentChunks = chunks.map(chunk => ({
      text: chunk.pageContent,
      metadata: chunk.metadata,
    }));

    console.log(`Dokument przetworzony na ${documentChunks.length} fragmentów`);

    // Ekstrahuj główne tematy
    const mainTopics = await extractMainTopics(text);
    console.log('Wyodrębnione główne tematy:', mainTopics);

    return {
      message: `Dokument został przetworzony na ${documentChunks.length} fragmentów`,
      chunks: documentChunks,
      topics: mainTopics
    };
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    throw new Error("Wystąpił błąd podczas przetwarzania dokumentu");
  }
};
