"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PerspectiveSelector } from "@/components/PerspectiveSelector";
import { Perspective } from "@/types";
import { Send, Mic } from "lucide-react";

interface QueryInputProps {
  onSubmit: (question: string, perspectives: Perspective[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function QueryInput({
  onSubmit,
  isLoading = false,
  placeholder = "Describe a life challenge, problem, or question you're facing...",
}: QueryInputProps) {
  const [question, setQuestion] = useState("");
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed, perspectives);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = question.length;
  const maxChars = 2000;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={5}
          disabled={isLoading}
          className="resize-none pr-12 text-base"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            title="Voice input (coming soon)"
            disabled
            className="text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
        >
          {charCount}/{maxChars}
        </span>
        <p className="text-xs text-muted-foreground">⌘+Enter to submit</p>
      </div>

      <PerspectiveSelector
        selected={perspectives}
        onChange={setPerspectives}
        disabled={isLoading}
      />

      <Button
        onClick={handleSubmit}
        disabled={!question.trim() || isLoading || isOverLimit}
        className="w-full gap-2"
        size="lg"
      >
        <Send className="h-4 w-4" />
        {isLoading ? "Analyzing..." : "Explore this situation"}
      </Button>
    </div>
  );
}
