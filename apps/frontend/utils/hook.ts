/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react"
import z from "zod/v4"

// the Pourparler API (same-origin once it's hosted inside the site, DEV-138)
export const POURPARLER_API =
  process.env.NEXT_PUBLIC_POURPARLER_API ?? "http://localhost:3001"

export const rendezVousSchema = z.object({
  // oxlint-disable-next-line no-magic-numbers
  id: z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),
  contactEmail: z.email().nonempty(),
  scheduledAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  guestName: z.string().nullable(),
  topic: z.string().nullable(),
})

export type RendezVousSchema = z.infer<typeof rendezVousSchema>

// what the API shares publicly: when the captain is busy, not who with
export const busySlotSchema = z.object({
  scheduledAt: z.iso.datetime(),
})

export type BusySlotSchema = z.infer<typeof busySlotSchema>

// the created rendez-vous comes with its secret manage token (to move or cancel it later)
export const createdRendezVousSchema = rendezVousSchema.extend({
  manageToken: z.string().nonempty(),
})

export type CreatedRendezVousSchema = z.infer<typeof createdRendezVousSchema>

export const slotSchema = z.object({
  start: z.iso.datetime(),
  end: z.iso.datetime(),
})

export type SlotSchema = z.infer<typeof slotSchema>

const slotsResponseSchema = z.object({
  timeZone: z.string(),
  slotMinutes: z.number(),
  slots: slotSchema.array(),
})

// the captain's free slots; `take` drops one locally once it's booked
export function useFreeSlots() {
  const [slots, setSlots] = useState<Array<SlotSchema>>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`${POURPARLER_API}/slots`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        setSlots(slotsResponseSchema.parse(await response.json()).slots)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("Error fetching free slots:", error)
        setFailed(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const take = useCallback(
    (start: string) =>
      setSlots((previous) => previous.filter((slot) => slot.start !== start)),
    [],
  )

  return { slots, loading, failed, take }
}

export interface CreateRendezVousInput {
  contactEmail: string
  guestName: string
  topic?: string
  scheduledAt: string
}

type UseCreateRendezVousReturn = [
  (
    input: CreateRendezVousInput,
    // ERROR should be the ones form the API, not a generic Error
  ) => Promise<CreatedRendezVousSchema>,
  boolean,
]

export function useCreateRendezVous(): UseCreateRendezVousReturn {
  const [loading, setLoading] = useState(false)

  const createRendezVous = useCallback(async (input: CreateRendezVousInput) => {
    setLoading(true)

    try {
      const response = await fetch(`${POURPARLER_API}/rendez-vous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data?.description || "Unexpected error")
        ;(error as any).code = data?.code
        ;(error as any).description = data?.description

        throw error
      }
      return createdRendezVousSchema.parse(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return [createRendezVous, loading]
}
