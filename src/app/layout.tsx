export const dynamic = "force-dynamic";
// Docker image build fails if it doesn't have access to Supabase keys
// Temp workaround: force-dynamic

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal App",
  description: "A minimalist journaling application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
