```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

const MAX_CHUNK_LENGTH = 25000;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= MAX_CHUNK_LENGTH) {
      currentChunk += sentence + ' ';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + ' ';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function generateRAGResponse(input: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chunks = chunkText(input);
    const processableInput = chunks[0];
    
    console.log('Przetwarzanie fragmentu tekstu o długości:', processableInput.length);
    
    const prompt = `
      Jesteś asystentem AI specjalizującym się w zarządzaniu siecią energetyczną i systemami energetycznymi.
      Odpowiedz na następujące zapytanie w języku polskim: ${processableInput}
      
      Odpowiadaj w profesjonalny ale przyjazny sposób, skupiając się na informacjach związanych z siecią energetyczną.
      Zachowaj zwięzłość i trzymaj się tematu.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Błąd generowania odpowiedzi:', error);
    if (error instanceof Error && error.message.includes('tokens')) {
      return "Przepraszam, zapytanie jest zbyt długie. Proszę spróbować z krótszym tekstem lub podzielić go na mniejsze części.";
    }
    return "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie.";
  }
}

export async function processDocumentForRAG(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chunks = chunkText(text);
    
    let summary = '';
    for (const chunk of chunks) {
      const prompt = `
        Przeanalizuj poniższy fragment tekstu i wyodrębnij najważniejsze informacje związane z energetyką, 
        sieciami energetycznymi lub zarządzaniem energią. Przedstaw wyniki w zwięzłej formie po polsku:

        ${chunk}
      `;
      
      const result = await model.generateContent(prompt);
      summary += result.response.text() + '\n\n';
    }
    
    return summary.trim();
  } catch (error) {
    console.error('Błąd przetwarzania dokumentu:', error);
    return "Przepraszam, wystąpił błąd podczas przetwarzania dokumentu. Proszę spróbować ponownie.";
  }
}
```