import { CURRICULUM_VITAE as CURRICULUM_VITAE_ENGLISH } from "@/content/curriculum-vitae/english"
import {
  CURRICULUM_VITAE as CURRICULUM_VITAE_FRENCH,
  unreachable,
} from "@/content/curriculum-vitae/french"

export type LOCAL_SUPPORTED =
  (typeof LOCAL_SUPPORTED)[keyof typeof LOCAL_SUPPORTED]

export const LOCAL_SUPPORTED = {
  ENGLISH: "english",
  FRENCH: "french",
} as const

export function getCurriculumPDFFilename(local: LOCAL_SUPPORTED) {
  switch (local) {
    case LOCAL_SUPPORTED.FRENCH:
      return "cv_french.pdf"
    case LOCAL_SUPPORTED.ENGLISH:
      return "cv_english.pdf"
    default:
      return unreachable(local)
  }
}

export function reduceLocal(
  local: LOCAL_SUPPORTED,
  toApply: <
    T extends typeof CURRICULUM_VITAE_FRENCH | typeof CURRICULUM_VITAE_ENGLISH,
  >(
    curriculum: T,
  ) => any,
) {
  switch (local) {
    case LOCAL_SUPPORTED.FRENCH:
      return toApply(CURRICULUM_VITAE_FRENCH)
    case LOCAL_SUPPORTED.ENGLISH:
      return toApply(CURRICULUM_VITAE_ENGLISH)
    default:
      return unreachable(local)
  }
}
