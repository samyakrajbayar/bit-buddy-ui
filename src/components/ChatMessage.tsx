import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full mb-4", isBot ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[80%] relative")}>
        <div
          className={cn(
            "p-4 pixel-border relative",
            isBot
              ? "bg-card text-card-foreground speech-bubble"
              : "bg-primary text-primary-foreground"
          )}
        >
          <p className="text-xs leading-relaxed break-words">{message}</p>
        </div>
        <span className="text-[8px] mt-1 block opacity-70">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
