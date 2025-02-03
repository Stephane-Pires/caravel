/* eslint-disable sort-keys */
export const STARS = {
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
} as const

export type STAR = keyof typeof STARS
