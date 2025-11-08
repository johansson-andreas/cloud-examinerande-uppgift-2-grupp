"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import EntryCard from "@/components/EntryCard";
import { getEntries } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/supabase/auth";
import { Entry } from "@/types/database.types";
import Link from "next/link";
import Search from "@/components/Search";
import { searchEntries } from "@/lib/supabase/queries";

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const refreshEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (_err: unknown) {
      setError("Failed to load entries");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.push("/login");
          return;
        }

        await refreshEntries();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const results = await searchEntries(query);
      setEntries(results);
    } catch (_err: unknown) {
      setError("Failed to search entries");
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-warm-gray text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto py-12 px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="w-full flex flex-col max-sm:text-center sm:flex-row sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif text-dark-brown mb-2">
                Your Entries
              </h2>
              <p className="text-warm-gray text-sm">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </p>
            </div>

            <Link href="/new-entry">
              <button className="btn-primary" style={{ minWidth: "160px" }}>
                New Entry
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <Search onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-gray mb-6">
              You haven't written any entries yet.
            </p>
            <Link href="/new-entry">
              <button className="btn-secondary">Write your first entry</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={refreshEntries}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
