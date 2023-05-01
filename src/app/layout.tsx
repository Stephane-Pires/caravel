import { Navigation } from "@/components/Navigation"
import type { Metadata } from "next"
import { Merienda, Open_Sans } from "next/font/google"
import localFont from "next/font/local"
import Image from "next/image"
import Link from "next/link"

import "./globals.css"

export const metadata: Metadata = {
  title: "Caravel",
  description: "The adventure blog of Stéphane Pires",
}

const mono_lisa_regular = localFont({
  src: "./MonoLisa-Regular.ttf",
  variable: "--font-mono-lisa-regular",
  display: "swap",
})

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${open_sans.variable} ${merienda.variable} ${mono_lisa_regular.variable}`}
    >
      <body>
        <header className="fixed z-50 grid h-20 w-full grid-cols-3 gap-4 bg-slate-900 p-2">
          <div className="col-span-1 ml-4  font-script text-4xl">
            <Link href="/">
              <Image
                src="/logbook/logbook.png"
                alt="logo caravel"
                width={60}
                height={60}
              />
            </Link>
          </div>
          <Navigation />
        </header>

        {children}

        <footer className="flex flex-row justify-center bg-primary-600 p-2 text-blue-900">
          Made by Stéphane Pires with ❤️
        </footer>
      </body>
    </html>
  )
}
