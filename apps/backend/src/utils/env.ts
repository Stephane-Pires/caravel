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
    GMAIL_PASSWORD: z.string().nonempty().meta({
      description: "The password for the Gmail account used to send emails",
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
    TURNSTILE_SECRET_KEY: z.string().optional().meta({
      description:
        "Cloudflare Turnstile secret; when set, creating a rendez-vous needs a valid challenge token",
    }),
  })
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
