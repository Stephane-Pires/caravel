import { assertEnv } from "./env.ts"
import { reportError } from "./report.ts"

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

// true when the visitor passed the challenge, or when no secret is configured (local development)
export async function passesTurnstile(token: string | undefined, ip?: string) {
  const { TURNSTILE_SECRET_KEY: secret } = assertEnv(process.env)
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set("remoteip", ip)

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch (error) {
    reportError(error, "Turnstile verification failed")
    return false
  }
}
