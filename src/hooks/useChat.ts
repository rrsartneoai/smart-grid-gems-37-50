import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateStreamingResponse, formatDashboardResponse, processContextWindow } from "@/utils/chatUtils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "consumption" | "production" | "efficiency";
    title: string;
  }>;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem twoim asystentem sieci energetycznej. Jak mogę Ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem twoim asystentem sieci energetycznej. Jak mogę Ci pomóc?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Konwersacja wyczyszczona",
      description: "Historia czatu została zresetowana.",
    });
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      // First check for dashboard-related queries
      const dashboardResponse = formatDashboardResponse(input);
      if (dashboardResponse.visualizations || dashboardResponse.text !== "Nie znalazłem tej informacji w panelu.") {
        return dashboardResponse;
      }

      // If not a dashboard query, generate streaming response
      let fullResponse = "";
      const response = await generateStreamingResponse(input, (chunk) => {
        fullResponse += chunk;
        // Update message in real-time as chunks arrive
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
      });

      return response;
    },
    onSuccess: (response) => {
      const newMessage = {
        role: "assistant" as const,
        content: response.text,
        timestamp: new Date(),
        dataVisualizations: response.visualizations,
      };
      
      // Update messages and maintain context window
      setMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        return processContextWindow(updatedMessages);
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  };
};