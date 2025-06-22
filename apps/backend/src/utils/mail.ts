import dayjs from "dayjs"
import ical, { ICalCalendarMethod, ICalEventStatus } from "ical-generator"
import nodemailer from "nodemailer"

import type { RendezVous } from "../core/rendez-vous/rendez-vous.entity.js"
import { assertEnv } from "./env.js"

const env = assertEnv(process.env)

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: "caravel.blog@gmail.com",
    pass: env.GMAIL_PASSWORD,
  },
})

export class MailService {
  static async sendRendezVousCreated({
    id,
    contactEmail,
    scheduledAt,
  }: RendezVous) {
    try {
      const calendarContact = ical({ name: "Caravel Calendar" })
      // A method is required for outlook to display event as an invitation
      calendarContact.method(ICalCalendarMethod.REQUEST)

      calendarContact.createEvent({
        id,
        start: dayjs(scheduledAt).toDate(),
        end: dayjs(scheduledAt).add(30, "minutes").toDate(),
        summary: "Rendez-vous from Caravel",
        description:
          "A Rendez-vous was scheduled with Stéphane Pires, to discuss your project",
        location: "online",
        url: "https://caravel-mocha.vercel.app/",
      })

      const contactMailOptions = {
        from: "[Caravel] - Stéphane Pires <caravel.blog@gmail.com>",
        to: contactEmail,
        subject: `Caravel - Rendez-vous confirmation`,
        html: `
        <p>Hi,</p>
        <p>Your rendez-vous has been confirmed for the <strong>${dayjs(scheduledAt).format("DD dddd MMMM YYYY at HH:mm")}</strong>.</p>
        <p>See you soon!</p>
        <p>Stéphane Pires</p>
        `,
        alternatives: [
          {
            contentType: 'text/calendar; method=REQUEST; charset="UTF-8"',
            content: calendarContact.toString(),
          },
        ],
      }

      await transporter.sendMail(contactMailOptions)

      const calendarCaravel = ical({ name: "Caravel Calendar" })
      // A method is required for outlook to display event as an invitation
      calendarCaravel.method(ICalCalendarMethod.REQUEST)

      calendarCaravel.createEvent({
        id,
        start: dayjs(scheduledAt).toDate(),
        end: dayjs(scheduledAt).add(30, "minutes").toDate(),
        summary: `Rendez-vous with Caravel (${contactEmail})`,
        description: "A Rendez-vous was scheduled via Caravel",
        location: "online",
        url: "https://caravel-mocha.vercel.app/",
      })

      const caravelMailOptions = {
        from: "[Caravel] <caravel.blog@gmail.com>",
        to: "stephane.pires.learning@gmail.com",
        subject: `Caravel - Rendez-vous confirmed`,
        html: `
        <p>Hi,</p>
        <p>${contactEmail} has scheduled a RendezVous at <strong>${dayjs(scheduledAt).format("DD dddd MMMM YYYY at HH:mm")}</strong>.</p>
        <p>Nicely done!</p>
        <p>Caravel</p>
        `,
        alternatives: [
          {
            contentType: 'text/calendar; method=REQUEST; charset="UTF-8"',
            content: calendarCaravel.toString(),
          },
        ],
      }

      await transporter.sendMail(caravelMailOptions)
    } catch (error) {
      console.error("Error sending mail:", error)
      throw error
    }
  }

