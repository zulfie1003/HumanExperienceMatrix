"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.name) setName(session.user.name);
  }, [status, session, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        await update({ name: name.trim() });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input value={session.user?.email ?? ""} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSaving || !name.trim()}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
            {saved && (
              <span className="text-sm text-green-600">Changes saved!</span>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">Account</h2>
        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
