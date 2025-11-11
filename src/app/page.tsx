import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Home() {
  redirect("/login");
}
