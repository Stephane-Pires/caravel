import { useMemo, useSyncExternalStore } from "react"

import type { CreatedRendezVousSchema } from "@/utils/hook"

// The booking form's state, shared by its two homes: /pourparler (Lo-fi) and the bottle's note
// in the cabin (Hi-fi). Kept in sessionStorage, so switching between them, or reloading, keeps
// what was typed, and closing the tab forgets it.
export interface RendezVousDraft {
  guestName: string
  contactEmail: string
  topic: string
  scheduledAt: string
  // once booked: the confirmation, until "Book another one"
  booked: CreatedRendezVousSchema | null
}

const KEY = "caravel:rendez-vous"

export const EMPTY_DRAFT: RendezVousDraft = {
  guestName: "",
  contactEmail: "",
  topic: "",
  scheduledAt: "",
  booked: null,
}

// when storage is missing or refuses (private mode, blocked site data), the draft lives in memory:
// it then survives switching pages, not a reload
let memory = EMPTY_DRAFT
const listeners = new Set<() => void>()

export function readDraft(): RendezVousDraft {
  try {
    const saved = window.sessionStorage.getItem(KEY)
    return saved ? { ...EMPTY_DRAFT, ...JSON.parse(saved) } : memory
  } catch {
    return memory
  }
}

function write(draft: RendezVousDraft) {
  memory = draft
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft))
  } catch {
    // memory has it
  }
  listeners.forEach((listener) => listener())
}

export function saveDraft(draft: Partial<RendezVousDraft>) {
  write({ ...readDraft(), ...draft })
}

export function clearDraft() {
  write(EMPTY_DRAFT)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// the snapshot is a string, so React sees a change only when the booking really changes
const bookedSnapshot = () => JSON.stringify(readDraft().booked)
const noBookingOnServer = () => "null"

export function useBookedRendezVous(): CreatedRendezVousSchema | null {
  const booked = useSyncExternalStore(
    subscribe,
    bookedSnapshot,
    noBookingOnServer,
  )
  return useMemo(() => JSON.parse(booked), [booked])
}
