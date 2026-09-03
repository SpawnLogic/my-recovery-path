import { useState, type FormEvent } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { signUpWithUsername } from "@/lib/auth.functions";
import { usernameToEmail, validateUsername } from "@/lib/streak-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup";

function friendlyError(message: string, mode: Mode): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Incorrect username or password.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "That username is taken. Try signing in instead.";
  if (m.includes("password should be")) return "Password must be at least 6 characters.";
  if (m.includes("email not confirmed"))
    return "This account still needs confirmation. Contact the app owner to disable email confirmation.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment.";
  return mode === "signup" ? `Could not create account: ${message}` : `Could not sign in: ${message}`;
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const usernameError = validateUsername(username);
    if (usernameError) return setError(usernameError);
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setBusy(true);
    try {
      const email = usernameToEmail(username);
      if (mode === "signup") {
        const result = await signUpWithUsername({
          data: { username: username.trim(), password },
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : String(err), mode));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-card">
            <ShieldCheck className="size-6 text-primary" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">NoFap Center</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A private streak tracker. Only you can see your progress.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="your handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {notice ? <p className="text-sm text-primary">{notice}</p> : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>

          <button
            type="button"
            className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No email required. Your username and password are all that is stored.
        </p>
      </div>
    </main>
  );
}
