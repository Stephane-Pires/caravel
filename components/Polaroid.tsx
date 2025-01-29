import { motion } from "framer-motion"
import Image from "next/image"

interface PolaroidProps {
  image: string
}

const BirdAnimation = () => {
  return (
    <div className="h-96 w-96 overflow-hidden bg-sky-200">
      {/* Bird container */}
      <div className="relative rotate-12">
        {/* Right wing */}
        <motion.div
          className="absolute right-10 h-12 w-[2px] rounded-br-full bg-black"
          animate={{
            rotate: [0, -50], // Start straight, then rotate to form part of V
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)", // Hides the bottom half of the bar
          }}
        ></motion.div>

        {/* Left wing */}
        <motion.div
          className="absolute right-10 h-12 w-[2px] rounded-bl-full bg-black"
          animate={{
            rotate: [0, 50], // Start straight, then rotate to form the other part of V
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)", // Hides the bottom half of the bar
          }}
        ></motion.div>

        <motion.div
          className="absolute top-8 right-16 h-14 w-[2px] rounded-br-full bg-black"
          animate={{
            rotate: [0, -50], // Start straight, then rotate to form part of V
          }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)", // Hides the bottom half of the bar
          }}
        ></motion.div>

        {/* Left wing */}
        <motion.div
          className="absolute top-8 right-16 h-14 w-[2px] rounded-bl-full bg-black"
          animate={{
            rotate: [0, 50], // Start straight, then rotate to form the other part of V
          }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)", // Hides the bottom half of the bar
          }}
        ></motion.div>
      </div>
      <Image
        alt="sea wave a the bottom of the page"
        src="/wave/animated-wave.svg"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }} // optional
        className="mt-56"
      />
    </div>
  )
}

export function Polaroid({ image }: PolaroidProps) {
  return (
    <div className="container w-fit -rotate-6 transition-transform duration-300 ease-in-out hover:-rotate-4">
      <div className="rounded-lg bg-white p-10 shadow-lg">
        <BirdAnimation />
        <div className="h-20 w-full bg-white" />
      </div>
    </div>
  )
}
