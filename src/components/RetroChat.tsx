import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThemeSelector } from "./ThemeSelector";
import { FeaturePanel } from "./FeaturePanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamChat } from "@/lib/aiClient";
import { toast } from "sonner";

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
      text: "HELLO! I AM STUDYBOT, YOUR 8-BIT STUDY COMPANION. UPLOAD A TEXTBOOK OR ASK ME ANYTHING!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    const text = await file.text();
    return text;
  };

  const handleSend = async (text: string, file?: File) => {
    let userMessageText = text.toUpperCase();
    let fileContent = "";

    if (file) {
      try {
        fileContent = await extractTextFromFile(file);
        userMessageText = `[UPLOADED: ${file.name}]\n${text || "ANALYZE THIS FILE"}`.toUpperCase();
      } catch (error) {
        toast.error("FAILED TO READ FILE");
        return;
      }
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    let assistantText = "";
    const upsertAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isBot) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, text: assistantText } : m
          );
        }
        return [
          ...prev,
          {
            id: prev.length + 1,
            text: assistantText,
            isBot: true,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      const chatHistory = messages.map((m) => ({
        role: m.isBot ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));

      await streamChat({
        messages: [
          ...chatHistory,
          {
            role: "user",
            content: fileContent ? `${text}\n\nFILE CONTENT:\n${fileContent}` : text,
          },
        ],
        action: "chat",
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("FAILED TO SEND MESSAGE");
      setIsLoading(false);
    }
  };

  const handleRewrite = async (interests: string, textContent: string) => {
    if (!textContent.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: `REWRITE THIS BASED ON MY INTERESTS: ${interests.toUpperCase()}`,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    let assistantText = "";
    const upsertAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isBot) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, text: assistantText } : m
          );
        }
        return [
          ...prev,
          {
            id: prev.length + 1,
            text: assistantText,
            isBot: true,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      await streamChat({
        action: "rewrite",
        interests,
        textContent,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      toast.error("REWRITE FAILED");
      setIsLoading(false);
    }
  };

  const handleQuiz = async (numQuestions: number, textContent: string) => {
    if (!textContent.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: `GENERATE ${numQuestions} QUIZ QUESTIONS`,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    let assistantText = "";
    const upsertAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isBot) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, text: assistantText } : m
          );
        }
        return [
          ...prev,
          {
            id: prev.length + 1,
            text: assistantText,
            isBot: true,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      await streamChat({
        action: "quiz",
        textContent,
        numQuestions,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      toast.error("QUIZ GENERATION FAILED");
      setIsLoading(false);
    }
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
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>

      {/* Feature Panel */}
      <FeaturePanel 
        onRewrite={handleRewrite}
        onQuiz={handleQuiz}
        disabled={isLoading}
      />
    </div>
  );
};
