"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { track } from "@/lib/track"
import {
  ManageError,
  type RendezVousSchema,
  cancelManagedRendezVous,
  getManagedRendezVous,
  moveManagedRendezVous,
  useFreeSlots,
} from "@/utils/hook"
import {
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline"
import { format, isPast } from "date-fns"
import Link from "next/link"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

import { type Fact, Facts } from "./Facts"
import { SlotPicker } from "./SlotPicker"

// the private token is the URL fragment (#…): read on the client only
const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}
const readHash = () => window.location.hash.replace("#", "")
const noHashOnServer = () => ""

const HTTP_NOT_FOUND = 404
// seconds a cancel can still be undone before it's sent, counted down one by one
const UNDO_SECONDS = 5
const TICK = 1
const NOT_CANCELLING = 0
const SECOND = 1000

type View =
  | { name: "loading" }
  | { name: "ready"; rendezVous: RendezVousSchema }
  | { name: "missing" }
  | { name: "cancelled" }
  | { name: "error"; message: string }

const when = (iso: string) => format(new Date(iso), "EEE d MMM yyyy · HH:mm")

// when, how long, what about, where: only the facts this rendez-vous has
function factsOf(rendezVous: RendezVousSchema, timeZone: string) {
  const facts: Array<Fact> = [
    [
      CalendarDaysIcon,
      <strong key="when">{when(rendezVous.scheduledAt)}</strong>,
    ],
    [ClockIcon, `30 min · ${timeZone}`],
  ]
  if (rendezVous.topic)
    facts.push([ChatBubbleLeftEllipsisIcon, rendezVous.topic])
  if (rendezVous.meetLink)
    facts.push([VideoCameraIcon, rendezVous.meetLink.replace("https://", "")])
  return facts
}

// Rescheduling only loads the free slots once asked for
function Reschedule({
  onMove,
  onClose,
}: {
  onMove: (start: string) => Promise<void>
  onClose: () => void
}) {
  const { slots, loading, failed } = useFreeSlots()
  const [start, setStart] = useState("")
  const [saving, setSaving] = useState(false)
  const [missing, setMissing] = useState(false)

  const pick = useCallback((picked: string) => {
    setStart(picked)
    setMissing(false)
  }, [])

  // never a greyed-out button: a click without a time says what's missing
  const confirm = useCallback(async () => {
    if (!start) {
      setMissing(true)
      return
    }
    setSaving(true)
    try {
      await onMove(start)
    } finally {
      setSaving(false)
    }
  }, [onMove, start])

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">New time</p>
      <SlotPicker
        slots={slots}
        loading={loading}
        failed={failed}
        value={start}
        onChange={pick}
      />
      {missing && (
        <p
          role="alert"
          className="text-sm font-medium text-red-800"
        >
          Pick a time.
        </p>
      )}
      <div className="flex gap-3">
        <Button
          type="button"
          disabled={saving}
          onClick={confirm}
        >
          {saving ? "Moving…" : "Move"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          Back
        </Button>
      </div>
    </div>
  )
}

