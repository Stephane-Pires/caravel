import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sandbox",
}

export default function Sandbox() {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-8 px-10 pt-20 sm:px-40">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <Link
          className=" m-auto flex h-40 w-40 items-center justify-center rounded-xl border-4 border-accent-100 bg-primary-600 hover:bg-primary-300"
          href="/sandbox/colors"
        >
          <div className="text-center font-sans text-xl text-blue-900">
            Colors
          </div>
        </Link>
        <Link
          className="m-auto flex h-40 w-40 items-center justify-center rounded-xl border-4 border-accent-100 bg-primary-600 hover:bg-primary-300"
          href="/sandbox/typography"
        >
          <div className="text-center font-sans text-xl text-blue-900">
            Typography
          </div>
        </Link>
        <Link
          className="m-auto flex h-40 w-40 items-center justify-center rounded-xl border-4 border-accent-100 bg-primary-600 hover:bg-primary-300"
          href="/sandbox/pdf"
        >
          <div className="text-center font-sans text-xl text-blue-900">
            Pdf generator
          </div>
        </Link>
      </div>
    </main>
  )
}
