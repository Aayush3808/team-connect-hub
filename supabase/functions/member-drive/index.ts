import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const gatewayBase = "https://connector-gateway.lovable.dev/google_drive";
const driveFolderMime = "application/vnd.google-apps.folder";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const getUser = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authHeader } } });
  const { data } = await client.auth.getUser();
  return data.user ?? null;
};

const gateway = async (path: string, options: RequestInit = {}) => {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const driveKey = Deno.env.get("GOOGLE_DRIVE_API_KEY");
  if (!lovableKey || !driveKey) throw new Error("Google Drive is not connected to this workspace.");
  const response = await fetch(`${gatewayBase}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": driveKey, ...(options.headers ?? {}) },
  });
  if (!response.ok) {
    const details = await response.text();
    console.error(`Drive gateway failed [${response.status}]: ${details}`);
    throw new Error(`Google Drive request failed (${response.status}): ${details}`);
  }
  return response;
};

const admin = () => createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

const ensureFolder = async (userId: string, username: string) => {
  const service = admin();
  const { data: existing, error: readError } = await service.from("member_drive_folders").select("folder_id").eq("user_id", userId).maybeSingle();
  if (readError) throw readError;
  if (existing?.folder_id) return existing.folder_id;

  const folderResponse = await gateway("/drive/v3/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `SWAMN — ${username}`, mimeType: driveFolderMime }) });
  const folder = await folderResponse.json() as { id?: string };
  if (!folder.id) throw new Error("Google Drive did not return a folder ID.");
  const { error: insertError } = await service.from("member_drive_folders").insert({ user_id: userId, folder_id: folder.id });
  if (insertError && insertError.code !== "23505") throw insertError;
  return folder.id;
};

const verifyFileInFolder = async (fileId: string, folderId: string) => {
  const response = await gateway(`/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,parents`);
  const file = await response.json() as { id?: string; parents?: string[] };
  if (!file.id || !file.parents?.includes(folderId)) throw new Error("That file is not in your private folder.");
};

const uint8ToBase64 = (value: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < value.length; index += chunkSize) binary += String.fromCharCode(...value.subarray(index, Math.min(index + chunkSize, value.length)));
  return btoa(binary);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: "Please sign in to access your files." }, 401);
    const body = await req.json() as { action?: string; fileId?: string; fileName?: string; mimeType?: string; contentBase64?: string };
    const service = admin();
    const { data: profile } = await service.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
    const username = profile?.username ?? user.email?.split("@")[0] ?? "member";
    const folderId = await ensureFolder(user.id, username);

    if (body.action === "list") {
      const query = new URLSearchParams({ q: `'${folderId}' in parents and trashed = false`, fields: "files(id,name,mimeType,size,modifiedTime)", orderBy: "modifiedTime desc", pageSize: "100" });
      const response = await gateway(`/drive/v3/files?${query.toString()}`);
      return json(await response.json());
    }

    if (!body.action || !["download", "delete", "upload"].includes(body.action)) return json({ error: "Unsupported file action." }, 400);
    if (body.action !== "upload" && !body.fileId) return json({ error: "A file ID is required." }, 400);

    if (body.action === "upload") {
      if (!body.fileName || !body.contentBase64) return json({ error: "A file and file name are required." }, 400);
      const content = Uint8Array.from(atob(body.contentBase64), (character) => character.charCodeAt(0));
      if (content.byteLength > 10 * 1024 * 1024) return json({ error: "Files must be smaller than 10 MB." }, 413);
      const boundary = `swamn-${crypto.randomUUID()}`;
      const metadata = JSON.stringify({ name: body.fileName, parents: [folderId], mimeType: body.mimeType || "application/octet-stream" });
      const encoder = new TextEncoder();
      const prefix = encoder.encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${body.mimeType || "application/octet-stream"}\r\n\r\n`);
      const suffix = encoder.encode(`\r\n--${boundary}--`);
      const multipart = new Uint8Array(prefix.length + content.length + suffix.length);
      multipart.set(prefix); multipart.set(content, prefix.length); multipart.set(suffix, prefix.length + content.length);
      const response = await gateway("/upload/drive/v3/files?uploadType=multipart", { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body: multipart });
      return json(await response.json());
    }

    await verifyFileInFolder(body.fileId as string, folderId);
    if (body.action === "delete") {
      await gateway(`/drive/v3/files/${encodeURIComponent(body.fileId as string)}`, { method: "DELETE" });
      return json({ ok: true });
    }

    const response = await gateway(`/drive/v3/files/${encodeURIComponent(body.fileId as string)}?alt=media`);
    return json({ contentBase64: uint8ToBase64(new Uint8Array(await response.arrayBuffer())) });
  } catch (error) {
    console.error("member-drive error:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to access your private files." }, 500);
  }
});