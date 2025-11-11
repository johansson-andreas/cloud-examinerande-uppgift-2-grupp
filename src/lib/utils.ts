import { supabase } from "@/app/page";
import { Session } from "@supabase/supabase-js";

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const fetchData = async (
  functionType: string,
  session: Session | null,
) => {
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_PROJECT_REF}.functions.supabase.co/${functionType}`,
    {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    },
  );
  return res;
};
