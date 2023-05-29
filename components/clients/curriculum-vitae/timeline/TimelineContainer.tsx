import {
  NavigationButton,
  NavigationButtonMobile,
} from "@/components/clients/curriculum-vitae/navigation/NavigationButton"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/cv"
import { Fragment } from "react"

interface PropsTimelineContainer {
  sectionDom: Map<string, HTMLDivElement>
}

export function TimelineContainer({ sectionDom }: PropsTimelineContainer) {
  if (sectionDom) {
    const ArrayOfSection = Array.from(
      Object.values(CURRICULUM_VITAE.EXPERIENCE.section)
    )

    const firstSectionDom = sectionDom.get(ArrayOfSection[0].id)
    const lastSectionDom = sectionDom.get(
      ArrayOfSection[ArrayOfSection.length - 1].id
    )

    // console.log("firstSection", firstSectionDom)
    console.log("firstSection : clientHeight", firstSectionDom?.clientHeight)
    // console.log("firstSection : clientTop", firstSectionDom?.clientTop)
    // console.log("firstSection : offsetTop", firstSectionDom?.offsetTop)
    // console.log("lastSection", lastSectionDom)
    // console.log("lastSectionDom : clientHeight", lastSectionDom?.clientHeight)
    // console.log("lastSectionDom : clientTop", lastSectionDom?.clientTop)
    // console.log("lastSectionDom : offsetTop", lastSectionDom?.offsetTop)

    let stepPosition = -5

    return (
      <nav
        className="absolute w-[1px] flex-col rounded-lg border-2 border-dashed border-primary-600 "
        style={{
          top: firstSectionDom?.offsetTop,
          height:
            lastSectionDom?.offsetTop +
            lastSectionDom?.clientHeight -
            firstSectionDom?.offsetTop,
        }}
      >
        {Array.from(Object.values(CURRICULUM_VITAE.EXPERIENCE.section)).map(
          (content, index) => {
            const domElementReferenced = sectionDom.get(content.id)

            if (domElementReferenced) {
              // This code smell sorry
              if (index !== 0) {
                const previousDomElementReferenced = sectionDom.get(
                  ArrayOfSection[index - 1].id
                )

                stepPosition += previousDomElementReferenced?.clientHeight!
              }

              if (index === ArrayOfSection.length - 1) {
                stepPosition -= index * 55
              }
              return (
                <Fragment key={content.id}>
                  <div
                    className="sticky flex min-w-fit -translate-x-5"
                    style={{
                      top: 100,
                      right: 100,
                      marginTop: stepPosition,
                    }}
                  >
                    <div className="flex h-full w-40 flex-row items-center justify-center gap-4 bg-slate-900">
                      <div className="flex h-10 w-10 basis-2/12 items-center justify-center rounded-full bg-primary-700 p-4 font-mono text-accent-900 ">
                        {index}
                      </div>
                      <p className="basis-10/12 break-normal">
                        {content.label}
                      </p>
                    </div>
                  </div>
                </Fragment>
              )
            }
          }
        )}
      </nav>
    )
  }
  return <div>{"CAN NOT SHOW TIMELINE"}</div>
}

// Container
// A (icon)
// |  - Text
// |  - Text
// B (icon)
// |  - Text
// |  - Text
// C (icon)

// - Container
// - Item + Icon + Text
