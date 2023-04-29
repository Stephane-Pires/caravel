import { CATEGORY, SUBJECT } from "@/enums/tag"

type Tag = SUBJECT | CATEGORY

interface TagProps {
  tag: Tag
}

function getColor(tag: SUBJECT | CATEGORY) {
  switch (tag) {
    case "CODE":
      return "bg-teal-300"
    case "MOVIE":
      return "bg-cyan-300"
    case "GAME_BOARD":
      return "bg-sky-300"
    case "GAME_VIDEO":
      return "bg-indigo-300"
    case "TEAMS":
      return "bg-violet-300"
    case "FUTUR":
      return "bg-purple-300"
    case "BOOK_FICTIONNAL":
    case "BOOK_NON_FICTIONNAL":
      return "bg-stone-300"
    case "THOUGH":
      return "bg-pink-300"
    case "INSPIRATION":
      return "bg-rose-300"
  }
}

function getLabel(tag: SUBJECT | CATEGORY) {
  switch (tag) {
    case "CODE":
      return "Code 🧑‍💻"
    case "MOVIE":
      return "Movie 🍿"
    case "GAME_BOARD":
      return "Game board 🎲"
    case "GAME_VIDEO":
      return "Video game 👾"
    case "TEAMS":
      return "Teams 👏"
    case "FUTUR":
      return "Futur 🔮"
    case "BOOK_FICTIONNAL":
    case "BOOK_NON_FICTIONNAL":
      return "Book 📚"
    case "THOUGH":
      return "Though 💭"
    case "INSPIRATION":
      return "Inspiration 🤩"
  }
}

export function Tag({ tag }: TagProps) {
  return (
    <div className={`${getColor(tag)} my-2 rounded-lg px-2 py-1`}>
      {getLabel(tag)}
    </div>
  )
}
