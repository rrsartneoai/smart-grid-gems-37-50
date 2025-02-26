
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
    console.log('Rozpoczynam ekstrakcję głównych tematów...');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Na podstawie poniższego tekstu, wypisz 5 najważniejszych zagadnień lub tematów.
      Zachowaj krótką i zwięzłą formę, maksymalnie kilka słów na temat.
      
      Tekst do analizy:
      ${text}
      
      Zwróć dokładnie 5 głównych tematów, każdy w nowej linii, bez numeracji i dodatkowych oznaczeń.
      Format odpowiedzi powinien wyglądać tak:
      Temat pierwszy
      Temat drugi
      Temat trzeci
      Temat czwarty
      Temat piąty
    `;

    console.log('Wysyłam zapytanie do modelu Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topicsString = response.text();
    
    console.log('Otrzymano odpowiedź od modelu:', topicsString);
    
    // Podziel odpowiedź na linie i usuń puste linie oraz białe znaki
    const topics = topicsString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Upewnij się, że mamy dokładnie 5 tematów

    console.log('Przetworzone tematy:', topics);
    
    if (topics.length !== 5) {
      console.warn('Nieoczekiwana liczba tematów:', topics.length);
      // Uzupełnij brakujące tematy, jeśli jest ich mniej niż 5
      while (topics.length < 5) {
        topics.push('Temat w trakcie analizy...');
      }
    }

    return topics;
  } catch (error) {
    console.error('Błąd podczas ekstrakcji tematów:', error);
    return [
      "Błąd przetwarzania dokumentu",
      "Spróbuj ponownie później",
      "Problem z analizą tekstu",
      "Skontaktuj się z administratorem",
      "Sprawdź poprawność dokumentu"
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

    // Wywołanie funkcji do ekstrakcji tematów
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
