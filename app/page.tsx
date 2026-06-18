import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, History, BookOpen, Lightbulb, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: <History className="h-5 w-5" />,
    title: "Historical Context",
    description:
      "See how historical figures faced the same challenges you're dealing with today.",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Multi-Perspective Analysis",
    description:
      "Explore your situation through psychology, philosophy, science, and spirituality.",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Curated Reading",
    description:
      "Get book recommendations specifically tailored to your situation.",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Practical Insights",
    description:
      "Distilled lessons from human history to apply to your life right now.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <Brain className="h-4 w-4" />
          AI-powered wisdom from across human history
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Your problems are not new.{" "}
          <span className="text-primary">History has answers.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Describe any life challenge and receive deep analysis connecting your
          situation to historical figures, philosophical frameworks, psychological
          research, and practical wisdom.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/ask">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Start exploring
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Sign in to save history
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">No account required to try</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {FEATURES.map((feature, i) => (
          <div key={i} className="rounded-lg border p-5 space-y-2">
            <div className="text-primary">{feature.icon}</div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Perspectives */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Six perspectives on every problem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { emoji: "📜", label: "History" },
            { emoji: "🧠", label: "Psychology" },
            { emoji: "🏛️", label: "Philosophy" },
            { emoji: "🚀", label: "Entrepreneurship" },
            { emoji: "🔬", label: "Science" },
            { emoji: "✨", label: "Spirituality" },
          ].map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span>{p.emoji}</span>
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
