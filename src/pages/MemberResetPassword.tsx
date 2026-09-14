import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/swamn/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const MemberResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Use at least 10 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Both passwords must match.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError("That reset link has expired. Request a new one from the team login page.");
      return;
    }
    navigate("/team/files", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Reset Password — SWAMN</title>
        <meta name="description" content="Set a new password for your SWAMN team account." />
        <link rel="canonical" href="https://swamn.com/team/reset-password" />
      </Helmet>
      <header className="container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
        <Link to="/team" className="text-sm text-muted-foreground transition-colors hover:text-navy">Team login</Link>
      </header>

      <section className="container flex justify-center pb-20 pt-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
          <h1 className="h-display text-3xl text-navy">Set a new password</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {ready
              ? "Choose a new password for your team account."
              : "Open this page from the reset link in your email to continue."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" required />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="h-11 w-full rounded-full" disabled={loading || !ready}>
              {loading ? "Saving…" : "Save new password"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default MemberResetPassword;
