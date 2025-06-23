"use client"

import { Polaroid } from "@/components/Polaroid"
import { useTypewriter } from "@/components/hooks/useTypewritter"

export default function Home() {
  const text = useTypewriter(
    [
      "From France",
      "For Developers",
      "For Adventurers",
      "For Maps Lovers",
      "For Water Lovers",
    ],
    {
      cursor: true,
      loop: true,
      speed: 150,
      waitBetween: 2000,
      waitEnd: 2000,
    },
  )

  return (
    <main className="grid min-h-screen grid-rows-2 p-8 sm:p-24">
      <div className="row-span-2 flex flex-row items-center justify-around">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="from-primary-700 to-primary-300 font-script bg-linear-to-r bg-clip-text text-6xl font-bold text-transparent sm:text-8xl">
              Caravel
            </h1>
            <span className="pl-2 font-mono text-xl text-blue-100">
              {text}&nbsp;
            </span>
          </div>

          <Polaroid />
        </div>
      </div>
    </main>
  )
}
