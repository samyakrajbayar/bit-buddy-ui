import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const RetroChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "HELLO! I AM YOUR 8-BIT ASSISTANT. HOW CAN I HELP YOU TODAY?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.toUpperCase(),
      isBot: false,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(text),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "THAT'S INTERESTING! TELL ME MORE...",
      "I UNDERSTAND. LET ME HELP YOU WITH THAT!",
      "PROCESSING... BEEP BOOP! GOT IT!",
      "EXCELLENT QUESTION! HERE'S WHAT I THINK...",
      "LOADING RESPONSE... DONE! ✓",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col pixel-border bg-card screen-glow">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 border-b-[3px] border-border">
        <h1 className="text-sm">◆ RETRO CHAT v1.0 ◆</h1>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t-[3px] border-border bg-muted">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};
