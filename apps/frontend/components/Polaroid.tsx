import { motion } from "framer-motion"
import Image from "next/image"

const WING_START_ROTATION = 0
const WING_END_ROTATION = 50

const BOAT_START_ROTATION = 0
const BOAT_END_ROTATION = 1

const ANIMATE_LEFT_WING = {
  rotate: [WING_START_ROTATION, -WING_END_ROTATION],
}
const ANIMATE_RIGHT_WING = {
  rotate: [WING_START_ROTATION, WING_END_ROTATION],
}

const ANIMATE_BOAT = {
  rotate: [BOAT_START_ROTATION, -BOAT_END_ROTATION],
}

const TRANSITION_SLOW = {
  delay: 0.5,
  duration: 1.5,
  repeat: Infinity,
  repeatType: "mirror",
} as const

const TRANSITION = {
  duration: 1,
  repeat: Infinity,
  repeatType: "mirror",
} as const

const STYLE_CLIP = {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
}

const STYLE_WAVE = {
  height: "auto",
  width: "100%",
}

const BirdAnimation = () => {
  return (
    <div className="size-60 overflow-hidden bg-sky-200 md:size-96">
      {/* Bird container */}
      <div className="relative rotate-12">
        {/* Left wing */}
        <motion.div
          className="absolute right-10 h-12 w-[2px] rounded-br-full bg-black"
          animate={ANIMATE_LEFT_WING}
          transition={TRANSITION}
          style={STYLE_CLIP}
        ></motion.div>

        {/* Right wing */}
        <motion.div
          className="absolute right-10 h-12 w-[2px] rounded-bl-full bg-black"
          animate={ANIMATE_RIGHT_WING}
          transition={TRANSITION}
          style={STYLE_CLIP}
        ></motion.div>

        <motion.div
          className="absolute right-16 top-8 h-14 w-[2px] rounded-br-full bg-black"
          animate={ANIMATE_LEFT_WING}
          transition={TRANSITION_SLOW}
          style={STYLE_CLIP}
        ></motion.div>

        {/* Left wing */}
        <motion.div
          className="absolute right-16 top-8 h-14 w-[2px] rounded-bl-full bg-black"
          animate={ANIMATE_RIGHT_WING}
          transition={TRANSITION_SLOW}
          style={STYLE_CLIP}
        ></motion.div>
      </div>

      <motion.div
        animate={ANIMATE_BOAT}
        transition={TRANSITION_SLOW}
      >
        <Image
          alt="sea wave a the bottom of the page"
          src="/logbook/colorized-logo.png"
          width={250}
          height={250}
          className="transla absolute mt-8 transition-transform duration-300 ease-in-out md:mt-32"
        />
      </motion.div>

      <Image
        alt="sea wave a the bottom of the page"
        src="/wave/animated-wave.svg"
        width={0}
        height={0}
        sizes="100vw"
        style={STYLE_WAVE}
        className="mt-36 md:mt-56"
      />
    </div>
  )
}

export function Polaroid() {
  return (
    <div className="hover:-rotate-4 container w-fit -rotate-6 transition-transform duration-300 ease-in-out">
      <div className="rounded-lg bg-white p-6 shadow-lg md:p-10">
        <BirdAnimation />
        <div className="h-8 w-full bg-white md:h-20" />
      </div>
    </div>
  )
}
