import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSend(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.md"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="pixel-border bg-muted text-muted-foreground hover:bg-muted/80 text-xs px-3"
        disabled={disabled}
      >
        <Upload className="w-3 h-3" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={selectedFile ? selectedFile.name : "TYPE MESSAGE..."}
        className="pixel-border bg-input text-foreground text-xs placeholder:text-muted-foreground flex-1"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        className="pixel-border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs px-4"
        disabled={disabled}
      >
        SEND
      </Button>
    </form>
  );
};
