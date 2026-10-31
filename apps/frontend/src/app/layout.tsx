import { Navigation, NavigationMobile } from "@/components/Navigation"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Atkinson_Hyperlegible, Merienda } from "next/font/google"
import localFont from "next/font/local"
import Link from "next/link"

import "./globals.css"

export const metadata: Metadata = {
  description: "The adventure blog of Stéphane Pires",
  title: "Caravel",
}

const mono_lisa_regular = localFont({
  display: "swap",
  src: "./MonoLisa-Regular.ttf",
  variable: "--font-mono-lisa-regular",
})

const merienda = Merienda({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-merienda",
})

const atkinson = Atkinson_Hyperlegible({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} ${merienda.variable} ${mono_lisa_regular.variable}`}
    >
      <body>
        <header className="fixed z-50 h-20 w-full bg-slate-900">
          <Navigation />
          <NavigationMobile />
        </header>

        {children}

        <footer className="bg-primary-600 flex flex-row justify-center gap-4 p-2 text-blue-900">
          <span>Made by Stéphane Pires with ❤️</span>
          <Link
            className="underline"
            href="/privacy"
          >
            Privacy
          </Link>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
