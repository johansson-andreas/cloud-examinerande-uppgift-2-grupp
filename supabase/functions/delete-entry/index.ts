import {
  getSupabaseClient,
  CORS_HEADERS,
  getAuthenticatedUser,
  handlePreflight,
} from "../../utils.ts";

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

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { error } = await supabase
    .from("entries")
    .delete()
    .match({ id, user_id: user.id });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ message: "Entry deleted" }), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
