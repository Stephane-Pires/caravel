"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useCreateRendezVous, useFreeSlots } from "@/utils/hook"
import { CalendarIcon } from "@heroicons/react/24/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod/v4"

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

// slots are grouped by the visitor's own calendar day
const dayKey = (date: Date) => format(date, "yyyy-MM-dd")

const ERROR_STYLE = {
  background: "var(--color-urgence-500)",
  color: "white",
}
const SUCCESS_STYLE = { background: "var(--color-accent-400)" }

export function TakeRendezVousForm() {
  const { slots, loading, failed, take } = useFreeSlots()
  const [createRendezVous] = useCreateRendezVous()
  const [day, setDay] = useState<Date | undefined>(undefined)

  // the visitor's zone: every time below is shown in it
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  )

  const slotsByDay = useMemo(() => {
    const byDay = new Map<string, typeof slots>()
    for (const slot of slots) {
      const key = dayKey(new Date(slot.start))
      byDay.set(key, [...(byDay.get(key) ?? []), slot])
    }
    return byDay
  }, [slots])

  const daySlots = useMemo(
    () => (day ? (slotsByDay.get(dayKey(day)) ?? []) : []),
    [day, slotsByDay],
  )

  // the calendar opens on the first bookable month and can't wander outside the bookable range
  const [firstDay, lastDay] = useMemo(() => {
    const [first] = slots
    const last = slots.findLast(Boolean)
    return [first && new Date(first.start), last && new Date(last.start)]
  }, [slots])

  const isDayFull = useCallback(
    (date: Date) => !slotsByDay.has(dayKey(date)),
    [slotsByDay],
  )

  const form = useForm<RendezVousFormSchema>({
    resolver: zodResolver(rendezVousFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  })

  const pickDay = useCallback(
    (picked: Date | undefined) => {
      setDay(picked)
      form.setValue("scheduledAt", "", { shouldValidate: false })
    },
    [form],
  )

  async function onSubmit(values: RendezVousFormSchema) {
    try {
      await toast.promise(
        createRendezVous({
          contactEmail: values.contactEmail,
          guestName: values.guestName,
          topic: values.topic || undefined,
          scheduledAt: values.scheduledAt,
        }).then((created) => {
          take(values.scheduledAt)
          form.setValue("scheduledAt", "", { shouldValidate: true }) // the slot is gone: pick another
          return created
        }),
        {
          loading: "Booking your rendez-vous…",
          success: (created) => ({
            message: `Booked for ${format(new Date(created.scheduledAt), "EEEE d MMMM 'at' HH:mm")}. A Google Calendar invitation with the video link is on its way to ${created.contactEmail}.`,
            style: SUCCESS_STYLE,
          }),
          error: (error: any) => ({
            message:
              error?.description ||
              "The rendez-vous couldn't be booked. Please try another time.",
            style: ERROR_STYLE,
          }),
        },
      )
    } catch (error) {
      console.error("error creating rendez-vous", error)
    }
  }

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
        <div className="flex flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="input"
                disabled={loading || failed}
                className={cn(
                  "basis-3/5 pl-3 text-left font-normal",
                  !day && "text-muted-foreground",
                )}
              >
                {loading
                  ? "Loading available slots…"
                  : day
                    ? format(day, "EEE d MMM")
                    : "Pick a day"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={day}
                onSelect={pickDay}
                disabled={isDayFull}
                defaultMonth={day ?? firstDay}
                startMonth={firstDay}
                endMonth={lastDay}
              />
            </PopoverContent>
          </Popover>

          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
              disabled={!day || !daySlots.length}
            >
              <SelectTrigger className="basis-2/5">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {daySlots.map((slot) => (
                  <SelectItem
                    key={slot.start}
                    value={slot.start}
                  >
                    {format(new Date(slot.start), "HH:mm")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
        <FormDescription>
          {failed
            ? "The calendar couldn't be loaded. Please try again later."
            : `30 minutes, by video call. Times are in your time zone (${timeZone}).`}
        </FormDescription>
        <FormMessage />
      </FormItem>
    ),
    [
      day,
      daySlots,
      failed,
      firstDay,
      isDayFull,
      lastDay,
      loading,
      pickDay,
      timeZone,
    ],
  )

  return (
    <Card className="container w-full max-w-sm min-w-sm p-4 lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Take &quot;Rendez-Vous&quot;
        </CardTitle>
      </CardHeader>
      <CardContent>
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

            <CardFooter className="p-0">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Book this rendez-vous
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
