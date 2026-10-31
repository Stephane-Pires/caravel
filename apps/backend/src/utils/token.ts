import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

// A rendez-vous is managed (seen, moved, cancelled) with a secret token given once to the guest.
// Only its SHA-256 hash is stored, so a database leak doesn't hand out the tokens.
const TOKEN_BYTES = 32

export function createManageToken() {
  const token = randomBytes(TOKEN_BYTES).toString("base64url")
  return { token, hash: hashToken(token) }
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function tokenMatches(hash: string | null, token: string | undefined) {
  if (!hash || !token) return false
  const expected = Buffer.from(hash, "hex")
  const actual = Buffer.from(hashToken(token), "hex")
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

// "Authorization: Bearer <token>"
export function bearerToken(header: string | undefined) {
  const match = header?.match(/^Bearer\s+(\S+)$/i)
  return match?.[1]
}
