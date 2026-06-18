"use client";

import { useState } from "react";
import { ChatRequest, ChatResponse, Perspective } from "@/types";

interface UseChatOptions {
  guestUserId?: string | null;
}

interface UseChatState {
  isLoading: boolean;
  error: string | null;
  response: ChatResponse | null;
}

export function useChat({ guestUserId }: UseChatOptions = {}) {
  const [state, setState] = useState<UseChatState>({
    isLoading: false,
    error: null,
    response: null,
  });

  const sendMessage = async (
    question: string,
    perspectives: Perspective[]
  ): Promise<ChatResponse | null> => {
    setState({ isLoading: true, error: null, response: null });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (guestUserId) {
        headers["x-guest-user-id"] = guestUserId;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ question, perspectives } satisfies ChatRequest),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setState({ isLoading: false, error: null, response: data });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ isLoading: false, error: message, response: null });
      return null;
    }
  };

  const reset = () => {
    setState({ isLoading: false, error: null, response: null });
  };

  return { ...state, sendMessage, reset };
}
