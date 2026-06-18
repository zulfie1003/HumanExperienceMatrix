"use client";

import { ConversationWithParsedResponse } from "@/types";
import { formatDate, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HistoryListProps {
  conversations: ConversationWithParsedResponse[];
  onDelete?: (id: string) => void;
  isDeleting?: string | null;
  emptyMessage?: string;
}

export function HistoryList({
  conversations,
  onDelete,
  isDeleting,
  emptyMessage = "No conversations yet.",
}: HistoryListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="rounded-lg border bg-card p-4 flex gap-3 items-start hover:bg-accent/10 transition-colors"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-medium leading-snug">
              {truncate(conv.userQuestion, 120)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDate(conv.createdAt)}
              </span>
              {conv.selectedPerspectives.slice(0, 3).map((p) => (
                <Badge key={p} variant="outline" className="text-xs capitalize py-0">
                  {p}
                </Badge>
              ))}
              {conv.selectedPerspectives.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{conv.selectedPerspectives.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link href={`/dashboard/conversation/${conv.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(conv.id)}
                disabled={isDeleting === conv.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