export function ManageRendezVous({ id }: { id: number }) {
  const token = useSyncExternalStore(subscribeHash, readHash, noHashOnServer)
  const [view, setView] = useState<View>({ name: "loading" })
  const [rescheduling, setRescheduling] = useState(false)
  // seconds left before a cancel is sent: 0 when none is waiting
  const [cancelIn, setCancelIn] = useState(NOT_CANCELLING)
  const [notice, setNotice] = useState("")

  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  )

  const fail = useCallback((error: unknown) => {
    if (error instanceof ManageError && error.status === HTTP_NOT_FOUND) {
      setView({ name: "missing" })
    } else {
      setView({
        name: "error",
        message:
          error instanceof ManageError
            ? error.message
            : "The rendez-vous couldn't load. Try again.",
      })
    }
  }, [])

  useEffect(() => {
    if (!token) return
    let active = true
    getManagedRendezVous(id, token)
      .then((rendezVous) => {
        if (active && rendezVous) setView({ name: "ready", rendezVous })
        return rendezVous
      })
      .catch((error: unknown) => {
        if (active) fail(error)
      })
    return () => {
      active = false
    }
  }, [fail, id, token])

  const move = useCallback(
    async (start: string) => {
      try {
        const moved = await moveManagedRendezVous(id, token, start)
        if (moved) setView({ name: "ready", rendezVous: moved })
        track("site.pourparler", { action: "moved" })
        setRescheduling(false)
        setNotice("Moved. Your invitation is updated.")
      } catch (error) {
        setNotice(
          error instanceof ManageError
            ? error.message
            : "The rendez-vous couldn't move. Try again.",
        )
      }
    },
    [id, token],
  )

  const cancel = useCallback(async () => {
    try {
      await cancelManagedRendezVous(id, token)
      setView({ name: "cancelled" })
      track("site.pourparler", { action: "cancelled" })
    } catch (error) {
      setNotice(
        error instanceof ManageError
          ? error.message
          : "The rendez-vous couldn't be cancelled. Try again.",
      )
    } finally {
      setCancelIn(NOT_CANCELLING)
    }
  }, [id, token])

  // the countdown: one tick a second, the cancel goes out when it reaches the end
  useEffect(() => {
    if (cancelIn === NOT_CANCELLING) return
    const tick = setTimeout(() => {
      if (cancelIn === TICK) void cancel()
      else setCancelIn(cancelIn - TICK)
    }, SECOND)
    return () => clearTimeout(tick)
  }, [cancel, cancelIn])

  // leaving during the countdown still cancels: the guest asked for it
  const waiting = cancelIn !== NOT_CANCELLING
  useEffect(() => {
    if (!waiting) return
    const leave = () => {
      void cancelManagedRendezVous(id, token, { keepalive: true }).catch(
        () => null,
      )
    }
    window.addEventListener("pagehide", leave)
    return () => window.removeEventListener("pagehide", leave)
  }, [id, token, waiting])

  const openReschedule = useCallback(() => {
    setNotice("")
    setRescheduling(true)
  }, [])
  const closeReschedule = useCallback(() => setRescheduling(false), [])
  const startCancel = useCallback(() => {
    setNotice("")
    setRescheduling(false)
    setCancelIn(UNDO_SECONDS)
  }, [])
  const undoCancel = useCallback(() => setCancelIn(NOT_CANCELLING), [])

  const missingLink = !token

  return (
    <Card className="w-full max-w-md p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {view.name === "cancelled" ? "Cancelled" : "Your rendez-vous"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {missingLink || view.name === "missing" ? (
          <>
            <p>
              This link no longer works. Open it from your invitation, or book a
              new time.
            </p>
            <Button
              asChild
              className="self-start"
            >
              <Link href="/pourparler">Book</Link>
            </Button>
          </>
        ) : view.name === "loading" ? (
          <p aria-busy="true">Loading…</p>
        ) : view.name === "error" ? (
          <p role="alert">{view.message}</p>
        ) : view.name === "cancelled" ? (
          <>
            <p>Google Calendar emails you the cancellation.</p>
            <Button
              asChild
              className="self-start"
            >
              <Link href="/pourparler">Book again</Link>
            </Button>
          </>
        ) : (
          <>
            <Facts
              className={waiting ? "line-through" : ""}
              facts={factsOf(view.rendezVous, timeZone)}
            />

            {notice && <p role="status">{notice}</p>}

            {isPast(new Date(view.rendezVous.scheduledAt)) ? (
              <p>This rendez-vous has passed.</p>
            ) : waiting ? (
              <div
                role="status"
                className="flex items-center gap-4"
              >
                <p>Cancelling in {cancelIn} s</p>
                <Button
                  type="button"
                  onClick={undoCancel}
                >
                  Undo
                </Button>
              </div>
            ) : rescheduling ? (
              <Reschedule
                onMove={move}
                onClose={closeReschedule}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {view.rendezVous.meetLink && (
                  <Button
                    asChild
                    size="lg"
                    className="text-base"
                  >
                    <a
                      href={view.rendezVous.meetLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <VideoCameraIcon aria-hidden="true" />
                      Join
                    </a>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3"
                  onClick={openReschedule}
                >
                  Reschedule
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3"
                  onClick={startCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
