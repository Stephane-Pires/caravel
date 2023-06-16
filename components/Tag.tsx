import { CATEGORY, SOFT_SKILLS, SUBJECT, TECHNO } from "@/enums/tag"

type Tag = SUBJECT | CATEGORY | TECHNO | SOFT_SKILLS

interface TagProps {
  tag: Tag
}

function getColor(tag: SUBJECT | CATEGORY | TECHNO | SOFT_SKILLS) {
  switch (tag) {
    case "CODE":
    case "MOVIE":
    case "GAME_BOARD":
    case "GAME_VIDEO":
    case "TEAMS":
    case "FUTUR":
    case "BOOK_FICTIONNAL":
    case "BOOK_NON_FICTIONNAL":
    case "THOUGH":
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
    case "JAVASCRIPT":
    case "JAVA":
    case "HTML":
    case "CSS":
    case "NEGOCIATION":
    case "FINANCE":
    case "MANAGEMENT":
    case "ACCOUNTING":
    case "CHANGE_MANAGMENT":
    case "BUSINESS_DEVELOPMENT":
      return "bg-accent-200"
  }
}

function getLabel(tag: SUBJECT | CATEGORY | TECHNO | SOFT_SKILLS) {
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
    case "JAVASCRIPT":
      return "Javascript"
    case "JAVA":
      return "Java"
    case "HTML":
      return "HTML"
    case "CSS":
      return "CSS"
    case "NEGOCIATION":
      return "Negociation"
    case "FINANCE":
      return "Finance"
    case "MANAGEMENT":
      return "Managment"
    case "ACCOUNTING":
      return "Accounting"
    case "CHANGE_MANAGMENT":
      return "Change Managment"
    case "BUSINESS_DEVELOPMENT":
      return "Business Development"
  }
}

export function Tag({ tag }: TagProps) {
  return (
    <div
      className={`${getColor(
        tag
      )} my-2 max-w-fit rounded-lg border-2 border-primary-900 px-2 py-1 font-sans font-semibold text-blue-900`}
    >
      {getLabel(tag)}
    </div>
  )
}
