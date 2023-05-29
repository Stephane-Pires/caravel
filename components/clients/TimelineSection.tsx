import {
  TimelineButton,
  TimelineButtonMobile,
} from "@/components/clients/TimelineButton"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/cv"

interface PropsTimelineCurriculumVitae {
  sectionDom: Map<string, HTMLDivElement>
}

export function TimelineSection({ sectionDom }: PropsTimelineCurriculumVitae) {
  if (sectionDom) {
    return (
      <nav className="flex flex-col items-center   rounded-lg bg-primary-600 p-1 sm:border-l-4 sm:border-t-4 sm:border-primary-900 sm:p-2">
        {Array.from(Object.values(CURRICULUM_VITAE)).map((content) => {
          const domElementReferenced = sectionDom.get(content.id)

          if (domElementReferenced) {
            return (
              <>
                <TimelineButton
                  key={content.id}
                  label={content.label}
                  icon={<content.icon className="h-8 w-8" />}
                  domElementReferenced={domElementReferenced}
                />
                <TimelineButtonMobile
                  key={content.id}
                  icon={<content.icon className="h-8 w-8" />}
                  domElementReferenced={domElementReferenced}
                />
              </>
            )
          }
        })}
      </nav>
    )
  }
  return <div>{"CAN NOT SHOW TIMELINE"}</div>
}
