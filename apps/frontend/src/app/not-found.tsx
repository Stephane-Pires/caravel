import Image from "next/image"

export default function NotFound() {
  return (
    <main className="z-50 flex h-screen min-h-screen w-full flex-col items-center justify-center p-4">
      <h1 className="text-primary-700 mb-8 font-sans text-8xl">
        404 Not found
      </h1>
      <h1 className="mb-8 font-sans text-2xl text-blue-200">
        Oups, the kraken was there... and it seems that he has sinken us
      </h1>

      <Image
        src="/kraken.svg"
        alt="kraken icon"
        width="300"
        height="300"
        className="border-primary-600 rounded-full border-4"
      />
    </main>
  )
}
