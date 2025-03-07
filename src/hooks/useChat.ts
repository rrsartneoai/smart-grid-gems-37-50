
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Message } from "@/types/chat";
import { useQueryProcessor } from "@/hooks/chat/useQueryProcessor";

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
  const { processQuery } = useQueryProcessor();

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
      return await processQuery(input);
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
