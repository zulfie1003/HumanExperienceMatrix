import { BookRecommendation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: BookRecommendation;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-4 pb-4 flex gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1 min-w-0">
          <p className="font-semibold text-sm leading-snug">{book.title}</p>
          <p className="text-xs text-muted-foreground">by {book.author}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{book.relevance}</p>
        </div>
      </CardContent>
    </Card>
  );
}
