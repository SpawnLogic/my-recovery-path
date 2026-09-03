import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const signUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_.-]+$/),
  password: z.string().min(6).max(72),
});

export const USERNAME_DOMAIN = "nofapcenter.com";

/**
 * Creates a confirmed account from a username + password. Usernames are mapped
 * to a deterministic internal address so the user never handles an email.
 */
export const signUpWithUsername = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => signUpSchema.parse(input))
  .handler(async ({ data }) => {
    const username = data.username.toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: `${username}@${USERNAME_DOMAIN}`,
      password: data.password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already") || message.includes("registered") || error.status === 422) {
        return { ok: false as const, error: "That username is taken. Try signing in instead." };
      }
      return { ok: false as const, error: error.message };
    }

    return { ok: true as const };
  });
