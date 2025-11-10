import {
  getSupabaseClient,
  CORS_HEADERS,
  getAuthenticatedUser,
  handlePreflight,
} from "../../utils.ts";

// -------------------------
// Type definitions
// -------------------------
interface NewEntry {
  title: string;
  content: string;
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

  let body: NewEntry;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  const { title, content } = body;

  // Insert new entry
  const { data, error } = await supabase
    .from("entries")
    .insert([
      {
        user_id: user.id,
        title: body.title,
        content: body.content,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Success response
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
