import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Real contact addresses used for password recovery, keyed by team username.
const recoveryEmails: Record<string, string> = {
  adarsh: "adarshkumar917070@gmail.com",
  rishi: "rishisingh@swamn.com",
  annapurna: "annapurna8808@gmail.com",
  aayush: "ias.dm.3808@gmail.com",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const service = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const results: Record<string, string> = {};
  for (const [username, email] of Object.entries(recoveryEmails)) {
    const { data: profile } = await service.from("profiles").select("user_id").eq("username", username).maybeSingle();
    if (!profile?.user_id) {
      results[username] = "no account";
      continue;
    }
    const { error } = await service.auth.admin.updateUserById(profile.user_id, {
      email,
      email_confirm: true,
    });
    results[username] = error ? `failed: ${error.message}` : "updated";
  }

  return json({ results });
});
