import { supabase } from "@/integrations/supabase/client";
import { elapsedSeconds, type StreakRecord } from "./streak";

// The generated Database types do not yet include this table, so we use a
// loosely typed accessor for the streaks table only.
const table = () => (supabase as unknown as { from: (t: string) => any }).from("streaks");

export const USERNAME_DOMAIN = "nofapcenter.app";
// Accounts created before the client-side auth switch used this domain.
export const LEGACY_USERNAME_DOMAIN = "nofapcenter.com";

export function usernameToEmail(username: string, domain: string = USERNAME_DOMAIN): string {
  return `${username.trim().toLowerCase()}@${domain}`;
}

export function validateUsername(username: string): string | null {
  const value = username.trim();
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 24) return "Username must be 24 characters or fewer.";
  if (!/^[a-zA-Z0-9_.-]+$/.test(value))
    return "Use letters, numbers, dots, dashes or underscores only.";
  return null;
}

export async function loadStreak(userId: string, username: string): Promise<StreakRecord> {
  const { data, error } = await table().select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data as StreakRecord;

  const { data: created, error: insertError } = await table()
    .insert({ user_id: userId, username })
    .select("*")
    .single();
  if (insertError) throw new Error(insertError.message);
  return created as StreakRecord;
}

export async function resetStreak(record: StreakRecord): Promise<StreakRecord> {
  const completed = elapsedSeconds(record.streak_started_at);
  const now = new Date().toISOString();
  const { data, error } = await table()
    .update({
      streak_started_at: now,
      last_streak_seconds: completed,
      longest_streak_seconds: Math.max(record.longest_streak_seconds, completed),
      updated_at: now,
    })
    .eq("user_id", record.user_id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as StreakRecord;
}
