import { TimelineButton } from "@/components/clients/TimelineButton"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/cv"

interface PropsTimelineCurriculumVitae {
  sectionDom: Map<string, HTMLDivElement>
}

export function TimelineCurriculumVitae({
  sectionDom,
}: PropsTimelineCurriculumVitae) {
  if (sectionDom) {
    return (
      <div className="flex max-h-[800px] w-40 flex-col items-center rounded-lg border-l-4 border-t-4 border-primary-900 bg-primary-600 p-2">
        {Array.from(Object.values(CURRICULUM_VITAE)).map((content) => {
          const domElementReferenced = sectionDom.get(content.id)

          if (domElementReferenced) {
            return (
              <TimelineButton
                key={content.id}
                label={content.label}
                domElementReferenced={domElementReferenced}
              />
            )
          }
        })}
      </div>
    )
  }
  return <div>{"CAN NOT SHOW TIMELINE"}</div>
}
