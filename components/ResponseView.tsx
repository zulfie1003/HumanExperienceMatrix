"use client";

import { AIResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  History,
  Lightbulb,
  BookOpen,
  RefreshCw,
  Compass,
  Users,
} from "lucide-react";

interface ResponseViewProps {
  response: AIResponse;
  question: string;
  perspectives: string[];
}

export function ResponseView({ response, question, perspectives }: ResponseViewProps) {
  return (
    <div className="space-y-6">
      {/* Question recap */}
      <div className="rounded-lg border bg-muted/40 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Your situation
        </p>
        <p className="text-sm">{question}</p>
        {perspectives.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {perspectives.map((p) => (
              <Badge key={p} variant="secondary" className="text-xs capitalize">
                {p}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Situation Summary */}
      <Section
        icon={<Brain className="h-5 w-5" />}
        title="Understanding Your Situation"
      >
        <p className="text-sm leading-relaxed">{response.situationSummary}</p>
      </Section>

      <Separator />

      {/* Underlying Pattern */}
      <Section
        icon={<RefreshCw className="h-5 w-5" />}
        title="The Underlying Human Pattern"
      >
        <p className="text-sm leading-relaxed">{response.underlyingPattern}</p>
      </Section>

      <Separator />

      {/* Historical Parallels */}
      <Section
        icon={<History className="h-5 w-5" />}
        title="Historical Parallels"
      >
        <div className="space-y-4">
          {response.historicalParallels.map((parallel, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm">{parallel.figure}</p>
                <Badge variant="outline" className="text-xs shrink-0">
                  {parallel.era}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {parallel.situation}
              </p>
              <div className="flex gap-2 pt-1">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{parallel.lesson}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Perspective Insights */}
      <Section
        icon={<Compass className="h-5 w-5" />}
        title="Perspective Analysis"
      >
        <div className="space-y-4">
          {response.perspectiveInsights.map((insight, i) => (
            <Card key={i}>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base">{insight.perspective}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <p className="text-sm leading-relaxed">{insight.insight}</p>
                {insight.keyThinkers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {insight.keyThinkers.map((thinker, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {thinker}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Repeating Patterns */}
      <Section
        icon={<Users className="h-5 w-5" />}
        title="Patterns Across History"
      >
        <ul className="space-y-2">
          {response.repeatingPatterns.map((pattern, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-primary font-bold shrink-0">→</span>
              {pattern}
            </li>
          ))}
        </ul>
      </Section>

      <Separator />

      {/* Practical Lessons */}
      <Section
        icon={<Lightbulb className="h-5 w-5" />}
        title="Practical Lessons"
      >
        <ol className="space-y-3">
          {response.practicalLessons.map((lesson, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="font-bold text-primary shrink-0 w-5">{i + 1}.</span>
              {lesson}
            </li>
          ))}
        </ol>
      </Section>

      <Separator />

      {/* Book Recommendations */}
      <Section
        icon={<BookOpen className="h-5 w-5" />}
        title="Recommended Reading"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {response.bookRecommendations.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}
