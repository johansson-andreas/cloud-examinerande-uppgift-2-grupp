import { z } from "zod";

export const MOODS = ["positive", "neutral", "negative"] as const;
export type Mood = (typeof MOODS)[number];

export const MoodZ = z.enum(["positive", "neutral", "negative"]);

export const Entry = z.object({
  id: z.string().describe("Primary key of the entry."),
  title: z.string().nullable().describe("Optional title of the entry."),
  content: z
    .string()
    .nullable()
    .describe("Optional body content of the entry."),
  created_at: z
    .string()
    .describe("ISO timestamp of when the entry was created."),
});
export type EntryLite = z.infer<typeof Entry>;

export const EntryFeedback = z.object({
  entryId: z.string().describe("ID of the source entry."),
  mood: MoodZ.describe("Classified mood."),
  score: z.number().min(-1).max(1).describe("Mood score in range [-1..1]."),
  tags: z.array(z.string()).max(8).default([]).describe("Relevant tags."),
  summary: z.string().max(600).describe("Short summary."),
});
export type EntryFeedback = z.infer<typeof EntryFeedback>;

export const BatchFeedbackZ = z.object({
  items: z.array(EntryFeedback),
  overall: z.object({
    mood: MoodZ,
    score: z.number().min(-1).max(1),
    summary: z.string().max(600),
  }),
});
export type BatchFeedback = z.infer<typeof BatchFeedbackZ>;
