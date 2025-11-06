/**
 * Supabase Edge Function: Update an existing entry for the authenticated user
 */

import {
  getSupabaseClient,
  CORS_HEADERS,
  getAuthenticatedUser,
  handlePreflight,
} from "../../utils.ts";

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

// -------------------------
// Edge Function
// -------------------------
Deno.serve(async (req: Request) => {
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  const supabase = getSupabaseClient(req);

  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

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

  const { data, error } = await supabase
    .from("entries")
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
});
