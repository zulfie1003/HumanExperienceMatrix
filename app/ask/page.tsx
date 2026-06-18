"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { QueryInput } from "@/components/QueryInput";
import { ResponseView } from "@/components/ResponseView";
import { useChat } from "@/hooks/useChat";
import { useGuestSession } from "@/hooks/useGuestSession";
import { Perspective, ChatResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, BookmarkPlus, BookmarkCheck } from "lucide-react";
import Link from "next/link";

export default function AskPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isGuestParam = searchParams.get("guest") === "true";

  const { guestUserId, initGuestSession } = useGuestSession();
  const [effectiveGuestId, setEffectiveGuestId] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [lastPerspectives, setLastPerspectives] = useState<Perspective[]>([]);
  const [savedConvId, setSavedConvId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const userId = session?.user?.id ?? effectiveGuestId;
  const { isLoading, error, response, sendMessage, reset } = useChat({
    guestUserId: effectiveGuestId,
  });

  // If the user arrived as guest, provision a guest ID
  useEffect(() => {
    if (isGuestParam && !session && !guestUserId) {
      initGuestSession().then((id) => setEffectiveGuestId(id));
    } else if (guestUserId) {
      setEffectiveGuestId(guestUserId);
    }
  }, [isGuestParam, session, guestUserId, initGuestSession]);

  const handleSubmit = async (question: string, perspectives: Perspective[]) => {
    // If no userId at all, init guest on the fly
    let gId = effectiveGuestId;
    if (!userId && !gId) {
      gId = await initGuestSession();
      setEffectiveGuestId(gId);
    }

    setLastQuestion(question);
    setLastPerspectives(perspectives);
    setIsSaved(false);
    setSavedConvId(null);

    const result: ChatResponse | null = await sendMessage(question, perspectives);
    if (result) {
      setSavedConvId(result.conversationId);
    }
  };

  const handleSave = async () => {
    if (!savedConvId || !session?.user?.id) return;
    setIsSaving(true);
    try {
      await fetch(`/api/user/conversations/${savedConvId}/save`, {
        method: "POST",
      });
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    setLastQuestion("");
    setLastPerspectives([]);
    setSavedConvId(null);
    setIsSaved(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {!response ? (
        <>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">What are you facing?</h1>
            <p className="text-muted-foreground text-sm">
              Describe a challenge, decision, or situation. The more context you
              provide, the richer the analysis.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 flex gap-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Something went wrong</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Consulting history, philosophy, and wisdom...</p>
              <p className="text-xs">This usually takes 10–20 seconds</p>
            </div>
          ) : (
            <QueryInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {!session && (
            <p className="text-xs text-center text-muted-foreground">
              <Link href="/login" className="underline">
                Sign in
              </Link>{" "}
              to save conversations. Guest sessions are temporary.
            </p>
          )}
        </>
      ) : (
        <>
          {/* Response header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleReset}>
              <ArrowLeft className="h-4 w-4" />
              New question
            </Button>
            <div className="flex items-center gap-2">
              {session?.user && savedConvId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
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
              )}
              {session?.user && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <ResponseView
            response={response.response}
            question={lastQuestion}
            perspectives={lastPerspectives.map((p) => p)}
          />

          <div className="pt-4">
            <Button onClick={handleReset} variant="outline" className="w-full">
              Ask another question
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
