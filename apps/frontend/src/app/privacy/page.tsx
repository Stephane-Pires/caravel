import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site keeps about you, why, for how long, and how to have it deleted.",
}

const CONTACT_EMAIL = "pires.stephane.pro@gmail.com"
const LAST_UPDATED = "30 October 2026"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-2xl">{title}</h2>
      {children}
    </section>
  )
}

export default function Privacy() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-4 py-20 leading-relaxed">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl sm:text-5xl">Privacy</h1>
        <p className="text-sm">Last updated {LAST_UPDATED}</p>
        <p>
          This is Stéphane Pires&apos;s personal site. I keep as little about
          you as I can, and nothing is sold or shared for advertising. For any
          question, or to have your data deleted, write to{" "}
          <a
            className="underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </header>

      <Section title="Booking a rendez-vous (Pourparler)">
        <p>
          When you book a call, I keep{" "}
          <strong>your name, your email, the topic</strong> you wrote (if any)
          and <strong>the time</strong> you picked. I use them only to hold that
          call: to send you the invitation and the video link, and to let you
          reschedule or cancel.
        </p>
        <ul className="list-disc pl-6">
          <li>
            The booking is an event in my Google Calendar. Google sends you the
            invitation, the reminders and any update, and keeps that event like
            any other meeting in my calendar.
          </li>
          <li>
            The booking itself is stored in a database hosted by Neon, in the
            European Union (Frankfurt).
          </li>
          <li>
            <strong>
              It is deleted 30 days after the rendez-vous, or as soon as you
              cancel.
            </strong>
          </li>
          <li>
            The private link in your invitation lets you see, move or cancel
            your rendez-vous. Only a fingerprint of it is stored, so nobody can
            rebuild it from the database.
          </li>
        </ul>
        <p>
          The legal basis is your request: you ask for a call, and this is what
          it takes to set it up.
        </p>
      </Section>

      <Section title="Visiting the site">
        <ul className="list-disc pl-6">
          <li>
            The site is hosted by Vercel, which keeps short-lived technical logs
            (such as IP addresses) to run it and protect it.
          </li>
          <li>
            Errors and performance are measured with Sentry, on its servers in
            the European Union. For a small share of visits, Sentry records how
            the page behaved; text and images are masked in those recordings.
            The 3D cabin also counts which objects get opened, without knowing
            who opened them.
          </li>
          <li>
            Your browser remembers whether you prefer the 3D cabin or the
            classic site. That choice never leaves your device.
          </li>
        </ul>
        <p>There are no advertising or cross-site tracking cookies.</p>
      </Section>

      <Section title="Your rights">
        <p>
          Under the GDPR you can ask to see, correct or delete what I keep about
          you, or object to it. Write to{" "}
          <a
            className="underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>{" "}
          and I&apos;ll answer within a month. You can also complain to the
          CNIL, the French data protection authority (cnil.fr).
        </p>
      </Section>

      <Section title="Google Calendar">
        <p>
          The site connects to one Google account only: mine, to place
          rendez-vous in my own calendar and to know when I&apos;m busy. Of my
          other events it uses only their times, and it never asks for access to
          your Google account.
        </p>
      </Section>

      <p>
        <Link
          className="underline"
          href="/"
        >
          Back to the site
        </Link>
      </p>
    </main>
  )
}
