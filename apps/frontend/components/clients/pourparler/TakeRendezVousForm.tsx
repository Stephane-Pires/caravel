"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { track } from "@/lib/track"
import {
  type CreatedRendezVousSchema,
  manageHref,
  useCreateRendezVous,
  useFreeSlots,
} from "@/utils/hook"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod/v4"

import { SlotPicker } from "./SlotPicker"
import { TURNSTILE_SITE_KEY, Turnstile } from "./Turnstile"

// oxlint-disable-next-line no-magic-numbers
const NAME_MAX = 120
// oxlint-disable-next-line no-magic-numbers
const TOPIC_MAX = 500

const rendezVousFormSchema = z
  .object({
    guestName: z.string().trim().nonempty("Your name, please.").max(NAME_MAX),
    contactEmail: z.email("An email to send the invitation to."),
    topic: z.string().trim().max(TOPIC_MAX).optional(),
    scheduledAt: z.iso.datetime({ message: "Pick a time." }),
  })
  .strict()

export type RendezVousFormSchema = z.infer<typeof rendezVousFormSchema>

const DEFAULT_VALUES = {
  guestName: "",
  contactEmail: "",
  topic: "",
  scheduledAt: "",
}

const ERROR_STYLE = {
  background: "var(--color-urgence-500)",
  color: "white",
}

export function TakeRendezVousForm() {
  const { slots, loading, failed, take } = useFreeSlots()
  const [createRendezVous] = useCreateRendezVous()
  const [booked, setBooked] = useState<CreatedRendezVousSchema | null>(null)
  const [turnstileToken, setTurnstileToken] = useState("")
  // a token is spent by each attempt: bump to get a fresh one after a refusal
  const [turnstileReset, setTurnstileReset] = useState(0)
  const waitingForTurnstile = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken

  // the visitor's zone: every time below is shown in it
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  )

  const form = useForm<RendezVousFormSchema>({
    resolver: zodResolver(rendezVousFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  })

  async function onSubmit(values: RendezVousFormSchema) {
    try {
      const created = await createRendezVous({
        contactEmail: values.contactEmail,
        guestName: values.guestName,
        topic: values.topic || undefined,
        scheduledAt: values.scheduledAt,
        turnstileToken: turnstileToken || undefined,
      })
      take(values.scheduledAt)
      setBooked(created)
      track("site.pourparler", {
        action: "booked",
        topic: Boolean(values.topic),
      })
    } catch (error: any) {
      setTurnstileReset((count) => count + 1)
      track("site.pourparler", {
        action: "refused",
        code: error?.code ?? "unknown",
      })
      toast.error(
        error?.description ||
          "The rendez-vous couldn't be booked. Please try another time.",
        { style: ERROR_STYLE },
      )
    }
  }

  const bookAnother = useCallback(() => {
    setBooked(null)
    form.reset(DEFAULT_VALUES)
  }, [form])

  const renderNameField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            placeholder="Jack Sparrow"
            autoComplete="name"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const renderEmailField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="jack.sparrow@captain.com"
            autoComplete="email"
            {...field}
          />
        </FormControl>
        <FormDescription>The invitation is sent here.</FormDescription>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const renderTopicField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem>
        <FormLabel>What would you like to talk about? (optional)</FormLabel>
        <FormControl>
          <Input
            placeholder="A role on your team, a project, a question…"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const renderSlotField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem className="flex flex-col gap-3">
        <FormLabel>When</FormLabel>
        <FormControl>
          <SlotPicker
            slots={slots}
            loading={loading}
            failed={failed}
            value={field.value}
            onChange={field.onChange}
          />
        </FormControl>
        <FormDescription>
          {failed
            ? "The calendar couldn't be loaded. Please try again later."
            : `30 minutes, by video call. Times are in your time zone (${timeZone}).`}
        </FormDescription>
        <FormMessage />
      </FormItem>
    ),
    [failed, loading, slots, timeZone],
  )

  return (
    <Card className="container w-full max-w-sm min-w-sm p-4 lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {booked ? "See you soon!" : "Take “Rendez-Vous”"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {booked ? (
          <div className="flex flex-col gap-4">
            <p>
              Your rendez-vous is booked for{" "}
              <strong>
                {format(new Date(booked.scheduledAt), "EEEE d MMMM 'at' HH:mm")}
              </strong>{" "}
              ({timeZone}).
            </p>
            <p>
              A Google Calendar invitation with the video link is on its way to{" "}
              <strong>{booked.contactEmail}</strong>.
            </p>
            <p>
              Need another time? Keep this private link: it lets you reschedule
              or cancel (it&apos;s also in the invitation).
            </p>
            <Button asChild>
              <Link href={manageHref(booked.id, booked.manageToken)}>
                Manage my rendez-vous
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={bookAnother}
            >
              Book another one
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="guestName"
                render={renderNameField}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={renderEmailField}
              />
              <FormField
                control={form.control}
                name="topic"
                render={renderTopicField}
              />
              <FormField
                control={form.control}
                name="scheduledAt"
                render={renderSlotField}
              />

              <Turnstile
                onToken={setTurnstileToken}
                resetKey={turnstileReset}
              />

              <CardFooter className="p-0">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    waitingForTurnstile
                  }
                >
                  {form.formState.isSubmitting
                    ? "Booking your rendez-vous…"
                    : "Book this rendez-vous"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
