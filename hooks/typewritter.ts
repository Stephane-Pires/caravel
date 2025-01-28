import { useEffect, useState } from "react"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useTypewriter(
  //   element: HTMLSpanElement,
  phrases: Array<String>,
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
        for (const letterIndex in phrase) {
          setText((prev) => prev + phrase[letterIndex])

          await wait(options.speed)
        }
        setIsTyping(false)

        await wait(options.waitEnd)

        setIsTyping(true)
        for (const _ in phrase) {
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

      console.log("CURSOR")
      setCursor("")
      await wait(500)
    }
  }

  // if is deleting
  // if is not deleting

  useEffect(() => {
    console.log("SHOULD EXECUTE ONLY ONCE ON MOUNT")
    type()
    typeCursor()
  }, [])

  return `${text}${isTyping ? "|" : cursor}`
}
