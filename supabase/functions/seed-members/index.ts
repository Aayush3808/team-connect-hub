import { createClient } from "npm:@supabase/supabase-js@2";

const members: Array<{ username: string; displayName: string; password: string }> = [
  { username: "rishi", displayName: "Rishi Singh", password: "Swamn-Rishi-4721!" },
  { username: "vaibhav", displayName: "Vaibhav Raj", password: "Swamn-Vaibhav-8153!" },
  { username: "aayush", displayName: "Aayush Kumar Singh", password: "Swamn-Aayush-6390!" },
  { username: "manan", displayName: "Manan", password: "Swamn-Manan-2748!" },
  { username: "adarsh", displayName: "Adarsh Kumar", password: "Swamn-Adarsh-5067!" },
  { username: "satvik", displayName: "Satvik", password: "Swamn-Satvik-9184!" },
  { username: "annapurna", displayName: "Annapurna", password: "Swamn-Annapurna-3625!" },
];

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const results: Array<{ username: string; status: string }> = [];

  for (const member of members) {
    const email = `${member.username}@members.swamn.com`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: member.password,
      email_confirm: true,
      user_metadata: { username: member.username, display_name: member.displayName },
    });

    let userId = data?.user?.id ?? null;

    if (error) {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = list?.users.find((user) => user.email === email);
      if (!existing) {
        results.push({ username: member.username, status: `failed: ${error.message}` });
        continue;
      }
      userId = existing.id;
      await admin.auth.admin.updateUserById(existing.id, { password: member.password });
      results.push({ username: member.username, status: "password reset" });
    } else {
      results.push({ username: member.username, status: "created" });
    }

    if (userId) {
      await admin.from("profiles").upsert(
        { user_id: userId, username: member.username, display_name: member.displayName },
        { onConflict: "user_id" },
      );
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
});
