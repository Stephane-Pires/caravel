import {
  AcademicCapIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid"

export const CURRICULUM_VITAE = {
  FORMATION: {
    id: "FORMATION",
    label: "Formation",
    icon: AcademicCapIcon,
    section: {
      // LYCEE: {},
      // CLASSES_PREPARATOIRE: {},
      ISEP: {
        id: "ISEP",
        label: "Institut supérieur d'électronique de Paris",
      },
      AUDENCIA: {
        id: "AUDENCIA",
        label: "Audencia",
      },
      ISCTE: {
        id: "ISCTE",
        label: "Instituto Universitário de Lisboa",
      },
    },
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "Experience",
    icon: ComputerDesktopIcon,
    section: {
      ANALOG_WAY: {
        id: "ANALOG_WAY",
        label: "Analog Way",
      },
      IZICREDIT: {
        id: "IZICREDIT",
        label: "Izicrédit",
      },
    },
  },

  LOISIR: {
    id: "LOISIR",
    label: "Loisir",
    icon: PuzzlePieceIcon,
    section: {
      VIDEO_GAME: {
        id: "VIDEO_GAME",
        label: "Video games",
      },
      CLIMBING: {
        id: "CLIMBING",
        label: "Climbing",
      },
      BIKING: {
        id: "BIKING",
        label: "Biking",
      },
      BOARD_GAME: {
        id: "BOARD_GAME",
        label: "Board game",
      },
    },
  },
} as const

export type Article = keyof typeof CURRICULUM_VITAE

type MapArticleToSection<T extends Article> = T extends Article
  ? keyof (typeof CURRICULUM_VITAE)[T]["section"]
  : never

export type Section<T extends Article> = MapArticleToSection<T>

export function unreachable(x: never): never {
  throw new Error(
    `This codepath is not reachable this variable: ${x} should be handled`
  )
}
