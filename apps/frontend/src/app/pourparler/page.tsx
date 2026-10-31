import { TakeRendezVousForm } from "@/components/clients/pourparler/TakeRendezVousForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pourparler",
  description:
    "Book a 30-minute video call with Stéphane Pires: pick a free time, get a Google Calendar invitation.",
}

export default function Pourparler() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:p-10">
      <div className="text-accent-200 flex w-full justify-center pt-10">
        <TakeRendezVousForm />
      </div>
    </main>
  )
}
