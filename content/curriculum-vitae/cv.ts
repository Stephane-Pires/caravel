import {
  AcademicCapIcon,
  ArrowsUpDownIcon,
  ComputerDesktopIcon,
  EyeSlashIcon,
  MapIcon,
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
        icon: EyeSlashIcon,
      },
      IZICREDIT: {
        id: "IZICREDIT",
        label: "Izicrédit",
        icon: EyeSlashIcon,
      },
      NAWAK: {
        id: "NAWAK",
        label: "nawak",
        icon: EyeSlashIcon,
      },
      GIGAWAK: {
        id: "GIGAWAK",
        label: "gigawak",
        icon: EyeSlashIcon,
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
        icon: PuzzlePieceIcon,
      },
      CLIMBING: {
        id: "CLIMBING",
        label: "Climbing",
        icon: ArrowsUpDownIcon,
      },
      BIKING: {
        id: "BIKING",
        label: "Biking",
        icon: MapIcon,
      },
      BOARD_GAME: {
        id: "BOARD_GAME",
        label: "Board game",
        icon: PuzzlePieceIcon,
      },
    },
  },
} as const

export type Article = keyof typeof CURRICULUM_VITAE

export type SectionKey<T extends Article> = keyof Section<T>

export type Section<T extends Article> = (typeof CURRICULUM_VITAE)[T]["section"]
// export type Test<
//   T extends Article,
//   K extends Section<T>
// > = (typeof CURRICULUM_VITAE)[T]["section"][K]

export function unreachable(x: never): never {
  throw new Error(
    `This codepath is not reachable this variable: ${x} should be handled`
  )
}
