
import { Card } from "@/components/ui/card";
import { FileText, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileInfoProps {
  file: File;
  topics?: string[];
}

export function FileInfo({ file, topics = [] }: FileInfoProps) {
  const navigate = useNavigate();
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleTopicClick = (topic: string) => {
    // Dispatch custom event to set initial query in chat
    const event = new CustomEvent('setInitialQuery', { 
      detail: `Opowiedz mi więcej o: ${topic}`
    });
    window.dispatchEvent(event);
  };

  return (
    <Card className="p-4 mt-4 bg-card">
      <div className="flex items-start gap-4">
        <FileText className="h-8 w-8 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1">Wgrany plik</h3>
          <p className="text-sm text-muted-foreground">
            Nazwa: {file.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Rozmiar: {formatFileSize(file.size)}
          </p>
          
          {topics && topics.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <List className="h-4 w-4" />
                Główne zagadnienia:
              </h4>
              <ScrollArea className="h-[120px] w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2 p-1">
                  {topics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-sm transition-all hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleTopicClick(topic.trim())}
                    >
                      {topic.trim()}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
