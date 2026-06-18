"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ResponseView } from "@/components/ResponseView";
import { ConversationWithParsedResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  BookmarkPlus,
  BookmarkCheck,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ConversationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [conversation, setConversation] = useState<ConversationWithParsedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchConversation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/conversations/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setConversation(data.conversation);

        // Check if saved
        const savedRes = await fetch("/api/user/saved");
        const savedData = await savedRes.json();
        const savedIds = (savedData.conversations ?? []).map(
          (c: ConversationWithParsedResponse) => c.id
        );
        setIsSaved(savedIds.includes(id));
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id, status]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await fetch(`/api/user/conversations/${id}/save`, { method: "DELETE" });
        setIsSaved(false);
      } else {
        await fetch(`/api/user/conversations/${id}/save`, { method: "POST" });
        setIsSaved(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this conversation? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
        <h1 className="text-xl font-semibold">Conversation not found</h1>
        <p className="text-sm text-muted-foreground">
          This conversation may have been deleted or does not belong to your account.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!conversation) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {formatDate(conversation.createdAt)}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <ResponseView
        response={conversation.aiResponse}
        question={conversation.userQuestion}
        perspectives={conversation.selectedPerspectives}
      />

      <div className="pt-4 flex gap-3">
        <Link href="/ask" className="flex-1">
          <Button variant="outline" className="w-full">
            Ask a new question
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
