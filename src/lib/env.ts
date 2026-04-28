import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL."),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, "VITE_SUPABASE_ANON_KEY is required."),
  VITE_R2_BUCKET: z.string().min(1, "VITE_R2_BUCKET is required."),
  VITE_R2_ACCOUNT_ID: z.string().min(1, "VITE_R2_ACCOUNT_ID is required."),
  VITE_R2_ACCESS_KEY: z.string().min(1, "VITE_R2_ACCESS_KEY is required."),
  VITE_R2_SECRET_KEY: z.string().min(1, "VITE_R2_SECRET_KEY is required."),
});

const parsedClientEnv = clientEnvSchema.safeParse(import.meta.env);

if (!parsedClientEnv.success) {
  const issues = parsedClientEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsedClientEnv.data;

