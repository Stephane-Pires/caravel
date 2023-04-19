"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => setCount((prevCount) => prevCount + 1)
  const handleDecrement = () => setCount((prevCount) => prevCount - 1)

  return (
    <div className="flex flex-col gap-4">
      <div>Your counter is : {count} </div>
      <button
        className="select-none rounded-lg bg-blue-400 hover:bg-blue-500 active:bg-blue-600"
        onClick={handleIncrement}
      >
        INCREMENT
      </button>
      <button
        className="select-none rounded-lg bg-blue-400 hover:bg-blue-500 active:bg-blue-600"
        onClick={handleDecrement}
      >
        INCREMENT
      </button>
    </div>
  )
}
