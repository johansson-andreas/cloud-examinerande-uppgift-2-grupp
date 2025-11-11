"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import EntryForm from "@/components/EntryForm";
import { Entry } from "@/types/database.types";
import { supabase } from "@/app/page";

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const entryId = id as string;

    async function load() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await fetch(
          `https://${process.env.NEXT_PUBLIC_PROJECT_REF}.functions.supabase.co/get-entry?id=${entryId}`,
          {
            headers: { Authorization: `Bearer ${session?.access_token}` },
          },
        );

        const data = await res.json();
        setEntry(data);
      } catch (_err: unknown) {
        setError("Failed to load entry");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const updateEntry = async (
    entryId: string,
    updates: { title: string; content: string },
  ) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_PROJECT_REF}.functions.supabase.co/update-entry`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          id: entryId,
          updates,
        }),
      },
    );

    const updatedEntry = await res.json();
    console.log(updatedEntry);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-warm-gray text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-warm-gray text-center">Entry not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 max-sm:text-center">
          <button
            onClick={() => router.back()}
            className="text-warm-gray hover:text-dark-brown text-sm mb-4"
          >
            ← Back to entries
          </button>
          <h1 className="text-4xl font-serif text-dark-brown mb-2">
            Edit Entry
          </h1>
          <p className="text-warm-gray text-sm">Edit your entry below</p>
        </div>

        <EntryForm
          initial={{ title: entry.title, content: entry.content }}
          submitLabel="Update Entry"
          onSave={async ({ title, content }) => {
            setError(null);
            try {
              await updateEntry(entry.id, { title, content });
              router.push("/dashboard");
            } catch (_err: unknown) {
              setError("Failed to update entry");
            }
          }}
        />
      </main>
    </div>
  );
}
