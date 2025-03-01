
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Speaker } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";

type MessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "airQuality" | "temperature" | "humidity";
    title: string;
  }>;
};

export function ChatMessage({
  role,
  content,
  timestamp,
  dataVisualizations
}: MessageProps) {
  const time = format(timestamp, "HH:mm", { locale: pl });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { toast } = useToast();
  
  const conversation = useConversation({
    apiKey: localStorage.getItem('ELEVENLABS_API_KEY') || '',
    overrides: {
      tts: {
        voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte - polska wymowa
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      setIsPlayingAudio(false);
      toast({
        title: "Błąd odtwarzania",
        description: "Nie udało się odtworzyć wiadomości głosowo. Sprawdź swój klucz API.",
        variant: "destructive"
      });
    },
  });

  // Zatrzymaj odtwarzanie po odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (isPlayingAudio) {
        conversation.endSession();
      }
    };
  }, [isPlayingAudio, conversation]);

  const handlePlayText = async () => {
    try {
      if (isPlayingAudio) {
        conversation.endSession();
        setIsPlayingAudio(false);
      } else {
        // Sprawdź, czy jest dostępny klucz API ElevenLabs
        if (!localStorage.getItem('ELEVENLABS_API_KEY')) {
          const apiKey = prompt('Podaj klucz API ElevenLabs, aby korzystać z funkcji odtwarzania głosowego:');
          if (apiKey) {
            localStorage.setItem('ELEVENLABS_API_KEY', apiKey);
          } else {
            return; // Anulowano wprowadzanie klucza
          }
        }
        
        setIsPlayingAudio(true);
        
        try {
          // Tworzenie nowej sesji ElevenLabs
          await conversation.startSession({
            agentId: "default"
          });
          
          // Kompletna implementacja tekstu do mowy przy użyciu API ElevenLabs
          // Bezpośrednie wywołanie API, aby odtworzyć tekst
          const apiKey = localStorage.getItem('ELEVENLABS_API_KEY');
          
          if (!apiKey) {
            throw new Error("Brak klucza API");
          }
          
          const voiceId = "XB0fDUnXU5powFXDhCwa"; // Charlotte
          const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': apiKey
            },
            body: JSON.stringify({
              text: content,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(`Błąd API: ${response.status}`);
          }
          
          // Konwertuj odpowiedź na Blob
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Odtwórz dźwięk
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            setIsPlayingAudio(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          audio.onerror = () => {
            console.error("Błąd odtwarzania audio");
            setIsPlayingAudio(false);
            URL.revokeObjectURL(audioUrl);
            toast({
              title: "Błąd odtwarzania",
              description: "Nie udało się odtworzyć wiadomości głosowo.",
              variant: "destructive"
            });
          };
          
          audio.play();
        } catch (error) {
          console.error("Błąd podczas przetwarzania tekstu na mowę:", error);
          setIsPlayingAudio(false);
          toast({
            title: "Błąd ElevenLabs",
            description: "Wystąpił problem z usługą tekst-na-mowę. Sprawdź swój klucz API.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error playing text:', error);
      setIsPlayingAudio(false);
    }
  };

  // Zatrzymaj odtwarzanie, gdy asystent kończy mówić
  useEffect(() => {
    if (!conversation.isSpeaking && isPlayingAudio) {
      setIsPlayingAudio(false);
    }
  }, [conversation.isSpeaking, isPlayingAudio]);

  return (
    <div className={`flex gap-3 ${role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
      <Avatar className="mt-1">
        {role === "assistant" ? (
          <AvatarImage src="/lovable-uploads/045f69f0-5424-4c58-a887-6e9e984d428b.png" />
        ) : null}
        <AvatarFallback>
          {role === "assistant" ? "AI" : "Ty"}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[80%] md:max-w-[85%] lg:max-w-[90%] ${role === "assistant" ? "" : "items-end"}`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>{role === "assistant" ? "Asystent" : "Ty"}</span>
          <span>•</span>
          <span>{time}</span>
          
          {role === "assistant" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full ml-1"
              onClick={handlePlayText}
              title={isPlayingAudio ? "Zatrzymaj odtwarzanie" : "Odtwórz głosowo"}
            >
              <Speaker className={`h-4 w-4 ${isPlayingAudio ? "text-primary animate-pulse" : ""}`} />
            </Button>
          )}
        </div>
        
        <div
          className={`rounded-lg p-3 ${
            role === "assistant"
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    </div>
  );
}
