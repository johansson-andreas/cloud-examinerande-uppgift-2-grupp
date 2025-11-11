"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type AnalysisResult = {
  overall: { mood: string; score: number; summary: string };
  items: Array<{
    entryId: string;
    mood: string;
    score: number;
    tags: string[];
    summary: string;
  }>;
};

type Props = {
  onDone?: () => void;
  onResult?: (result: AnalysisResult) => void;
};

export default function AnalyzeButton({ onDone, onResult }: Props) {
  const [loading, setLoading] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setAnalysisMessage(null);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("User not authenticated.");
        return;
      }

      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Analysis failed.");
        return;
      }

      setAnalysisMessage(
        `Overall mood: ${json.overall.mood} (${json.overall.score}).`,
      );
      onResult?.(json);
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        className="btn-secondary"
        disabled={loading}
        onClick={handleAnalyze}
      >
        {loading ? "Analyzing…" : "Analyze latest 10"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {analysisMessage && !error && (
        <span className="text-sm text-warm-gray">{analysisMessage}</span>
      )}
    </div>
  );
}
