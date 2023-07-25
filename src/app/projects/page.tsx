import { BoardingCard, BoardingCardMobile } from "@/components/BoardingCard"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
}

export default function Projects() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-10 py-20">
      <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl sm:text-6xl ">
        <div className="relative h-[150px]">⛵️</div>
      </div>

      <div className="grid gap-16 p-4 lg:grid-cols-1 2xl:grid-cols-2">
        <BoardingCard
          title={CURRICULUM_VITAE.PROJECTS.section.VENTUS.label}
          duration={CURRICULUM_VITAE.PROJECTS.section.VENTUS.duration}
          url={CURRICULUM_VITAE.PROJECTS.section.VENTUS.url}
          skills={CURRICULUM_VITAE.PROJECTS.section.VENTUS.content.skills}
          image={CURRICULUM_VITAE.PROJECTS.section.VENTUS.icon}
        />

        <BoardingCard
          title={CURRICULUM_VITAE.PROJECTS.section.CARAVEL.label}
          duration={CURRICULUM_VITAE.PROJECTS.section.CARAVEL.duration}
          url={CURRICULUM_VITAE.PROJECTS.section.CARAVEL.url}
          skills={CURRICULUM_VITAE.PROJECTS.section.CARAVEL.content.skills}
          image={CURRICULUM_VITAE.PROJECTS.section.CARAVEL.icon}
        />
      </div>
    </main>
  )
}
