"use client"

import { useTypewriter } from "@/hooks/typewritter"

export default function Home() {
  const text = useTypewriter(
    [
      "For Developers",
      "For Adventurers",
      "For France",
      "For Maps Lovers",
      "For Water Lovers",
    ],
    {
      speed: 150,
      waitBetween: 2000,
      waitEnd: 2000,
      loop: true,
      cursor: true,
    },
  )

  return (
    <main className="grid min-h-screen grid-rows-2 p-8 sm:p-24">
      <div className="row-span-2 flex flex-row items-center justify-around">
        <div className="flex flex-col">
          <h1 className="from-primary-700 to-primary-300 font-script bg-linear-to-r bg-clip-text text-6xl font-bold text-transparent sm:text-8xl">
            Caravel
          </h1>

          <span className="font-mono text-xl">{text}&nbsp;</span>
        </div>
      </div>
    </main>
  )
}
