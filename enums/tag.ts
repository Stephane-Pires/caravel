export const SUBJECT = {
  CODE: "CODE",
  MOVIE: "MOVIE",
  BOOK_FICTIONNAL: "FICTIONNAL_BOOK",
  GAME_BOARD: "GAME_BOARD",
  GAME_VIDEO: "GAME_VIDEO",
  TEAMS: "TEAMS",
  FUTUR: "FUTUR",
}

export type SUBJECT = keyof typeof SUBJECT

export const TYPE = {
  THOUGH: "ADVENTURE",
  INSPIRATION: "CODE",
}

export type TYPE = keyof typeof TYPE
