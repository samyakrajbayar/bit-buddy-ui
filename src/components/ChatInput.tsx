import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="TYPE MESSAGE..."
        className="pixel-border bg-input text-foreground text-xs placeholder:text-muted-foreground flex-1"
      />
      <Button type="submit" className="pixel-border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs px-4">
        SEND
      </Button>
    </form>
  );
};
