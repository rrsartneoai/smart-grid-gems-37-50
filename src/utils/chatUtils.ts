import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { companiesData } from "@/data/companies";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

interface VisualizationType {
  type: "consumption" | "production" | "efficiency";
  title: string;
}

interface RAGResponse {
  text: string;
  visualizations?: VisualizationType[];
  streamingComplete?: boolean;
}

export const formatDashboardResponse = (query: string): RAGResponse => {
  const lowercaseQuery = query.toLowerCase();
  
  // Visualization patterns
  const visualizationPatterns = [
    {
      keywords: ["zużycie", "zuzycie"],
      type: "consumption" as const,
      title: "Zużycie energii"
    },
    {
      keywords: ["produkcja"],
      type: "production" as const,
      title: "Produkcja energii"
    },
    {
      keywords: ["wydajność", "wydajnosc"],
      type: "efficiency" as const,
      title: "Wydajność"
    }
  ];

  // Check for visualization requests
  const matchedVisualizations = visualizationPatterns
    .filter(pattern => 
      pattern.keywords.some(keyword => lowercaseQuery.includes(keyword))
    )
    .map(({ type, title }) => ({ type, title }));

  if (matchedVisualizations.length > 0) {
    return {
      text: matchedVisualizations.length === 1 
        ? "Oto wykres pokazujący dane, o które prosisz:"
        : "Oto wykresy pokazujące dane, o które prosisz:",
      visualizations: matchedVisualizations
    };
  }

  // Check for statistical data
  const matchingStat = companiesData[0]?.stats.find(stat => 
    lowercaseQuery.includes(stat.title.toLowerCase())
  );

  if (matchingStat) {
    return {
      text: `${matchingStat.title}: ${matchingStat.value}${matchingStat.unit ? ' ' + matchingStat.unit : ''} (${matchingStat.description})`
    };
  }

  return { text: "Nie znalazłem tej informacji w panelu." };
};

export const generateStreamingResponse = async (
  input: string,
  onChunk: (chunk: string) => void
): Promise<RAGResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are an AI assistant specializing in power grid management and energy systems.
      Please provide a response to the following query: ${input}
      
      Respond in Polish, focusing on power grid related information.
      Keep responses concise and professional but friendly.
      If the query is about data visualization, suggest relevant charts.
    `;

    const result = await model.generateText(prompt);
    const response = await result.text();
    
    // Process response for any visualization needs
    const dashboardResponse = formatDashboardResponse(input);
    
    return {
      text: response,
      visualizations: dashboardResponse.visualizations,
      streamingComplete: true
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      text: "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie.",
      streamingComplete: true
    };
  }
};

export const processContextWindow = (messages: any[], maxLength = 10) => {
  return messages.slice(-maxLength);
};