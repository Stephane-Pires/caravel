import { CURRICULUM_VITAE as CURRICULUM_VITAE_ENGLISH } from "@/content/curriculum-vitae/english"
import { CURRICULUM_VITAE as CURRICULUM_VITAE_FRENCH } from "@/content/curriculum-vitae/french"

export type LOCAL_SUPPORTED =
  (typeof LOCAL_SUPPORTED)[keyof typeof LOCAL_SUPPORTED]

export const LOCAL_SUPPORTED = {
  FRENCH: "french",
  ENGLISH: "english",
} as const

export function reduceLocal(
  local: LOCAL_SUPPORTED,
  toApply: <
    T extends typeof CURRICULUM_VITAE_FRENCH | typeof CURRICULUM_VITAE_ENGLISH
  >(
    curriculum: T
  ) => any
) {
  switch (local) {
    case LOCAL_SUPPORTED.FRENCH:
      return toApply(CURRICULUM_VITAE_FRENCH)
    case LOCAL_SUPPORTED.ENGLISH:
      return toApply(CURRICULUM_VITAE_ENGLISH)
  }
}
