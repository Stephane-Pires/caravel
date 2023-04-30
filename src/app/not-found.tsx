import Image from "next/image"

export default function NotFound() {
  return (
    <main className="z-50 flex h-[100vh] min-h-screen w-full flex-col items-center justify-center p-4">
      <h1 className="mb-8 font-sans text-8xl text-primary-700">
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
        className="rounded-full border-4 border-primary-600"
      />
    </main>
  )
}
