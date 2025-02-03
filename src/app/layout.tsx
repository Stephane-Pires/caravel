import { Navigation, NavigationMobile } from "@/components/Navigation"
import type { Metadata } from "next"
import { Merienda, Open_Sans } from "next/font/google"
import localFont from "next/font/local"

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

const open_sans = Open_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-open-sans",
})

const merienda = Merienda({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-merienda",
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
        <header className="fixed z-50 h-20 w-full bg-slate-900">
          <Navigation />
          <NavigationMobile />
        </header>

        {children}

        <footer className="bg-primary-600 flex flex-row justify-center p-2 text-blue-900">
          Made by Stéphane Pires with ❤️
        </footer>
      </body>
    </html>
  )
}
