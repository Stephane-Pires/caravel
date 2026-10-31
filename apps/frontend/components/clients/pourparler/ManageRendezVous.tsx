"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ManageError,
  type RendezVousSchema,
  cancelManagedRendezVous,
  getManagedRendezVous,
  moveManagedRendezVous,
  useFreeSlots,
} from "@/utils/hook"
import { format, isPast } from "date-fns"
import Link from "next/link"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

import { SlotPicker } from "./SlotPicker"

// the private token is the URL fragment (#…): read on the client only
const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}
const readHash = () => window.location.hash.replace("#", "")
const noHashOnServer = () => ""

const HTTP_NOT_FOUND = 404

type View =
  | { name: "loading" }
  | { name: "ready"; rendezVous: RendezVousSchema }
  | { name: "missing" }
  | { name: "cancelled" }
  | { name: "error"; message: string }

const when = (iso: string) =>
  format(new Date(iso), "EEEE d MMMM yyyy 'at' HH:mm")

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

  const confirm = useCallback(async () => {
    setSaving(true)
    try {
      await onMove(start)
    } finally {
      setSaving(false)
    }
  }, [onMove, start])

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">Pick another time</p>
      <SlotPicker
        slots={slots}
        loading={loading}
        failed={failed}
        value={start}
        onChange={setStart}
      />
      <div className="flex gap-3">
        <Button
          type="button"
          disabled={!start || saving}
          onClick={confirm}
        >
          {saving ? "Moving…" : "Move my rendez-vous here"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          Keep the current time
        </Button>
      </div>
    </div>
  )
}

export function ManageRendezVous({ id }: { id: number }) {
  const token = useSyncExternalStore(subscribeHash, readHash, noHashOnServer)
  const [view, setView] = useState<View>({ name: "loading" })
  const [mode, setMode] = useState<"idle" | "reschedule" | "confirmCancel">(
    "idle",
  )
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
            : "The rendez-vous couldn't be loaded. Please try again.",
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
        setMode("idle")
        setNotice(
          "Moved. Google Calendar sends the updated invitation to your email.",
        )
      } catch (error) {
        setNotice(
          error instanceof ManageError
            ? error.message
            : "The rendez-vous couldn't be moved. Please try again.",
        )
      }
    },
    [id, token],
  )

  const cancel = useCallback(async () => {
    try {
      await cancelManagedRendezVous(id, token)
      setView({ name: "cancelled" })
    } catch (error) {
      setNotice(
        error instanceof ManageError
          ? error.message
          : "The rendez-vous couldn't be cancelled. Please try again.",
      )
    }
  }, [id, token])

  const openReschedule = useCallback(() => {
    setNotice("")
    setMode("reschedule")
  }, [])
  const askCancel = useCallback(() => {
    setNotice("")
    setMode("confirmCancel")
  }, [])
  const backToIdle = useCallback(() => setMode("idle"), [])

  const missingLink = !token

  return (
    <Card className="container w-full max-w-sm min-w-sm p-4 lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Your rendez-vous
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {missingLink || view.name === "missing" ? (
          <>
            <p>
              This link doesn&apos;t open a rendez-vous anymore. It may have
              been cancelled, or the link is incomplete: open it straight from
              your invitation.
            </p>
            <Button asChild>
              <Link href="/pourparler">Book a new rendez-vous</Link>
            </Button>
          </>
        ) : view.name === "loading" ? (
          <p>Loading your rendez-vous…</p>
        ) : view.name === "error" ? (
          <p role="alert">{view.message}</p>
        ) : view.name === "cancelled" ? (
          <>
            <p>
              Your rendez-vous is cancelled. Google Calendar lets you know by
              email.
            </p>
            <Button asChild>
              <Link href="/pourparler">Book another time</Link>
            </Button>
          </>
        ) : (
          <>
            <p>
              <strong>{when(view.rendezVous.scheduledAt)}</strong>
              <br />
              <span className="text-sm">
                30 minutes · your time zone ({timeZone})
              </span>
            </p>
            {view.rendezVous.topic && <p>About: {view.rendezVous.topic}</p>}
            {view.rendezVous.meetLink && (
              <p>
                Video call:{" "}
                <a
                  className="underline"
                  href={view.rendezVous.meetLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {view.rendezVous.meetLink.replace("https://", "")}
                </a>
              </p>
            )}

            {notice && <p role="status">{notice}</p>}

            {isPast(new Date(view.rendezVous.scheduledAt)) ? (
              <p>This rendez-vous has passed.</p>
            ) : mode === "reschedule" ? (
              <Reschedule
                onMove={move}
                onClose={backToIdle}
              />
            ) : mode === "confirmCancel" ? (
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Cancel this rendez-vous?</p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={cancel}
                  >
                    Yes, cancel it
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={backToIdle}
                  >
                    Keep it
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={openReschedule}
                >
                  Pick another time
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={askCancel}
                >
                  Cancel the rendez-vous
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
