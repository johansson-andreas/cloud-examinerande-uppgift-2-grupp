import {
  getSupabaseClient,
  CORS_HEADERS,
  getAuthenticatedUser,
  handlePreflight,
} from "../../utils.ts";

// -------------------------
// Edge Function: Search Entries
// -------------------------
Deno.serve(async (req: Request) => {
  // Handle preflight OPTIONS request
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  // Create Supabase client
  const supabase = getSupabaseClient(req);

  // Authenticate user
  const { user, error: userError } = await getAuthenticatedUser(supabase);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Get search query from URL
  const url = new URL(req.url);
  const query = url.searchParams.get("query")?.trim() ?? "";

  try {
    let data;

    if (!query) {
      // Empty query: return all entries
      const allEntries = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      data = allEntries.data;
      if (allEntries.error) throw allEntries.error;
    } else {
      const searchTerm = `%${query}%`;

      const searchResult = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .order("created_at", { ascending: false });

      data = searchResult.data;
      if (searchResult.error) throw searchResult.error;
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
