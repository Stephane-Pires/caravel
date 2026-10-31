import { serve } from "@hono/node-server"
import dotenv from "dotenv"

import { API_BASE_PATH, createPourparlerApp } from "./app.ts"
import { assertEnv } from "./utils/env.ts"

// the API on its own, for local development; on Vercel it runs inside the Next.js app
dotenv.config()

assertEnv(process.env) // fail fast on a bad configuration, at startup

const app = createPourparlerApp()

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(
      `Server is running on http://localhost:${info.port}${API_BASE_PATH}`,
    )
  },
)
