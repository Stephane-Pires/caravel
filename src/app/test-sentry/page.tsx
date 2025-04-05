"use client"

import { useCallback } from "react"

export default function TestSentry() {
  const handleClickSentryError = useCallback(() => {
    throw new Error("Sentry Test Error")
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <button
        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={handleClickSentryError}
        type="button"
      >
        Break the world
      </button>
    </div>
  )
}
