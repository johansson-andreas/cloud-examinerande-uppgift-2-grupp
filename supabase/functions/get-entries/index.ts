import {
  getSupabaseClient,
  CORS_HEADERS,
  getAuthenticatedUser,
  handlePreflight,
} from "../../utils.ts";

Deno.serve(async (req: Request) => {
  try {
    const preflight = handlePreflight(req);
    if (preflight) return preflight;

    const supabase = getSupabaseClient(req);

    const { user, error: userError } = await getAuthenticatedUser(supabase);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
