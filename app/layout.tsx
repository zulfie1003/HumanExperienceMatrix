import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Human Experience Matrix",
  description:
    "Understand your life challenges through history, philosophy, psychology, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
