export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";
import { analyzeEntries } from "@/lib/ai";
import type { EntryLite } from "../../../../types/ai.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type DbEntry = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: auth } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return json({ error: "User not authenticated" }, 401);
  }

  const { data, error: entriesError } = await supabase
    .from("entries")
    .select("id,title,content,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (entriesError) {
    return json(
      { error: "Failed to load entries", details: entriesError.message },
      400,
    );
  }

  const rows: DbEntry[] = (data ?? []) as DbEntry[];

  if (rows.length === 0) {
    return json({
      overall: {
        mood: "neutral",
        score: 0,
        summary: "No entries to analyze at the moment.",
      },
      items: [],
    });
  }

  const entriesLite: EntryLite[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    created_at: r.created_at,
  }));

  try {
    const analysis = await analyzeEntries(entriesLite, "sv");

    const failed: string[] = [];
    for (const item of analysis.items) {
      const { error: upsertErr } = await supabase.from("entry_insights").upsert(
        {
          entry_id: item.entryId,
          user_id: user.id,
          mood: item.mood,
          score: item.score,
          tags: item.tags,
          summary: item.summary,
        },
        { onConflict: "entry_id" },
      );

      if (upsertErr) {
        console.error("Upsert error:", upsertErr.message);
        failed.push(item.entryId);
      }
    }

    return json({
      ok: true,
      overall: analysis.overall,
      items: analysis.items,
      ...(failed.length
        ? { warning: `Failed to save insights for ${failed.length} item(s).` }
        : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("AI analysis error:", message);
    return json({ error: "Analysis failed", details: message }, 500);
  }
}
