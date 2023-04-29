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
          src="/stars/star.png"
          width={120}
          height={120}
          className="rounded-full"
        />
      )
    case "TWO":
      return (
        <Image
          alt="stars force medium"
          src="/stars/two-stars.png"
          width={120}
          height={120}
          className="rounded-full"
        />
      )
    case "THREE":
      return (
        <Image
          alt="stars force strong"
          src="/stars/three-stars.png"
          width={120}
          height={120}
          className="rounded-full"
        />
      )
  }
}
