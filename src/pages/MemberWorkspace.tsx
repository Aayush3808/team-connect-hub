import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Download, Eye, FileUp, FolderLock, LogOut, RefreshCw, Share2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/swamn/Logo";
import { MemberDashboard } from "@/components/swamn/MemberDashboard";
import { MemberExtras } from "@/components/swamn/MemberExtras";
import { AdminPanel } from "@/components/swamn/AdminPanel";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  sharedBy?: string;
};

type Member = { user_id: string; display_name: string; designation: string | null; avatar_url: string | null };

const readFunctionError = async (error: unknown) => {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json() as { details?: string; error?: string };
      return body.details || body.error || "The file service could not complete that request.";
    } catch {
      return "The file service could not complete that request.";
    }
  }
  return error instanceof Error ? error.message : "The file service could not complete that request.";
};

const formatSize = (size?: string) => {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes < 1) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const decodeBase64 = (value: string, mimeType = "application/octet-stream") => {
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
};

const MemberWorkspace = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [sharedFiles, setSharedFiles] = useState<DriveFile[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Team member");
  const [designation, setDesignation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ name: string; mimeType: string; url: string } | null>(null);
  const [shareFile, setShareFile] = useState<DriveFile | null>(null);
  const [shareTarget, setShareTarget] = useState("");
  const fileCache = useRef(new Map<string, Blob>());

  const logActivity = useCallback(async (kind: string, detail: string) => {
    if (!userId) return;
    await supabase.from("activity_log").insert({ user_id: userId, kind, detail });
  }, [userId]);

  const loadDriveFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    const [own, shared] = await Promise.all([
      supabase.functions.invoke("member-drive", { body: { action: "list" } }),
      supabase.functions.invoke("member-drive", { body: { action: "list-shared" } }),
    ]);
    if (own.error) setError(await readFunctionError(own.error));
    else setFiles((own.data?.files ?? []) as DriveFile[]);
    setSharedFiles((shared.data?.files ?? []) as DriveFile[]);
    setLoading(false);
  }, []);

  const loadWorkspace = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate("/team", { replace: true });
      return;
    }

    const id = sessionData.session.user.id;
    setUserId(id);
    const [{ data: profile, error: profileError }, { data: roles }, { data: allProfiles, error: directoryError }] = await Promise.all([
      supabase.from("profiles").select("display_name, avatar_url, designation").eq("user_id", id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", id),
      supabase.from("profiles").select("user_id, display_name, designation, avatar_url").order("display_name"),
    ]);
    if (profileError) setError("Your profile could not be loaded. Please refresh the page.");
    if (profile?.display_name) setDisplayName(profile.display_name);
    setAvatarUrl(profile?.avatar_url ?? null);
    setDesignation(profile?.designation ?? "");
    setIsAdmin((roles ?? []).some((entry) => entry.role === "admin"));
    setMembers(((allProfiles ?? []) as Member[]).filter((member) => member.user_id !== id));
    if (directoryError) setError("The team directory could not be loaded, so sharing is temporarily unavailable.");
    await loadDriveFiles();
  }, [loadDriveFiles, navigate]);

  useEffect(() => { void loadWorkspace(); }, [loadWorkspace]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Files must be smaller than 10 MB.");
      return;
    }

    setActiveAction("upload");
    setError("");
    setMessage("");
    const contentBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("Could not read this file."));
      reader.readAsDataURL(file);
    });
    const { error: functionError } = await supabase.functions.invoke("member-drive", {
      body: { action: "upload", fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64 },
    });
    if (functionError) setError(await readFunctionError(functionError));
    else {
      setMessage(`${file.name} was added to your folder.`);
      await logActivity("upload", `Uploaded ${file.name}`);
      await loadDriveFiles();
      setRefreshKey((value) => value + 1);
    }
    setActiveAction(null);
  };

  const fetchFile = async (file: DriveFile) => {
    const cached = fileCache.current.get(file.id);
    if (cached) return cached;
    const { data, error: functionError } = await supabase.functions.invoke("member-drive", { body: { action: "download", fileId: file.id } });
    if (functionError) {
      setError(await readFunctionError(functionError));
      return null;
    }
    const blob = decodeBase64(data.contentBase64, data.mimeType || file.mimeType);
    fileCache.current.set(file.id, blob);
    return blob;
  };

  const previewFile = async (file: DriveFile) => {
    setActiveAction(`preview:${file.id}`);
    setError("");
    const blob = await fetchFile(file);
    if (blob) setPreview({ name: file.name, mimeType: blob.type || file.mimeType, url: URL.createObjectURL(blob) });
    setActiveAction(null);
  };

  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const downloadFile = async (file: DriveFile) => {
    setActiveAction(`download:${file.id}`);
    setError("");
    const blob = await fetchFile(file);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    setActiveAction(null);
  };

  const deleteFile = async (file: DriveFile) => {
    if (!window.confirm(`Remove ${file.name} from your folder?`)) return;
    setActiveAction(`delete:${file.id}`);
    setError("");
    const { error: functionError } = await supabase.functions.invoke("member-drive", { body: { action: "delete", fileId: file.id } });
    if (functionError) setError(await readFunctionError(functionError));
    else {
      setMessage(`${file.name} was removed.`);
      fileCache.current.delete(file.id);
      await logActivity("delete", `Removed ${file.name}`);
      setFiles((current) => current.filter((item) => item.id !== file.id));
    }
    setActiveAction(null);
  };

  const confirmShare = async () => {
    if (!shareFile || !shareTarget) return;
    setActiveAction(`share:${shareFile.id}`);
    setError("");
    const { error: functionError } = await supabase.functions.invoke("member-drive", {
      body: { action: "share", fileId: shareFile.id, fileName: shareFile.name, mimeType: shareFile.mimeType, toUserId: shareTarget },
    });
    if (functionError) setError(await readFunctionError(functionError));
    else {
      setMessage(`${shareFile.name} was shared.`);
      await logActivity("share", `Shared ${shareFile.name}`);
    }
    setShareFile(null);
    setShareTarget("");
    setActiveAction(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/team", { replace: true });
  };

  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const renderFileRow = (file: DriveFile, owned: boolean) => (
    <div key={file.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-navy">{file.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {owned ? formatSize(file.size) : `Shared by ${file.sharedBy ?? "a teammate"}`}
          {owned && file.modifiedTime ? ` · Updated ${new Date(file.modifiedTime).toLocaleDateString()}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => void previewFile(file)} disabled={activeAction === `preview:${file.id}`} className="rounded-full"><Eye className="h-4 w-4" /> {activeAction === `preview:${file.id}` ? "Opening…" : "Preview"}</Button>
        <Button variant="outline" size="sm" onClick={() => void downloadFile(file)} disabled={activeAction === `download:${file.id}`} className="rounded-full"><Download className="h-4 w-4" /> Download</Button>
        {owned && (
          <>
            <Button variant="outline" size="sm" onClick={() => { setShareFile(file); setShareTarget(""); }} className="rounded-full"><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="ghost" size="icon" onClick={() => void deleteFile(file)} disabled={activeAction === `delete:${file.id}`} aria-label={`Delete ${file.name}`} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>My Files — SWAMN</title>
        <meta name="description" content="Private SWAMN team member file workspace." />
        <link rel="canonical" href="https://swamn.com/team/files" />
      </Helmet>
      <header className="border-b border-border bg-card/80">
        <div className="container flex items-center justify-between py-5">
          <a href="/" aria-label="SWAMN home"><Logo size={26} /></a>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary bg-cover bg-center text-xs font-medium text-navy sm:flex"
              style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
            >
              {avatarUrl ? "" : initials}
            </span>
            <span className="hidden text-sm text-muted-foreground sm:inline">{displayName}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="container max-w-5xl py-12 md:py-16">
        <h1 className="sr-only">SWAMN member workspace</h1>
        <div className="mb-10 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-secondary bg-cover bg-center text-lg font-medium text-navy"
            style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
          >
            {avatarUrl ? "" : initials}
          </span>
          <div>
            <p className="h-display text-2xl text-navy">{displayName}</p>
            <p className="text-sm text-muted-foreground">{designation || (isAdmin ? "Team Lead" : "SWAMN team member")}</p>
            {isAdmin && <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aqua">Administrator</p>}
          </div>
        </div>
        {isAdmin && <div className="mb-10"><AdminPanel onChanged={() => setRefreshKey((value) => value + 1)} /></div>}
        <MemberDashboard files={files} refreshKey={refreshKey} />
        <MemberExtras userId={userId} isAdmin={isAdmin} refreshKey={refreshKey} />

        <div className="mt-12 flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><FolderLock className="h-4 w-4 text-aqua" /> Private workspace</div>
            <h2 className="h-display text-4xl text-navy">Your SWAMN files</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Only files in your assigned Drive folder appear here.</p>
          </div>
          <div className="flex gap-2">
            <input ref={inputRef} type="file" className="hidden" onChange={onUpload} />
            <Button onClick={() => inputRef.current?.click()} disabled={activeAction === "upload"} className="rounded-full"><FileUp className="h-4 w-4" /> {activeAction === "upload" ? "Adding…" : "Add file"}</Button>
            <Button variant="outline" size="icon" onClick={() => void loadDriveFiles()} disabled={loading} aria-label="Refresh files" className="rounded-full"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </div>
        </div>

        {error && <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
        {message && <div role="status" className="mt-6 rounded-xl border border-aqua/30 bg-secondary px-4 py-3 text-sm text-navy">{message}</div>}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? <div className="p-8 text-sm text-muted-foreground">Loading your folder…</div> : files.length === 0 ? (
            <div className="p-12 text-center"><FolderLock className="mx-auto h-8 w-8 text-aqua" /><h2 className="mt-4 font-medium text-navy">Your folder is ready</h2><p className="mt-2 text-sm text-muted-foreground">Add your first file to start building your private workspace.</p></div>
          ) : <div className="divide-y divide-border">{files.map((file) => renderFileRow(file, true))}</div>}
        </div>

        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-medium text-navy"><Users className="h-4 w-4 text-aqua" /> Shared with you</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            {sharedFiles.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No teammate has shared a file with you yet.</p>
            ) : <div className="divide-y divide-border">{sharedFiles.map((file) => renderFileRow(file, false))}</div>}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) closePreview(); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle className="truncate">{preview?.name}</DialogTitle></DialogHeader>
          {preview?.mimeType.startsWith("image/") && <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full rounded-xl object-contain" />}
          {preview?.mimeType.includes("pdf") && <iframe title={preview.name} src={preview.url} className="h-[70vh] w-full rounded-xl border border-border" />}
          {preview && !preview.mimeType.startsWith("image/") && !preview.mimeType.includes("pdf") && (
            <p className="text-sm text-muted-foreground">This file type can't be shown here — use Download to open it.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(shareFile)} onOpenChange={(open) => { if (!open) setShareFile(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="truncate">Share {shareFile?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="share-target">Team member</Label>
            <select id="share-target" value={shareTarget} onChange={(event) => setShareTarget(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Choose a member…</option>
               {members.map((member) => <option key={member.user_id} value={member.user_id}>{member.display_name}{member.designation ? ` — ${member.designation}` : ""}</option>)}
            </select>
             {members.length === 0 && <p className="text-xs text-destructive">No team members are available. Refresh the page and try again.</p>}
             <Button onClick={() => void confirmShare()} disabled={Boolean(activeAction) || !shareTarget} className="rounded-full">{activeAction?.startsWith("share:") ? "Sharing…" : "Share file"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MemberWorkspace;
