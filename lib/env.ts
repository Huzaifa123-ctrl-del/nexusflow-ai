import { z } from "zod";

const serverSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .trim()
    .refine((v) => /^mongodb(\+srv)?:\/\//.test(v), "MONGODB_URI must be a MongoDB connection string")
    .refine((v) => !/localhost|127\.0\.0\.1/.test(v), "MONGODB_URI must point to MongoDB Atlas, not localhost"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters").trim(),
  NEXTAUTH_URL: z.string().url().trim(),
  GOOGLE_CLIENT_ID: z.string().min(1).trim(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).trim(),

  // Required once their features ship; optional so earlier phases deploy cleanly.
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  UPLOADTHING_SECRET: z.string().optional(),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;