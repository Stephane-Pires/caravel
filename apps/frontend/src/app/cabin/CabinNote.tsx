"use client"

import { useCallback, useEffect, useRef } from "react"

import { TakeRendezVousForm } from "@/components/clients/pourparler/TakeRendezVousForm"

// The note in the bottle: the same booking form as /pourparler, unrolled over the cabin.
// cabin.js opens it when the bottle's close-up arrives; closing it steps back to the cabin.
export function CabinNote({ open }: { open: boolean }) {
  const dialog = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    window.dispatchEvent(new Event("cabin:note-closed"))
  }, [])

  // the visitor lands in the first field, as on the page
  useEffect(() => {
    if (open) dialog.current?.querySelector("input")?.focus()
  }, [open])

  // Escape from inside the note (the day and time pickers handle their own, in their popups)
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") close()
    },
    [close],
  )

  // a click on the backdrop, not on the note, rolls it up
  const onBackdrop = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) close()
    },
    [close],
  )

  if (!open) return null

  return (
    <div
      ref={dialog}
      className="note-layer fixed inset-0 flex items-start justify-center overflow-y-auto bg-[#0d1626]/55 px-4 pt-24 pb-10"
      role="dialog"
      aria-modal="true"
      aria-label="Book a rendez-vous"
      onKeyDown={onKeyDown}
      onClick={onBackdrop}
    >
      <div className="note-sheet relative flex w-full max-w-md flex-col items-center gap-3">
        <TakeRendezVousForm />
        <button
          type="button"
          className="rounded-full border-2 border-dashed border-[#f6ecd6] px-4 py-1 font-bold text-[#f6ecd6]"
          onClick={close}
        >
          Roll it up ✕
        </button>
      </div>
    </div>
  )
}
