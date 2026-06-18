"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HistoryList } from "@/components/HistoryList";
import { ConversationWithParsedResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BookmarkIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

type Tab = "history" | "saved";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("history");
  const [conversations, setConversations] = useState<ConversationWithParsedResponse[]>([]);
  const [savedConversations, setSavedConversations] = useState<ConversationWithParsedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const [histRes, savedRes] = await Promise.all([
        fetch("/api/user/conversations"),
        fetch("/api/user/saved"),
      ]);
      const histData = await histRes.json();
      const savedData = await savedRes.json();
      setConversations(histData.conversations ?? []);
      setSavedConversations(savedData.conversations ?? []);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchConversations();
    }
  }, [status, fetchConversations]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/user/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setSavedConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setIsDeleting(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  const activeList = tab === "history" ? conversations : savedConversations;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {session.user?.name ?? session.user?.email}
          </p>
        </div>
        <Link href="/ask">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New question
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-4 space-y-1">
          <p className="text-2xl font-bold">{conversations.length}</p>
          <p className="text-xs text-muted-foreground">Total conversations</p>
        </div>
        <div className="rounded-lg border p-4 space-y-1">
          <p className="text-2xl font-bold">{savedConversations.length}</p>
          <p className="text-xs text-muted-foreground">Saved conversations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setTab("history")}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClockIcon className="h-4 w-4" />
          History
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "saved"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookmarkIcon className="h-4 w-4" />
          Saved
        </button>
      </div>

      {/* List */}
      <HistoryList
        conversations={activeList}
        onDelete={tab === "history" ? handleDelete : undefined}
        isDeleting={isDeleting}
        emptyMessage={
          tab === "history"
            ? "No conversations yet. Ask your first question!"
            : "No saved conversations yet. Save one from the Ask page."
        }
      />
    </div>
  );
}
