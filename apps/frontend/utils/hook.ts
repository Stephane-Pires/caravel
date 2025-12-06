/* eslint-disable @typescript-eslint/no-explicit-any */

import { RendezVousFormSchema } from "@/components/clients/pourparler/TakeRendezVousForm"
import { useCallback, useState } from "react"
import z from "zod/v4"

export const rendezVousSchema = z.object({
  // oxlint-disable-next-line no-magic-numbers
  id: z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),
  contactEmail: z.email().nonempty(),
  scheduledAt: z.iso.datetime(),
})

export type RendezVousSchema = z.infer<typeof rendezVousSchema>

type UseCreateRendezVousReturn = [
  (
    input: RendezVousFormSchema,
    // ERROR should be the ones form the API, not a generic Error
  ) => Promise<RendezVousSchema>,
  boolean,
]

export function useCreateRendezVous(): UseCreateRendezVousReturn {
  const [loading, setLoading] = useState(false)

  const createRendezVous = useCallback(async (input: RendezVousFormSchema) => {
    setLoading(true)

    try {
      const response = await fetch("http://localhost:3001/rendez-vous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactEmail: input.contactEmail,
          scheduledAt: input.scheduledAt.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data?.description || "Unexpected error")
        ;(error as any).code = data?.code
        ;(error as any).description = data?.description

        throw error
      }
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  return [createRendezVous, loading]
}
