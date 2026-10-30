import { readEngineRoom } from "@/lib/engine-room"

// served from Next's cache, refreshed in the background at most every 15 minutes
export const revalidate = 900

export async function GET() {
  return Response.json(await readEngineRoom())
}
