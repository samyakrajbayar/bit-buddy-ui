import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThemeSelector } from "./ThemeSelector";
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
      text: "HELLO! I AM STUDYBOT, YOUR 8-BIT STUDY COMPANION. HOW CAN I HELP YOU TODAY?",
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
      "GREAT QUESTION! LET ME HELP YOU STUDY...",
      "I UNDERSTAND. LET'S BREAK THAT DOWN!",
      "PROCESSING STUDY DATA... BEEP BOOP! GOT IT!",
      "EXCELLENT! LET'S EXPLORE THIS TOPIC...",
      "LOADING STUDY NOTES... DONE! ✓",
      "THAT'S A SMART QUESTION! HERE'S MY ANALYSIS...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col pixel-border bg-card screen-glow">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 border-b-[3px] border-border">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-sm">◆ STUDYBOT v1.0 ◆</h1>
          <ThemeSelector />
        </div>
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
