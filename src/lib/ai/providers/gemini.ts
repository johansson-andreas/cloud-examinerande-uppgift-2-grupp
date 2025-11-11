import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  BatchFeedbackZ,
  type EntryLite,
  type BatchFeedback,
  type EntryFeedback,
  type Mood,
} from "../../../types/ai.types";

const MODEL_ID = process.env.GEMINI_MODEL_ID ?? "gemini-2.5-flash";

export async function analyzeEntriesGemini(
  entries: EntryLite[],
  locale: string = "en",
): Promise<BatchFeedback> {
  if (!process.env.GOOGLE_API_KEY) {
    const items: EntryFeedback[] = (entries ?? []).slice(0, 10).map((e) => ({
      entryId: e.id,
      mood: "neutral",
      score: 0,
      tags: [],
      summary: "No AI analysis (missing GOOGLE_API_KEY).",
    }));
    return {
      items,
      overall: {
        mood: "neutral",
        score: 0,
        summary: "No AI analysis executed.",
      },
    };
  }

  const safe: EntryLite[] = (entries ?? []).slice(0, 10).map((e) => ({
    id: e.id,
    title: (e.title ?? "").slice(0, 140),
    content: (e.content ?? "").slice(0, 2000),
    created_at: e.created_at,
  }));

  const prompt = JSON.stringify({
    language: locale,
    task: "Analyze these journal entries and return output that matches the provided JSON schema.",
    entries: safe.map((e) => ({
      id: e.id,
      title: e.title ?? null,
      content: e.content ?? null,
      created_at: e.created_at,
    })),
  });

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  const res = await ai.models.generateContent({
    model: MODEL_ID,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(BatchFeedbackZ),
    },
  });

  const text = res.text;
  if (!text) throw new Error("Empty response from model.");

  const parsed = BatchFeedbackZ.parse(JSON.parse(text));

  const ids = new Set(safe.map((e) => e.id));
  const clamp = (x: number) => Math.max(-1, Math.min(1, x));

  const items: EntryFeedback[] = parsed.items
    .filter((it) => ids.has(it.entryId))
    .map((it) => ({
      entryId: it.entryId,
      mood: it.mood as Mood,
      score: clamp(it.score),
      tags: (it.tags ?? []).slice(0, 8),
      summary: it.summary.slice(0, 600),
    }));

  const overall = {
    mood: parsed.overall.mood as Mood,
    score: clamp(parsed.overall.score),
    summary: parsed.overall.summary.slice(0, 600),
  };

  return { items, overall };
}
