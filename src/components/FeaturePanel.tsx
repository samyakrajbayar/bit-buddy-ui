import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FeaturePanelProps {
  onRewrite: (interests: string, text: string) => void;
  onQuiz: (numQuestions: number, text: string) => void;
  disabled?: boolean;
}

export const FeaturePanel = ({ onRewrite, onQuiz, disabled }: FeaturePanelProps) => {
  const [interests, setInterests] = useState("football, anime, coding");
  const [textContent, setTextContent] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div className="p-4 border-t-[3px] border-border bg-muted space-y-3">
      <div className="text-[10px] text-muted-foreground font-bold">◆ STUDY TOOLS ◆</div>
      
      <div className="space-y-2">
        <Label className="text-[10px]">YOUR INTERESTS</Label>
        <Input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="football, anime, coding..."
          className="pixel-border bg-input text-xs"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px]">TEXTBOOK TEXT</Label>
        <Textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="PASTE TEXTBOOK CONTENT HERE..."
          className="pixel-border bg-input text-xs h-24 resize-none"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onRewrite(interests, textContent)}
          disabled={!textContent.trim() || disabled}
          className="pixel-border bg-primary text-primary-foreground hover:bg-primary/80 text-[10px] px-3 py-2 flex-1"
        >
          ★ REWRITE FOR ME
        </Button>
        
        <div className="flex gap-1 items-center">
          <Input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
            className="pixel-border bg-input text-xs w-12 h-8 text-center p-0"
            disabled={disabled}
          />
          <Button
            onClick={() => onQuiz(numQuestions, textContent)}
            disabled={!textContent.trim() || disabled}
            className="pixel-border bg-accent text-accent-foreground hover:bg-accent/80 text-[10px] px-3 py-2"
          >
            ? QUIZ
          </Button>
        </div>
      </div>
    </div>
  );
};
