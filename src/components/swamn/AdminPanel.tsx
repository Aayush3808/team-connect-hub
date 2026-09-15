import { FormEvent, useCallback, useEffect, useState } from "react";
import { Megaphone, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Member = { user_id: string; username: string; display_name: string };
type Announcement = { id: string; title: string; body: string; created_at: string };
type AssignedTask = { id: string; title: string; status: string; due_date: string | null; user_id: string };

export const AdminPanel = ({ onChanged }: { onChanged?: () => void }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assigned, setAssigned] = useState<AssignedTask[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [taskMember, setTaskMember] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    const [membersResult, announcementsResult, tasksResult] = await Promise.all([
      supabase.from("profiles").select("user_id, username, display_name").order("display_name"),
      supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }),
      supabase.from("member_tasks").select("id, title, status, due_date, user_id").not("assigned_by", "is", null).order("created_at", { ascending: false }).limit(20),
    ]);
    setLoadError(membersResult.error ? "The team list could not be loaded. Refresh the page and try again." : "");
    setMembers((membersResult.data ?? []) as Member[]);
    setAnnouncements((announcementsResult.data ?? []) as Announcement[]);
    setAssigned((tasksResult.data ?? []) as AssignedTask[]);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const postAnnouncement = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    setNotice("");
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.from("announcements").insert({
      title: title.trim(),
      body: body.trim(),
      created_by: sessionData.session?.user.id ?? null,
    });
    setNotice(error ? "That announcement could not be posted." : "Announcement posted to the whole team.");
    if (!error) { setTitle(""); setBody(""); await load(); onChanged?.(); }
    setBusy(false);
  };

  const removeAnnouncement = async (id: string) => {
    setBusy(true);
    await supabase.from("announcements").delete().eq("id", id);
    await load();
    onChanged?.();
    setBusy(false);
  };

  const assignTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!taskMember || !taskTitle.trim()) return;
    setBusy(true);
    setNotice("");
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.from("member_tasks").insert({
      user_id: taskMember,
      title: taskTitle.trim(),
      details: taskDetails.trim() || null,
      due_date: taskDue || null,
      assigned_by: sessionData.session?.user.id ?? null,
    });
    setNotice(error ? `That task could not be assigned: ${error.message}` : "Task assigned — it now shows on their page.");
    if (!error) { setTaskTitle(""); setTaskDetails(""); setTaskDue(""); await load(); onChanged?.(); }
    setBusy(false);
  };

  const memberName = (id: string) => members.find((member) => member.user_id === id)?.display_name ?? "Team member";

  return (
    <section className="rounded-2xl border border-aqua/40 bg-secondary/40 p-6">
      <h2 className="flex items-center gap-2 font-medium text-navy"><ShieldCheck className="h-4 w-4 text-aqua" /> Admin controls</h2>
      <p className="mt-1 text-xs text-muted-foreground">Only you can see this panel.</p>
      {notice && <p role="status" className="mt-4 rounded-xl bg-card px-4 py-2 text-sm text-navy">{notice}</p>}
      {loadError && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-card px-4 py-2 text-sm text-destructive">{loadError}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={postAnnouncement} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-navy"><Megaphone className="h-4 w-4 text-aqua" /> Post an announcement</h3>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="a-title">Title</Label>
              <Input id="a-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Meeting on Saturday" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-body">Message</Label>
              <Textarea id="a-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1200} rows={4} placeholder="Write what the team needs to know…" />
            </div>
            <Button type="submit" disabled={busy} className="rounded-full">Post to team</Button>
          </div>
          <ul className="mt-5 space-y-2">
            {announcements.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button type="button" onClick={() => void removeAnnouncement(item.id)} aria-label={`Delete ${item.title}`} className="text-muted-foreground transition-colors hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </form>

        <form onSubmit={assignTask} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-navy">Assign a task</h3>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-member">Team member</Label>
              <select id="t-member" value={taskMember} onChange={(event) => setTaskMember(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Choose a member…</option>
                {members.map((member) => <option key={member.user_id} value={member.user_id}>{member.display_name}</option>)}
              </select>
              {!loadError && members.length === 0 && <p className="text-xs text-muted-foreground">Loading team members…</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-title">Task</Label>
              <Input id="t-title" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} maxLength={200} placeholder="Prepare the pitch deck" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-details">Details (optional)</Label>
              <Textarea id="t-details" value={taskDetails} onChange={(event) => setTaskDetails(event.target.value)} maxLength={800} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-due">Due date (optional)</Label>
              <Input id="t-due" type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} />
            </div>
            <Button type="submit" disabled={busy || members.length === 0 || !taskMember || !taskTitle.trim()} className="rounded-full">{busy ? "Assigning…" : "Assign task"}</Button>
          </div>
          <ul className="mt-5 space-y-2">
            {assigned.map((task) => (
              <li key={task.id} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">
                <span className="font-medium text-navy">{memberName(task.user_id)}</span>
                <span className="text-muted-foreground"> · {task.title}{task.due_date ? ` · due ${new Date(task.due_date).toLocaleDateString()}` : ""} · {task.status === "done" ? "done" : "open"}</span>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </section>
  );
};

export default AdminPanel;
