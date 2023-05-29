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

    let stepPosition = 0
    const stepGap = 40

    return (
      <nav
        className=" absolute -z-10 w-[1px] flex-col rounded-lg border-2 border-dashed border-primary-600 "
        style={{
          top: firstSectionDom?.offsetTop,
          // Relying on Typescript : https://dev.to/tmaximini/typescript-bang-operator-considered-harmful-3hhi
          height:
            lastSectionDom?.offsetTop! +
            lastSectionDom?.clientHeight! -
            firstSectionDom?.offsetTop!,
        }}
      >
        {Array.from(Object.values(CURRICULUM_VITAE.EXPERIENCE.section)).map(
          (content, index) => {
            const domElementReferenced = sectionDom.get(content.id)

            console.log("content.id", content.id)

            if (domElementReferenced) {
              // This code smell sorry
              if (index !== 0) {
                const previousDomElementReferenced = sectionDom.get(
                  ArrayOfSection[index - 1].id
                )

                // Calculate new stepPosition (start)
                stepPosition =
                  previousDomElementReferenced?.clientHeight! + stepGap
              }

              if (index === ArrayOfSection.length - 1) {
                const previousDomElementReferenced = sectionDom.get(
                  ArrayOfSection[index - 1].id
                )

                stepPosition =
                  previousDomElementReferenced?.clientHeight! +
                  domElementReferenced?.clientHeight!
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
                      <div className="flex h-10 w-10 basis-2/12 items-center justify-center rounded-full border-2 border-primary-700 bg-blue-950 p-4 font-mono ">
                        {index + 1}
                      </div>
                      <p className="basis-10/12 break-normal font-sans">
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
