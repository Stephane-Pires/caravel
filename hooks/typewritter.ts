import { useEffect, useState } from "react"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useTypewriter(
  //   element: HTMLSpanElement,
  phrases: Array<string>,
  options: {
    speed: number
    waitBetween: number
    waitEnd: number
    loop: boolean
    cursor: boolean
  },
) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState("")
  const [cursor, setCursor] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const type = async () => {
    while (options.loop || phraseIndex !== phrases.length - 1) {
      for (const [phIndex, phrase] of phrases.entries()) {
        setPhraseIndex(phIndex)

        setIsTyping(true)
        for (const letter of phrase) {
          setText((prev) => prev + letter)

          await wait(options.speed)
        }
        setIsTyping(false)

        await wait(options.waitEnd)

        setIsTyping(true)
        for (const _ of phrase) {
          setText((prev) => prev.slice(0, prev.length - 1))

          await wait(options.speed)
        }
        setIsTyping(false)

        await wait(options.waitBetween)
      }
    }
  }

  const typeCursor = async () => {
    while (options.cursor) {
      setCursor("|")
      await wait(500)

      
      setCursor("")
      await wait(500)
    }
  }

  // if is deleting
  // if is not deleting

  useEffect(() => {
    
    type()
    typeCursor()
  }, [])

  return `${text}${isTyping ? "|" : cursor}`
}
