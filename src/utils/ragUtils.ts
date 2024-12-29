import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

export async function generateRAGResponse(input: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are an AI assistant specializing in power grid management and energy systems.
      Please provide a response to the following query: ${input}
      
      Respond in a professional but friendly manner, focusing on power grid related information.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie.";
  }
}

export async function processDocumentForRAG(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Przeanalizuj poniższy tekst i wypisz 5 najważniejszych zagadnień lub tematów z tego dokumentu:
      ${text}
      
      Odpowiedź sformatuj jako prostą listę 5 najważniejszych zagadnień, po jednym w linii.
      Zwróć TYLKO te 5 zagadnień, nic więcej.
      
      Przykładowy format odpowiedzi:
      1. Pierwsze zagadnienie
      2. Drugie zagadnienie
      3. Trzecie zagadnienie
      4. Czwarte zagadnienie
      5. Piąte zagadnienie
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error processing document:', error);
    return `1. Nie udało się przetworzyć dokumentu
2. Spróbuj ponownie później
3. Sprawdź czy dokument zawiera tekst
4. Upewnij się, że dokument jest czytelny
5. Skontaktuj się z administratorem systemu`;
  }
}