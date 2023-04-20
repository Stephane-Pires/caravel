import { STAR } from "@/enums/stars"
import Image from "next/image"

interface StarProps {
  star: STAR
}

export function Star({ star }: StarProps) {
  switch (star) {
    case "ONE":
      return (
        <Image
          alt="wind force weak"
          src="/wind/little-wind.png"
          width={80}
          height={80}
        />
      )
    case "TWO":
      return (
        <Image
          alt="wind force medium"
          src="/wind/medium-wind.png"
          width={80}
          height={80}
        />
      )
    case "THREE":
      return (
        <Image
          alt="wind force strong"
          src="/wind/strong-wind.png"
          width={80}
          height={80}
        />
      )
  }
}
