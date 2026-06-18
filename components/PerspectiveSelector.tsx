"use client";

import { Perspective } from "@/types";
import { cn } from "@/lib/utils";

const PERSPECTIVES: { value: Perspective; label: string; emoji: string }[] = [
  { value: "all", label: "All Perspectives", emoji: "🌐" },
  { value: "history", label: "History", emoji: "📜" },
  { value: "psychology", label: "Psychology", emoji: "🧠" },
  { value: "philosophy", label: "Philosophy", emoji: "🏛️" },
  { value: "entrepreneurship", label: "Entrepreneurship", emoji: "🚀" },
  { value: "science", label: "Science", emoji: "🔬" },
  { value: "spirituality", label: "Spirituality", emoji: "✨" },
];

interface PerspectiveSelectorProps {
  selected: Perspective[];
  onChange: (perspectives: Perspective[]) => void;
  disabled?: boolean;
}

export function PerspectiveSelector({
  selected,
  onChange,
  disabled = false,
}: PerspectiveSelectorProps) {
  const toggle = (value: Perspective) => {
    if (disabled) return;

    if (value === "all") {
      // Toggle "all" — deselect everything else
      onChange(selected.includes("all") ? [] : ["all"]);
      return;
    }

    // If "all" was selected, switch to individual
    const withoutAll = selected.filter((p) => p !== "all");

    if (withoutAll.includes(value)) {
      onChange(withoutAll.filter((p) => p !== value));
    } else {
      onChange([...withoutAll, value]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Choose perspectives (optional — defaults to all)
      </p>
      <div className="flex flex-wrap gap-2">
        {PERSPECTIVES.map((p) => {
          const isSelected = selected.includes(p.value);
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => toggle(p.value)}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span>{p.emoji}</span>
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
