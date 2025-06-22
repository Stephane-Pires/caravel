"use client"

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useCreateRendezVous } from "@/utils/hook"
import { CalendarIcon } from "@heroicons/react/24/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  format,
  isBefore,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns"
import { CircleHelpIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod/v4"

const DEFAULT_SCHEDULED_AT_HOUR = "18:30:00"

const [hours, minutes, seconds] =
  DEFAULT_SCHEDULED_AT_HOUR.split(":").map(Number)

const defaultScheduledAt = setSeconds(
  setMinutes(setHours(new Date(), hours), minutes),
  seconds,
)

// Should reference the rendezVousDTO entity
const rendezVousFormSchema = z
  .object({
    contactEmail: z.email().nonempty(),
    scheduledAt: z.date().min(new Date(), {
      message: "Date couldn't be in the past.",
    }),
  })
  .strict()

export type RendezVousFormSchema = z.infer<typeof rendezVousFormSchema>

export function TakeRendezVousForm() {
  const [rendezVous, setRendezVous] = useState<any>([])
  const [createRendezVous] = useCreateRendezVous()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/rendez-vous", {
          method: "GET",
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        setRendezVous(data)
      } catch {
        // setError(err.message)
      } finally {
        // setLoading(false)
      }
    }

    fetchData()
  }, [])

  const form = useForm<z.infer<typeof rendezVousFormSchema>>({
    resolver: zodResolver(rendezVousFormSchema),
    defaultValues: {
      contactEmail: "",
      scheduledAt: defaultScheduledAt,
    },
  })

  async function onSubmit(values: z.infer<typeof rendezVousFormSchema>) {
    try {
      const createRendezVousPromise = createRendezVous({
        contactEmail: values.contactEmail,
        scheduledAt: values.scheduledAt,
      })

      await toast.promise(
        createRendezVousPromise.then((rendezVousCreated) => {
          setRendezVous((prev: any) => [...prev, rendezVousCreated])
          return rendezVousCreated
        }),
        {
          loading: "Creating rendez-vous...",
          success: (rendezVousCreated) => {
            return {
              message: `Rendez-vous created successfully!\nFor ${format(new Date(rendezVousCreated.scheduledAt), "EEEE, MMMM do yyyy 'at' h:mm a")}`,
              style: {
                background: "var(--color-accent-400)",
              },
            }
          },
          error: (err: any) => {
            return {
              message:
                err?.description ||
                "An error occurred while creating the rendez-vous.",
              style: {
                background: "var(--color-urgence-500)",
                color: "white",
              },
            }
          },
        },
      )
    } catch (error) {
      console.error("error creating rendez-vous", error)
      toast.error("An error occurred while creating the rendez-vous.", {
        style: {
          background: "var(--color-urgence-500)",
          color: "white",
        },
      })
    }
  }

  const renderContactEmailField = useCallback(
    ({ field }: { field: any }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <div className="flex flex-row gap-4">
            <div className="basis-7/8">
              <Input
                placeholder="jack.sparrow@captain.com"
                {...field}
              />
            </div>
            <div className="basis-1/8 flex items-center justify-end">
              <Tooltip>
                <TooltipTrigger>
                  <CircleHelpIcon />
                </TooltipTrigger>
                <TooltipContent>
                  The email address is necessary to contact you regarding the
                  rendez-vous.{" "}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  )

  const isDateDisabled = useCallback(
    (date: Date) => {
      const today = startOfDay(new Date())

      // Disable past dates
      if (isBefore(date, today)) return true

      // Disable dates with scheduled rendez-vous
      // Should be typed with the RendezVousDTO type
      return rendezVous.some((rendezVous: any) =>
        isSameDay(new Date(rendezVous.scheduledAt), date),
      )
    },
    [rendezVous],
  )

  const modifiers = useMemo(() => {
    return {
      // Should be typed with the RendezVousDTO type
      occupied: rendezVous.map((rdv: any) =>
        startOfDay(new Date(rdv.scheduledAt)),
      ),
    }
  }, [rendezVous])

  const modifiersClassNames = useMemo(
    () => ({
      occupied: "bg-warning-200 text-warning-800 rounded-md",
    }),
    [],
  )

  const renderScheduledAtField = useCallback(
    ({ field }: { field: any }) => {
      // oxlint-disable-next-line jsx-no-new-function-as-prop
      const handleTimePickerChange = 
        (value: string | undefined) => {
          if (!value) return

          const [hours, minutes, seconds] = value.split(":").map(Number)

          const baseDate = field.value ? new Date(field.value) : new Date()
          const updatedDate = setSeconds(
            setMinutes(setHours(baseDate, hours), minutes),
            seconds,
          )

          field.onChange(updatedDate)
        }

      // oxlint-disable-next-line jsx-no-new-function-as-prop
      const handleCalendarDateChange = 
        (selectedDate: Date | undefined) => {
          if (!selectedDate) return

          const currentDate = field.value ? new Date(field.value) : new Date()

          const mergedDate = setSeconds(
            setMinutes(
              setHours(selectedDate, currentDate.getHours()),
              currentDate.getMinutes(),
            ),
            currentDate.getSeconds(),
          )

          field.onChange(mergedDate)
        }

      return (
        <FormItem className="flex flex-col gap-4">
          <FormLabel>Date of Rendez-vous</FormLabel>

          {/* Date Picker */}
          <div className="flex flex-row gap-4">
            <div className="basis-5/8">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="input"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={handleCalendarDateChange}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    disabled={isDateDisabled}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="basis-2/8">
              <FormControl>
                <Select
                  onValueChange={handleTimePickerChange}
                  value={
                    field.value
                      ? format(new Date(field.value), "HH:mm:ss")
                      : undefined
                  }
                >
                  <SelectTrigger
                    id="time-picker"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18:30:00">18h30</SelectItem>
                    <SelectItem value="19:00:00">19h00</SelectItem>
                    <SelectItem value="19:30:00">19h30</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            <div className="basis-1/8 flex items-center justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelpIcon />
                </TooltipTrigger>
                <TooltipContent>
                  The date is necessary to schedule the rendez-vous.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )
    },
    [isDateDisabled, modifiers, modifiersClassNames],
  )
  return (
    <Card className="min-w-sm container w-full max-w-sm p-4 lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Take &quot;Rendez-Vous&quot;
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="contactEmail"
              render={renderContactEmailField}
            />
            <FormField
              control={form.control}
              name="scheduledAt"
              render={renderScheduledAtField}
            />

            <CardFooter className="p-0">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Submit
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
