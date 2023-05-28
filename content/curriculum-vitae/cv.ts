export const CURRICULUM_VITAE = {
  FORMATION: {
    id: "FORMATION",
    label: "Formation",
    LYCEE: {},
    CLASSES_PREPARATOIRE: {},
    SUPERIEUR: {
      ISEP: {},
      AUDENCIA: {},
      ISCTE: {},
    },
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "Experience",

    ANALOG_WAY: {},
    IZICREDIT: {},
  },

  LOISIR: {
    id: "LOISIR",
    label: "Loisir",
  },
} as const

export type Section = keyof typeof CURRICULUM_VITAE
