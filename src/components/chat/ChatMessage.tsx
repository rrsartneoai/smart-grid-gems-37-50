
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageAvatar } from "./message/MessageAvatar";
import { MessageHeader } from "./message/MessageHeader";
import { MessageBody } from "./message/MessageBody";
import { DataVisualizations } from "./message/DataVisualizations";
import { AudioPlayback } from "./message/AudioPlayback";

type MessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "airQuality" | "temperature" | "humidity" | "sensorReading";
    title: string;
    data?: any;
  }>;
};

export function ChatMessage({
  role,
  content,
  timestamp,
  dataVisualizations
}: MessageProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { playAudio } = AudioPlayback({ 
    content, 
    isPlayingAudio, 
    setIsPlayingAudio 
  });

  const handlePlayText = () => {
    playAudio();
  };

  return (
    <div className={`flex gap-3 ${role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
      <MessageAvatar role={role} />
      
      <div className={`flex flex-col max-w-[80%] md:max-w-[85%] lg:max-w-[90%] ${role === "assistant" ? "" : "items-end"}`}>
        <MessageHeader 
          role={role} 
          timestamp={timestamp} 
          isPlayingAudio={isPlayingAudio}
          onPlayText={role === "assistant" ? handlePlayText : undefined}
        />
        
        <MessageBody content={content} role={role} />
        
        {role === "assistant" && (
          <DataVisualizations visualizations={dataVisualizations} />
        )}
      </div>
    </div>
  );
}
