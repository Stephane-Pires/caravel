import { Article, CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { Fragment } from "react"

import { TimelineIcon } from "./TimelineIcon"

interface PropsTimelineContainer {
  sectionDom: Map<string, HTMLDivElement>
  article: Article
  withTag: boolean
}

// The performance is terrible, since this component is re-rendering on each scrollbar event
export function TimelineContainer({
  sectionDom,
  article,
  withTag,
}: PropsTimelineContainer) {
  if (sectionDom) {
    const ArrayOfSection = Array.from(
      Object.values(CURRICULUM_VITAE[article].section)
    )

    const firstSectionDom = sectionDom.get(ArrayOfSection[0].id)
    const lastSectionDom = sectionDom.get(
      ArrayOfSection[ArrayOfSection.length - 1].id
    )

    let stepPosition = 0
    const stepGap = withTag ? 90 : 60

    return (
      <div
        className="absolute z-20 w-px flex-col rounded-lg border-2 border-dashed border-primary-600 "
        style={{
          top: firstSectionDom?.offsetTop!,
          // Relying on Typescript : https://dev.to/tmaximini/typescript-bang-operator-considered-harmful-3hhi
          height:
            lastSectionDom?.offsetTop! +
            lastSectionDom?.clientHeight! -
            firstSectionDom?.offsetTop!,
        }}
      >
        {Array.from(Object.values(CURRICULUM_VITAE[article].section)).map(
          (content, index) => {
            const domElementReferenced = sectionDom.get(content.id)

            if (domElementReferenced) {
              // This code smell sorry
              if (index !== 0) {
                const previousDomElementReferenced = sectionDom.get(
                  ArrayOfSection[index - 1].id
                )

                // Calculate new stepPosition (start)
                stepPosition =
                  previousDomElementReferenced?.clientHeight! - stepGap
              }

              return (
                <Fragment key={content.id}>
                  <div
                    className="sticky flex min-w-fit -translate-x-6"
                    style={{
                      top: 100,
                      right: 100,
                      marginTop: stepPosition,
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex h-full w-40 flex-row items-center justify-center gap-4 bg-slate-900">
                        <TimelineIcon
                          icon={content.icon}
                          link={content.link}
                        />
                        <p className="basis-10/12 break-normal font-sans">
                          {content.label}
                        </p>
                      </div>
                      <div className="flex w-36 translate-x-10 flex-col items-start justify-start break-words bg-slate-900 font-mono text-slate-400">
                        <div className="flex flex-row justify-between">{`from: ${content.duration.start}`}</div>
                        <div className="flex flex-row justify-between">{`to: ${content.duration.end}`}</div>
                        {content.duration?.difference && (
                          <div className="flex flex-row justify-between">{`(${content.duration.difference})`}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Fragment>
              )
            }
          }
        )}
      </div>
    )
  }
  return <div>{"CAN NOT SHOW TIMELINE"}</div>
}
