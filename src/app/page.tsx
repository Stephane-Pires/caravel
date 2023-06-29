"use client"

import Image from "next/image"
import Typewriter from "typewriter-effect"

// const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className="grid min-h-screen grid-rows-2 p-8 sm:p-24">
      <div className="row-span-2 flex flex-row items-center justify-around">
        <div className="flex flex-col">
          <h1 className="bg-gradient-to-r from-primary-700 to-primary-300 bg-clip-text font-script text-6xl  font-bold  text-transparent sm:text-8xl">
            Caravel
          </h1>
          <h2 className="font-script text-xl text-primary-200 sm:text-2xl">
            <Typewriter
              options={{
                strings: [
                  "For Adventurers",
                  "For Coders",
                  "For Challengers",
                  "For players",
                  "For Bikers",
                  "For Climbers",
                  "For Gamers",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
        </div>
        {/* <div className="mr-20 hidden sm:block">
          <Image src="/logo.png" alt="logo" width={500} height={500}></Image>
        </div> */}
      </div>
    </main>
  )
}
