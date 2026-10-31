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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { track } from "@/lib/track"
import { manageHref, useCreateRendezVous, useFreeSlots } from "@/utils/hook"
import {
  CalendarDaysIcon,
  ClockIcon,
  EnvelopeIcon,
  GlobeEuropeAfricaIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import Link from "next/link"
import { useCallback, useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod/v4"

import { type Fact, Facts } from "./Facts"
import { SlotPicker } from "./SlotPicker"
import {
  clearDraft,
  readDraft,
  saveDraft,
  useBookedRendezVous,
} from "./rendezVousDraft"

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

// red-700: white on it reads at 6.5:1 (the brand pink only reaches 3.9:1)
const ERROR_STYLE = {
  background: "#b91c1c",
  color: "white",
}

interface TakeRendezVousFormProps {
  // the booking went through: show the confirmation by calling `confirm`. Lets the cabin's note
  // fold away first; without it (the Lo-fi page) the confirmation shows at once
  onBooked?: (confirm: () => void) => void
}

export function TakeRendezVousForm({ onBooked }: TakeRendezVousFormProps = {}) {
  const { slots, loading, failed, take } = useFreeSlots()
  const [createRendezVous] = useCreateRendezVous()
  const booked = useBookedRendezVous()

  // the visitor's zone: every time below is shown in it
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  )

  const form = useForm<RendezVousFormSchema>({
    resolver: zodResolver(rendezVousFormSchema),
    defaultValues: DEFAULT_VALUES,
    // errors show once a field is left or on Book, never while typing the first letters
    mode: "onTouched",
  })

  // the same booking follows the visitor between /pourparler and the cabin's bottle: restore
  // it after the first render (the server can't see sessionStorage), then save every change
  useEffect(() => {
    const { guestName, contactEmail, topic, scheduledAt } = readDraft()
    const values = { guestName, contactEmail, topic, scheduledAt }
    if (Object.values(values).some(Boolean)) {
      form.reset(values, { keepDefaultValues: true })
    }
    return form.subscribe({
      formState: { values: true },
      callback: ({ values }) => saveDraft(values),
    })
  }, [form])

  // a saved time someone else took meanwhile (or that went past) is dropped once the slots load
  useEffect(() => {
    const chosen = form.getValues("scheduledAt")
    if (loading || !chosen || slots.some((slot) => slot.start === chosen))
      return
    form.setValue("scheduledAt", "", { shouldValidate: true })
  }, [form, loading, slots])

  async function onSubmit(values: RendezVousFormSchema) {
    try {
      const created = await createRendezVous({
        contactEmail: values.contactEmail,
        guestName: values.guestName,
        topic: values.topic || undefined,
        scheduledAt: values.scheduledAt,
      })
      // the slot leaves the list with the confirmation: earlier, it would clear the chosen
      // time on the note that's still folding away
      const confirm = () => {
        take(values.scheduledAt)
        saveDraft({ ...DEFAULT_VALUES, booked: created })
      }
      if (onBooked) onBooked(confirm)
      else confirm()
      track("site.pourparler", {
        action: "booked",
        topic: Boolean(values.topic),
      })
    } catch (error: any) {
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
    form.reset(DEFAULT_VALUES)
    clearDraft() // after the reset, which saves the emptied fields
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
            inputMode="email"
            placeholder="jack.sparrow@captain.com"
            autoComplete="email"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const renderTopicField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem>
        <FormLabel>Topic (optional)</FormLabel>
        <FormControl>
          <Input
            placeholder="A role, a project, a question…"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const renderSlotField = useCallback(
    ({ field, fieldState }: { field: any; fieldState: any }) => (
      <FormItem>
        {/* a heading, not a <label>: the day and time radios carry their own */}
        <p
          className={`text-sm font-medium ${fieldState.error ? "text-red-800" : ""}`}
        >
          When
        </p>
        <SlotPicker
          slots={slots}
          loading={loading}
          failed={failed}
          value={field.value}
          onChange={field.onChange}
        />
        <FormMessage />
      </FormItem>
    ),
    [failed, loading, slots],
  )

  // what every rendez-vous is, then what this booking became
  const meetingFacts = useMemo<Array<Fact>>(
    () => [
      [ClockIcon, "30 min"],
      [VideoCameraIcon, "Google Meet"],
      [GlobeEuropeAfricaIcon, timeZone],
    ],
    [timeZone],
  )
  const bookedFacts = useMemo<Array<Fact>>(
    () =>
      booked
        ? [
            [
              CalendarDaysIcon,
              <strong key="when">
                {format(new Date(booked.scheduledAt), "EEE d MMM · HH:mm")}
              </strong>,
            ],
            [EnvelopeIcon, `Invitation sent to ${booked.contactEmail}`],
          ]
        : [],
    [booked],
  )

  const chosen = useWatch({ control: form.control, name: "scheduledAt" })

  return (
    <Card className="w-full max-w-md p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {booked ? "Booked" : "Rendez-vous"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {booked ? (
          <div className="flex flex-col gap-5">
            <Facts facts={bookedFacts} />
            <p className="text-sm">
              To reschedule or cancel, use Manage or the link in your
              invitation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={manageHref(booked.id, booked.manageToken)}>
                  Manage
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={bookAnother}
              >
                Book again
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <Facts
              inline
              className="mb-6 text-sm"
              facts={meetingFacts}
            />
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <FormField
                control={form.control}
                name="scheduledAt"
                render={renderSlotField}
              />
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

              <CardFooter className="p-0">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Booking…"
                    : chosen
                      ? `Book ${format(new Date(chosen), "HH:mm")}`
                      : "Book"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
