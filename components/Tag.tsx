import { CATEGORY, SUBJECT, TECHNO } from "@/enums/tag"

type Tag = SUBJECT | CATEGORY | TECHNO

interface TagProps {
  tag: Tag
}

function getColor(tag: SUBJECT | CATEGORY | TECHNO) {
  switch (tag) {
    case "CODE":
      return "bg-primary-200"
    case "MOVIE":
      return "bg-primary-200"
    case "GAME_BOARD":
      return "bg-primary-200"
    case "GAME_VIDEO":
      return "bg-primary-200"
    case "TEAMS":
      return "bg-primary-200"
    case "FUTUR":
      return "bg-primary-200"
    case "BOOK_FICTIONNAL":
    case "BOOK_NON_FICTIONNAL":
      return "bg-primary-200"
    case "THOUGH":
      return "bg-primary-200"
    case "INSPIRATION":
      return "bg-primary-200"
    case "REACT":
    case "TYPESCRIPT":
    case "SQL":
    case "GRAPHQL":
    case "POSTGRESQL":
    case "REDUX":
    case "NEXTJS":
    case "SVELTE":
    case "SVELTEKIT":
    case "NODEJS":
      return "bg-accent-200"
  }
}

function getLabel(tag: SUBJECT | CATEGORY | TECHNO) {
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
    case "GRAPHQL":
      return "GraphQL 🏴‍☠️"
    case "REACT":
      return "React 🚀"
    case "TYPESCRIPT":
      return "Typescript"
    case "SQL":
      return "SQL"
    case "POSTGRESQL":
      return "PostgreSQL"
    case "REDUX":
      return "Redux"
    case "NEXTJS":
      return "NextJS"
    case "SVELTE":
      return "Svelte"
    case "SVELTEKIT":
      return "SvelteKit"
    case "NODEJS":
      return "NodeJS"
  }
}

export function Tag({ tag }: TagProps) {
  return (
    <div
      className={`${getColor(
        tag
      )} my-2 max-w-fit rounded-lg border-2 border-primary-900 px-2 py-1 font-sans text-blue-900`}
    >
      {getLabel(tag)}
    </div>
  )
}
