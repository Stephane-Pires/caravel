import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Typography",
}

export default function Typography() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-10">
      <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl sm:text-6xl ">
        <div className="relative h-[150px] w-[150px] ">
          <Image src="/logbook/logbook.png" alt="Icon logbook" fill />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-8 p-10">
        <h1 className="m-8  text-center font-script text-4xl text-blue-300">
          Header 1
        </h1>

        <h2 className="m-6 text-center font-script text-3xl text-blue-300">
          Header 2
        </h2>

        <h3 className=" m-4 text-center font-script text-2xl text-blue-300">
          Header 3
        </h3>

        <h4 className=" m-2 text-center font-script text-xl text-blue-300">
          Header 4
        </h4>

        <p className="m-2 font-sans text-xl text-blue-100">Paragraph</p>
      </div>
    </main>
  )
}
