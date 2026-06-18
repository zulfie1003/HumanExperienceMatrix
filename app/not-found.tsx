import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Link href="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