  static async sendRendezVousMoved(
    originalRendezVous: RendezVous,
    movedRendezVous: RendezVous,
  ) {
    try {
      const calendarContact = ical({ name: "Caravel Calendar" })
      // A method is required for outlook to display event as an invitation
      calendarContact.method(ICalCalendarMethod.COUNTER)

      calendarContact.createEvent({
        id: movedRendezVous.id,
        start: dayjs(movedRendezVous.scheduledAt).toDate(),
        end: dayjs(movedRendezVous.scheduledAt).add(30, "minutes").toDate(),
        organizer: { name: "Caravel", email: "caravel.blog@gmail.com" },
        summary: "Rendez-vous from Caravel",
        description:
          "A Rendez-vous was scheduled with Stéphane Pires, to discuss your project", //   location: "online",
        url: "https://caravel-mocha.vercel.app/",
      })

      const contactMailOptions = {
        from: "[Caravel] - Stéphane Pires <caravel.blog@gmail.com>",
        to: movedRendezVous.contactEmail,
        subject: `Caravel - Rendez-vous moved`,
        html: `
      <p>Hi,</p>
      <p>Your Rendez-vous to discuss your project with Stéphane Pires was moved.</p>
      <p>- From (old Date): <strong>${dayjs(originalRendezVous.scheduledAt).format("DD dddd MMMM YYYY at HH:mm")}</strong>.</p>
      <p>- To (new Date): <strong>${dayjs(movedRendezVous.scheduledAt).format("DD dddd MMMM YYYY at HH:mm")}</strong>.</p>
      <p>See you soon!</p>
      <p>Stéphane Pires</p>`,
        alternatives: [
          {
            contentType: 'text/calendar; method=REQUEST; charset="UTF-8"',
            content: calendarContact.toString(),
          },
        ],
      }

      await transporter.sendMail(contactMailOptions)

      const calendarCaravel = ical({ name: "Caravel Calendar" })
      // A method is required for outlook to display event as an invitation
      calendarCaravel.method(ICalCalendarMethod.COUNTER)

      calendarCaravel.createEvent({
        id: movedRendezVous.id,
        organizer: { name: "Caravel", email: "caravel.blog@gmail.com" },
        start: dayjs(movedRendezVous.scheduledAt).toDate(),
        end: dayjs(movedRendezVous.scheduledAt).add(30, "minutes").toDate(),
        summary: `Rendez-vous with Caravel (${movedRendezVous.contactEmail})`,
        description: "A Rendez-vous was scheduled via Caravel",
        location: "online",
        url: "https://caravel-mocha.vercel.app/",
      })

      const caravelMailOptions = {
        from: "[Caravel] <caravel.blog@gmail.com>",
        to: "stephane.pires.learning@gmail.com",
        subject: `Caravel - Rendez-vous moved`,
        html: `
        <p>Hi,</p>
        <p>${movedRendezVous.contactEmail} has moved the RendezVous at <strong>${dayjs(movedRendezVous.scheduledAt).format("DD dddd MMMM YYYY at HH:mm")}</strong>.</p>
        <p>Caravel</p>
        `,
        alternatives: [
          {
            contentType: 'text/calendar; method=REQUEST; charset="UTF-8"',
            content: calendarCaravel.toString(),
          },
        ],
      }

      await transporter.sendMail(caravelMailOptions)
    } catch (error) {
      console.error("Error sending mail:", error)
      throw error
    }
  }

  static async sendCancelRendezVous(rendezVousList: Array<RendezVous>) {
    try {
      await Promise.all(
        rendezVousList.map(async (rendezVous) => {
          // Create cancel calendar event for the contact
          const calendarContact = ical({ name: "Caravel Calendar" })
          calendarContact.method(ICalCalendarMethod.CANCEL)

          calendarContact.createEvent({
            id: rendezVous.id,
            start: dayjs(rendezVous.scheduledAt).toDate(),
            status: ICalEventStatus.CANCELLED,
            summary: "Rendez-vous from Caravel",
            organizer: { name: "Caravel", email: "caravel.blog@gmail.com" },
          })

          const contactMailOptions = {
            from: "[Caravel] - Stéphane Pires <caravel.blog@gmail.com>",
            to: rendezVous.contactEmail,
            subject: `Caravel - Rendez-vous canceled`,
            html: `
            <p>Hi,</p>
            <p>Your Rendez-vous scheduled the <strong>${dayjs(
              rendezVous.scheduledAt,
            ).format(
              "DD dddd MMMM YYYY at HH:mm",
            )}</strong> to discuss your project with Stéphane Pires was <strong>CANCELED</strong>.</p>
            <p>Stéphane Pires</p>`,
            alternatives: [
              {
                contentType: 'text/calendar; method=CANCEL; charset="UTF-8"',
                content: calendarContact.toString(),
              },
            ],
          }

          await transporter.sendMail(contactMailOptions)

          // Create calendar event for Caravel (with REQUEST method)
          const calendarCaravel = ical({ name: "Caravel Calendar" })
          calendarCaravel.method(ICalCalendarMethod.CANCEL)

          calendarCaravel.createEvent({
            id: rendezVous.id,
            start: dayjs(rendezVous.scheduledAt).toDate(),
            status: ICalEventStatus.CANCELLED,
            summary: "Rendez-vous from Caravel",
            organizer: { name: "Caravel", email: "caravel.blog@gmail.com" },
          })

          const caravelMailOptions = {
            from: "[Caravel] <caravel.blog@gmail.com>",
            to: "stephane.pires.learning@gmail.com",
            subject: `Caravel - Rendez-vous canceled`,
            html: `
            <p>Hi,</p>
            <p>The rendez-vous with ${rendezVous.contactEmail} the <strong>${dayjs(
              rendezVous.scheduledAt,
            ).format(
              "DD dddd MMMM YYYY at HH:mm",
            )}</strong> has been deleted.</p>
            <p>Caravel</p>
            `,
            alternatives: [
              {
                contentType: 'text/calendar; method=REQUEST; charset="UTF-8"',
                content: calendarCaravel.toString(),
              },
            ],
          }

          await transporter.sendMail(caravelMailOptions)
        }),
      )
    } catch (error) {
      console.error("Error sending mail:", error)
      throw error
    }
  }
}
