"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { TakeRendezVousForm } from "@/components/clients/pourparler/TakeRendezVousForm"

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// The note in the bottle: the same booking form as /pourparler, unrolled over the cabin.
// cabin.js opens it when the bottle's close-up arrives; closing it steps back to the cabin.
// Once booked, the note folds into a paper plane: cabin.js flies it out of the window, then
// opens the note again on the confirmation.
export function CabinNote({ open }: { open: boolean }) {
  if (!open) return null
  return <NoteSheet />
}

function NoteSheet() {
  const dialog = useRef<HTMLDivElement>(null)
  const [folding, setFolding] = useState(false)
  // the confirmation waits until the note has folded away (or the scene is left)
  const confirmBooking = useRef<(() => void) | null>(null)

  const close = useCallback(() => {
    window.dispatchEvent(new Event("cabin:note-closed"))
  }, [])

  const send = useCallback(() => {
    confirmBooking.current?.()
    confirmBooking.current = null
    window.dispatchEvent(new Event("cabin:note-sent")) // the scene takes over: the paper plane
  }, [])

  const onBooked = useCallback(
    (confirm: () => void) => {
      confirmBooking.current = confirm
      if (reducedMotion()) send()
      else {
        setFolding(true)
        window.dispatchEvent(new Event("cabin:note-folding")) // the scene turns to the window
      }
    },
    [send],
  )

  // leaving in the middle of the fold still records the booking
  useEffect(() => () => confirmBooking.current?.(), [])

  // the visitor lands in the first field, as on the page
  useEffect(() => {
    dialog.current?.querySelector("input")?.focus()
  }, [])

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
      if (event.target === event.currentTarget && !folding) close()
    },
    [close, folding],
  )

  const onAnimationEnd = useCallback(
    (event: React.AnimationEvent) => {
      if (
        event.target === event.currentTarget &&
        event.animationName === "note-fold"
      )
        send()
    },
    [send],
  )

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
      <div
        className={`note-sheet relative flex w-full max-w-md flex-col items-center gap-3${folding ? " folding" : ""}`}
        onAnimationEnd={onAnimationEnd}
      >
        <TakeRendezVousForm onBooked={onBooked} />
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
