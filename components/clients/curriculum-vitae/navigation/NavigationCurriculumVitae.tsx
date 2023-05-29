import {
  NavigationButton,
  NavigationButtonMobile,
} from "@/components/clients/curriculum-vitae/navigation/NavigationButton"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/cv"
import { Fragment } from "react"

interface PropsNavigationCurriculumVitae {
  articleDom: Map<string, HTMLDivElement>
}

export function NavigationCurriculumVitae({
  articleDom,
}: PropsNavigationCurriculumVitae) {
  if (articleDom) {
    return (
      <nav className="flex flex-col items-center   rounded-lg bg-primary-600 p-1 sm:border-l-4 sm:border-t-4 sm:border-primary-900 sm:p-2">
        {Array.from(Object.values(CURRICULUM_VITAE)).map((content) => {
          const domElementReferenced = articleDom.get(content.id)

          if (domElementReferenced) {
            return (
              <Fragment key={content.id}>
                <NavigationButton
                  label={content.label}
                  icon={<content.icon className="h-8 w-8" />}
                  domElementReferenced={domElementReferenced}
                />
                <NavigationButtonMobile
                  icon={<content.icon className="h-8 w-8" />}
                  domElementReferenced={domElementReferenced}
                />
              </Fragment>
            )
          }
        })}
      </nav>
    )
  }
  return <div>{"CAN NOT SHOW TIMELINE"}</div>
}
