"use client";

import { useState, useEffect } from "react";

const GUEST_ID_KEY = "hem_guest_user_id";

export function useGuestSession() {
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Restore existing guest session from sessionStorage
    const stored = sessionStorage.getItem(GUEST_ID_KEY);
    if (stored) setGuestUserId(stored);
  }, []);

  const initGuestSession = async (): Promise<string | null> => {
    setIsInitializing(true);
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create guest session");
      const data = await res.json();
      const id = data.userId as string;
      sessionStorage.setItem(GUEST_ID_KEY, id);
      setGuestUserId(id);
      return id;
    } catch {
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  const clearGuestSession = () => {
    sessionStorage.removeItem(GUEST_ID_KEY);
    setGuestUserId(null);
  };

  return { guestUserId, isInitializing, initGuestSession, clearGuestSession };
}
