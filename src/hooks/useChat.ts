
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Message } from "@/types/chat";
import { generateRAGResponse } from "@/utils/ragUtils";
import { processSensorQuery, isSensorRelatedQuery } from "@/hooks/useSensorQueries";
import { getAirQualityData } from "@/hooks/useAirQualityData";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem twoim asystentem monitorowania stanu jakości powietrza. Jak mogę ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem twoim asystentem monitorowania stanu jakości powietrza. Jak mogę ci pomóc?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Konwersacja wyczyszczona",
      description: "Historia czatu została zresetowana.",
    });
  };

  const addUserMessage = (content: string) => {
    const userMessage = {
      role: "user" as const,
      content: content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const addAssistantMessage = (text: string, visualizations?: Message["dataVisualizations"]) => {
    const newMessage = {
      role: "assistant" as const,
      content: text,
      timestamp: new Date(),
      dataVisualizations: visualizations,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      // Process query logic moved here to simplify the architecture
      if (isSensorRelatedQuery(input)) {
        try {
          const sensorResponse = await processSensorQuery(input);
          return sensorResponse;
        } catch (error) {
          console.error("Error processing sensor query:", error);
        }
      }
      
      const localData = getAirQualityData(input);
      if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
        return localData;
      }
      
      const response = await generateRAGResponse(input);
      return { text: response };
    },
    onSuccess: (response) => {
      addAssistantMessage(response.text, response.visualizations);
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

    addUserMessage(input);
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
