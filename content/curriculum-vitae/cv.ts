import {
  AcademicCapIcon,
  ArrowsUpDownIcon,
  ComputerDesktopIcon,
  EyeSlashIcon,
  MapIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid"

export const CURRICULUM_VITAE = {
  EDUCATION: {
    id: "EDUCATION",
    label: "Education",
    // icon: AcademicCapIcon,
    icon: "/about-me/academic.svg",
    section: {
      // LYCEE: {},
      // CLASSES_PREPARATOIRE: {},
      ISEP: {
        id: "ISEP",
        label: "Isep",
        icon: "/about-me/isep-logo.png",
        duration: {
          start: "Sep 2016",
          end: "Jun 2018",
          difference: "2 years",
        },
      },
      AUDENCIA: {
        id: "AUDENCIA",
        label: "Audencia",
        icon: "/about-me/audencia-logo.png",
        duration: {
          start: "Sep 2018",
          end: "Aug 2019",
          difference: "1 year",
        },
      },
    },
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "Experience",
    // icon: ComputerDesktopIcon,
    icon: "/about-me/computer-desktop.svg",
    section: {
      ANALOG_WAY: {
        id: "ANALOG_WAY",
        label: "Analog Way",
        // icon: EyeSlashIcon,
        icon: "/about-me/analogway-logoo.png",
        duration: {
          start: "Sep 2019",
          end: "Feb 2023",
          difference: "3+ years",
        },
      },
      IZICREDIT: {
        id: "IZICREDIT",
        label: "Izicrédit",
        // icon: EyeSlashIcon,
        icon: "/about-me/izicredit-logo.png",

        duration: {
          start: "Feb 2023",
          end: "Jun 2023",
          difference: "4 month",
        },
      },
      // NAWAK: {
      //   id: "NAWAK",
      //   label: "nawak",
      //   icon: EyeSlashIcon,
      // },
      // GIGAWAK: {
      //   id: "GIGAWAK",
      //   label: "gigawak",
      //   icon: EyeSlashIcon,
      // },
    },
  },

  LOISIR: {
    id: "HOBBIES",
    label: "Hobbies",
    // icon: PuzzlePieceIcon,
    icon: "/about-me/puzzle-piece.svg",
    section: {
      VIDEO_GAME: {
        id: "VIDEO_GAME",
        label: "Video games",
        icon: "/about-me/power-blue.svg",
        duration: {
          start: "1998",
          end: "today",
        },
      },
      CLIMBING: {
        id: "CLIMBING",
        label: "Climbing",
        icon: "/about-me/arrow-up-down-blue.svg",
        duration: {
          start: "2022",
          end: "today",
        },
      },
      BIKING: {
        id: "BIKING",
        label: "Biking",
        // icon: MapIcon,
        icon: "/about-me/map-blue.svg",
        duration: {
          start: "2018",
          end: "today",
        },
      },
      BOARD_GAME: {
        id: "BOARD_GAME",
        label: "Board game",
        // icon: PuzzlePieceIcon,
        icon: "/about-me/puzzle-piece-blue.svg",

        duration: {
          start: "2018",
          end: "today",
        },
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
