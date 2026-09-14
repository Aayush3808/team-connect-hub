import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const admin = () =>
  createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

const anon = () =>
  createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const emailForUsername = async (username: string) => {
  const service = admin();
  const { data: profile } = await service
    .from("profiles")
    .select("user_id")
    .eq("username", username)
    .maybeSingle();
  if (!profile?.user_id) return null;
  const { data } = await service.auth.admin.getUserById(profile.user_id);
  return data.user?.email ?? null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json() as { action?: string; username?: string; password?: string; redirectTo?: string };
    const username = normalize(body.username);
    if (!/^[a-z0-9._-]{3,40}$/.test(username)) return json({ error: "Enter your assigned team username." }, 400);

    if (body.action === "login") {
      if (!body.password) return json({ error: "Enter your password." }, 400);
      const email = await emailForUsername(username);
      if (!email) return json({ error: "That username or password is not recognised." }, 401);
      const { data, error } = await anon().auth.signInWithPassword({ email, password: body.password });
      if (error || !data.session) return json({ error: "That username or password is not recognised." }, 401);
      return json({ session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } });
    }

    if (body.action === "reset") {
      const email = await emailForUsername(username);
      if (email && !email.endsWith("@members.swamn.com")) {
        const redirectTo = typeof body.redirectTo === "string" && body.redirectTo.startsWith("http")
          ? body.redirectTo
          : "https://swamn.com/team/reset-password";
        await anon().auth.resetPasswordForEmail(email, { redirectTo });
      }
      return json({ ok: true });
    }

    return json({ error: "Unsupported action." }, 400);
  } catch (error) {
    console.error("member-auth error:", error);
    return json({ error: "Unable to complete that request." }, 500);
  }
});
