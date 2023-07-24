import { Tag } from "@/components/Tag"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Projects",
}

export default function Projects() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-10 py-20">
      <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl sm:text-6xl ">
        <div className="relative h-[150px]">⛵️</div>
      </div>

      <div className="grid gap-16 p-4 lg:grid-cols-1 2xl:grid-cols-2">
        <a href="https://ventus-jade.vercel.app/1">
          <div className=" h-80 min-w-[660px] max-w-[660px] -rotate-6 rounded-xl border-l-4 border-t-4 border-primary-900 bg-primary-700 p-2 transition delay-100 ease-in-out hover:rotate-0 hover:bg-primary-500 active:scale-105 active:bg-primary-500">
            <div className="m-2 flex flex-row">
              <h2 className="mr-8 font-script text-blue-900">Ventus</h2>
              <div className="flex translate-y-1 flex-row gap-4">
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
              </div>
            </div>
            <div className="m-2 mt-4 flex flex-row justify-between">
              <div className="font-script text-blue-900/70">
                Beginning Date :
              </div>
              <div className="font-script text-blue-900/70">Arrival Date :</div>
            </div>
            <div className="m-2 flex flex-row justify-between">
              <div className="border-b-2 border-primary-900  font-mono text-blue-900">
                14 december 2022
              </div>
              <div className="border-b-2 border-primary-900 font-mono text-blue-900">
                8 february 2023
              </div>
            </div>
            <div className="flex flex-row justify-between gap-2 p-2">
              <div className="relative h-[172px] min-w-[300px] ">
                <Image
                  src={`/projects/ventus.png`}
                  alt="My Image"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <Tag tag="CSS" />
              </div>
            </div>
          </div>
        </a>

        <a href="https://caravel-mocha.vercel.app/">
          <div className=" min-w-[660px] max-w-[660px] -rotate-6 rounded-xl border-l-4 border-t-4 border-primary-900 bg-primary-700 p-2 transition delay-100 ease-in-out hover:rotate-0 hover:bg-primary-500 active:scale-105 active:bg-primary-500">
            <div className="m-2 flex flex-row">
              <h2 className="mr-8 font-script text-blue-900">Caravel</h2>
              <div className="flex translate-y-1 flex-row gap-4">
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
                <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
              </div>
            </div>
            <div className="m-2 mt-4 flex flex-row justify-between">
              <div className="font-script text-blue-900/70">
                Beginning Date :{" "}
              </div>
              <div className="font-script text-blue-900/70">Arrival Date :</div>
            </div>
            <div className="m-2 flex flex-row justify-between">
              <div className="border-b-2 border-primary-900  font-mono text-blue-900">
                14 december 2022
              </div>
              <div className="border-b-2 border-primary-900 font-mono text-blue-900">
                8 february 2023
              </div>
            </div>
            <div className="flex flex-row justify-between gap-2 p-2">
              <div className="relative h-[172px] min-w-[300px] ">
                <Image
                  src={`/projects/caravel.png`}
                  alt="My Image"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <Tag tag="JAVASCRIPT" />
                <Tag tag="JAVASCRIPT" />
                <Tag tag="JAVASCRIPT" />
                <Tag tag="JAVASCRIPT" />
                <Tag tag="REACT" />
                <Tag tag="REACT" />
                <Tag tag="REACT" />
                <Tag tag="REACT" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </main>
  )
}
