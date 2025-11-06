/**
 * Supabase Edge Function: Update an existing entry for the authenticated user
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// -------------------------
// Type definitions
// -------------------------
interface UpdateEntry {
  id: string; // ID of the entry to update
  updates: {
    title?: string; // Optional new title
    content?: string; // Optional new content
  };
}

interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

// -------------------------
// Supabase client
// -------------------------
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

// -------------------------
// CORS headers
// -------------------------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Replace with frontend URL in production
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
};

// -------------------------
// Edge Function
// -------------------------
Deno.serve(async (req: Request) => {
  try {
    // Handle preflight OPTIONS
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only allow PUT for updates
    if (req.method !== "PUT") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Parse request body
    let body: UpdateEntry;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const { id, updates } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing entry ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    if (
      !updates ||
      (updates.title === undefined && updates.content === undefined)
    ) {
      return new Response(JSON.stringify({ error: "No updates provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Extract token from Authorization header
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Create Supabase client using user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Update entry in Supabase
    const { data, error } = await supabase
      .from<Entry>("entries")
      .update(updates)
      .match({ id, user_id: user.id })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Success response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});
