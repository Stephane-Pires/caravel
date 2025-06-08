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
