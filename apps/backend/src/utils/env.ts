import z from "zod/v4"

const envSchema = z
  .object({
    POSTGRES_USER: z.string().nonempty().meta({
      description: "The username for the PostgreSQL database",
    }),
    POSTGRES_PASSWORD: z.string().nonempty().meta({
      description: "The password for the PostgreSQL database",
    }),
    POSTGRES_DB: z.string().nonempty().meta({
      description: "The name of the PostgreSQL database",
    }),
    POSTGRES_PORT: z.coerce.number().positive().min(1).max(65535).meta({
      description: "The port number for the PostgreSQL database",
    }),
    POSTGRES_HOST: z.string().nonempty().meta({
      description: "The host address for the PostgreSQL database",
    }),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
      .meta({
        description:
          "production hides the development routes and the query log",
      }),
    CORS_ORIGINS: z
      .string()
      .default("http://localhost:3000")
      .transform((origins) => origins.split(",").map((o) => o.trim()))
      .meta({ description: "Comma-separated origins allowed to call the API" }),
    GOOGLE_CLIENT_ID: z.string().optional().meta({
      description:
        "OAuth client of the captain's Google Calendar (scripts/google-auth.mjs)",
    }),
    GOOGLE_CLIENT_SECRET: z.string().optional().meta({
      description: "Secret of that OAuth client",
    }),
    GOOGLE_REFRESH_TOKEN: z.string().optional().meta({
      description: "Refresh token from the captain's one-time consent",
    }),
    GOOGLE_CALENDAR_ID: z.string().default("primary").meta({
      description: "The calendar that holds the rendez-vous",
    }),
    TURNSTILE_SECRET_KEY: z.string().optional().meta({
      description:
        "Cloudflare Turnstile secret; when set, creating a rendez-vous needs a valid challenge token",
    }),
  })
  .refine(
    (env) =>
      env.NODE_ENV !== "production" ||
      Boolean(
        env.GOOGLE_CLIENT_ID &&
        env.GOOGLE_CLIENT_SECRET &&
        env.GOOGLE_REFRESH_TOKEN,
      ),
    {
      message:
        "Production needs GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN (run scripts/google-auth.mjs)",
    },
  )
  .meta({
    description: "Schema to parse environnement variables",
  })

export function assertEnv(
  env: Record<string, string | undefined>,
): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(env)

  if (!result.success) {
    console.error("Invalid environment variables:", result.error.issues)
    throw new Error("Invalid environment variables")
  }

  return result.data
}

export const isProduction = () => process.env.NODE_ENV === "production"
