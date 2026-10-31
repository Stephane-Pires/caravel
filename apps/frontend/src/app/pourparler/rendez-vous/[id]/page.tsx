import { ManageRendezVous } from "@/components/clients/pourparler/ManageRendezVous"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Your rendez-vous",
  // a private page: keep it out of search engines
  robots: { index: false, follow: false },
}

// the guest's private page to see, reschedule or cancel a rendez-vous
// (the secret token is in the URL fragment, read by the client)
export default async function ManageRendezVousPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: raw } = await params
  // rendez-vous ids are positive integers: anything else can't be one
  if (!/^[1-9]\d*$/.test(raw)) notFound()
  const id = Number(raw)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:p-10">
      <div className="text-accent-200 flex w-full justify-center pt-10">
        <ManageRendezVous id={id} />
      </div>
    </main>
  )
}
