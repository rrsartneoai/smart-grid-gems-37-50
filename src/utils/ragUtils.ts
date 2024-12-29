import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

const MAX_CHUNK_LENGTH = 25000; // Safe limit below the 30720 token limit

function chunkText(text: string): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + word).length < MAX_CHUNK_LENGTH) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export async function generateRAGResponse(input: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // If input is too long, chunk it and process first chunk only
    const chunks = chunkText(input);
    const processableInput = chunks[0]; // Take first chunk only
    
    console.log('Processing input chunk length:', processableInput.length);
    
    const prompt = `
      You are an AI assistant specializing in power grid management and energy systems.
      Please provide a response to the following query: ${processableInput}
      
      Respond in a professional but friendly manner, focusing on power grid related information.
      Keep the response concise and relevant.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    if (error instanceof Error && error.message.includes('tokens')) {
      return "Przepraszam, zapytanie jest zbyt długie. Proszę spróbować z krótszym tekstem lub podzielić go na mniejsze części.";
    }
    return "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie.";
  }
}

export async function processDocumentForRAG(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Chunk the text and process only the first chunk
    const chunks = chunkText(text);
    const processableText = chunks[0];
    
    console.log('Processing document chunk length:', processableText.length);
    
    const prompt = `
      Przeanalizuj poniższy tekst i wypisz 5 najważniejszych zagadnień lub tematów z tego dokumentu:
      ${processableText}
      
      Odpowiedź sformatuj jako prostą listę 5 najważniejszych zagadnień, po jednym w linii.
      Zwróć TYLKO te 5 zagadnień, nic więcej.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error processing document:', error);
    if (error instanceof Error && error.message.includes('tokens')) {
      return `1. Dokument jest zbyt długi do przetworzenia w całości
2. Została przeanalizowana tylko część dokumentu
3. Dla lepszych wyników podziel dokument na mniejsze części
4. Maksymalny rozmiar to około 25000 znaków
5. Spróbuj wysłać krótszy fragment tekstu`;
    }
    return `1. Nie udało się przetworzyć dokumentu
2. Spróbuj ponownie później
3. Sprawdź czy dokument zawiera tekst
4. Upewnij się, że dokument jest czytelny
5. Skontaktuj się z administratorem systemu`;
  }
}