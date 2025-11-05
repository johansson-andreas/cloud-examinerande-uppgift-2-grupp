"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import EntryForm from "@/components/EntryForm";
import { createEntry } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/supabase/auth";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, _setTitle] = useState("");
  const [content, _setContent] = useState("");
  const [_error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  const displayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-warm-gray hover:text-dark-brown text-sm mb-4"
          >
            ← Back to entries
          </button>
          <h1 className="text-4xl font-serif text-dark-brown mb-2">
            New Entry
          </h1>
          <p className="text-warm-gray text-sm">{displayDate}</p>
        </div>

        <EntryForm
          initial={{ title, content }}
          submitLabel={loading ? "Saving..." : "Save Entry"}
          onSave={async ({ title, content }) => {
            setError(null);
            setLoading(true);
            try {
              await createEntry({ title, content });
              router.push("/dashboard");
            } catch (_err: unknown) {
              setError("Failed to create entry");
              setLoading(false);
            }
          }}
        />
      </main>
    </div>
  );
}
