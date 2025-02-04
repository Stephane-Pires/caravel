/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
import { useCallback, useEffect, useState } from "react"

const CURSOR_BLINK_INTERVAL = 500

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useTypewriter(
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

  const type = useCallback(async () => {
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
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typeCursor = useCallback(async () => {
    while (options.cursor) {
      setCursor("|")
      await wait(CURSOR_BLINK_INTERVAL)

      setCursor("")
      await wait(CURSOR_BLINK_INTERVAL)
    }
  }, [options.cursor])

  useEffect(() => {
    type()
    typeCursor()
  }, [type, typeCursor])

  return `${text}${isTyping ? "|" : cursor}`
}
