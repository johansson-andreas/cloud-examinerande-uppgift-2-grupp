"use client";

import { useEffect } from "react";

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
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult | null;
  entries: Array<{ id: string; title: string | null }>;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  analysis,
  entries,
}: Props) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !analysis) return null;

  const titleById = new Map(
    entries.map((e) => [e.id, e.title ?? "(untitled)"]),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">AI Feedback</h3>
          <button
            className="text-sm px-2 py-1 rounded border"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded text-xs border">
              Overall: {analysis.overall.mood} (
              {analysis.overall.score.toFixed(2)})
            </span>
          </div>
          {analysis.overall.summary && (
            <p className="mt-2 text-sm text-neutral-700">
              {analysis.overall.summary}
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {analysis.items.map((it) => (
            <li key={it.entryId} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {titleById.get(it.entryId) ?? it.entryId}
                </div>
                <div className="text-sm">
                  {it.mood} ({it.score.toFixed(2)})
                </div>
              </div>
              {it.summary && <p className="text-sm mt-1">{it.summary}</p>}
              {!!it.tags?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {it.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded bg-neutral-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
