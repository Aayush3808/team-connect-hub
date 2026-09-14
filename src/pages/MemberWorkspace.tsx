import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Download, FileUp, FolderLock, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/swamn/Logo";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
};

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

const decodeBase64 = (value: string) => {
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  return new Blob([bytes]);
};

const MemberWorkspace = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [displayName, setDisplayName] = useState("Team member");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate("/team", { replace: true });
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", sessionData.session.user.id).maybeSingle();
    if (profile?.display_name) setDisplayName(profile.display_name);

    const { data, error: functionError } = await supabase.functions.invoke("member-drive", { body: { action: "list" } });
    if (functionError) setError(await readFunctionError(functionError));
    else setFiles((data?.files ?? []) as DriveFile[]);
    setLoading(false);
  }, [navigate]);

  useEffect(() => { void loadFiles(); }, [loadFiles]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Files must be smaller than 10 MB.");
      return;
    }

    setBusy(true);
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
      await loadFiles();
    }
    setBusy(false);
  };

  const downloadFile = async (file: DriveFile) => {
    setBusy(true);
    setError("");
    const { data, error: functionError } = await supabase.functions.invoke("member-drive", { body: { action: "download", fileId: file.id } });
    if (functionError) setError(await readFunctionError(functionError));
    else {
      const url = URL.createObjectURL(decodeBase64(data.contentBase64));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    setBusy(false);
  };

  const deleteFile = async (file: DriveFile) => {
    if (!window.confirm(`Remove ${file.name} from your folder?`)) return;
    setBusy(true);
    setError("");
    const { error: functionError } = await supabase.functions.invoke("member-drive", { body: { action: "delete", fileId: file.id } });
    if (functionError) setError(await readFunctionError(functionError));
    else {
      setMessage(`${file.name} was removed.`);
      await loadFiles();
    }
    setBusy(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/team", { replace: true });
  };

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
            <span className="hidden text-sm text-muted-foreground sm:inline">{displayName}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="container max-w-4xl py-12 md:py-16">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><FolderLock className="h-4 w-4 text-aqua" /> Private workspace</div>
            <h1 className="h-display text-4xl text-navy">Your SWAMN files</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Only files in your assigned Drive folder appear here.</p>
          </div>
          <div className="flex gap-2">
            <input ref={inputRef} type="file" className="hidden" onChange={onUpload} />
            <Button onClick={() => inputRef.current?.click()} disabled={busy} className="rounded-full"><FileUp className="h-4 w-4" /> Add file</Button>
            <Button variant="outline" size="icon" onClick={() => void loadFiles()} disabled={loading || busy} aria-label="Refresh files" className="rounded-full"><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </div>

        {error && <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
        {message && <div role="status" className="mt-6 rounded-xl border border-aqua/30 bg-secondary px-4 py-3 text-sm text-navy">{message}</div>}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? <div className="p-8 text-sm text-muted-foreground">Loading your folder…</div> : files.length === 0 ? (
            <div className="p-12 text-center"><FolderLock className="mx-auto h-8 w-8 text-aqua" /><h2 className="mt-4 font-medium text-navy">Your folder is ready</h2><p className="mt-2 text-sm text-muted-foreground">Add your first file to start building your private workspace.</p></div>
          ) : <div className="divide-y divide-border">{files.map((file) => <div key={file.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-medium text-navy">{file.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatSize(file.size)}{file.modifiedTime ? ` · Updated ${new Date(file.modifiedTime).toLocaleDateString()}` : ""}</p></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" onClick={() => void downloadFile(file)} disabled={busy} className="rounded-full"><Download className="h-4 w-4" /> Download</Button><Button variant="ghost" size="icon" onClick={() => void deleteFile(file)} disabled={busy} aria-label={`Delete ${file.name}`} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></div></div>)}</div>}
        </div>
      </section>
    </main>
  );
};

export default MemberWorkspace;