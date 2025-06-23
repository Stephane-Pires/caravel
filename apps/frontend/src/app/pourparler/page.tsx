import { TakeRendezVousForm } from "@/components/clients/pourparler/TakeRendezVousForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pourparler",
}

export default function Pourparler() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 py-20">
      <div className="text-accent-200 flex items-center pt-10">
        <TakeRendezVousForm />
      </div>
    </main>
  )
}
