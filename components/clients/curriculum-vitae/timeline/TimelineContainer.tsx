/* eslint-disable no-magic-numbers */
import { Article, CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { Fragment, useMemo } from "react"

import { TimelineIcon } from "./TimelineIcon"

const STEP_GAP_WITH_TAG_IN_PX = 90
const STEP_GAP_IN_PX = 60

interface PropsTimelineContainer {
  sectionDom: Map<string, HTMLDivElement>
  article: Article
  withTag: boolean
}

// The performance is terrible, since this component is re-rendering on each scrollbar event
export function TimelineContainer({
  article,
  sectionDom,
  withTag,
}: PropsTimelineContainer) {
  const ArrayOfSection = Array.from(
    Object.values(CURRICULUM_VITAE[article].section),
  )

  const firstSectionDom = sectionDom.get(ArrayOfSection[0].id)
  const lastSectionDom = sectionDom.get(
    ArrayOfSection[ArrayOfSection.length - 1].id,
  )

  let stepPosition = 0
  const stepGap = withTag ? STEP_GAP_WITH_TAG_IN_PX : STEP_GAP_IN_PX

  const TIMELINE_DOT_STYLE = useMemo(() => {
    // Relying on Typescript : https://dev.to/tmaximini/typescript-bang-operator-considered-harmful-3hhi
    return {
      height:
        lastSectionDom?.offsetTop! +
        lastSectionDom?.clientHeight! -
        firstSectionDom?.offsetTop!,
      top: firstSectionDom?.offsetTop!,
    }
  }, [
    lastSectionDom?.offsetTop,
    lastSectionDom?.clientHeight,
    firstSectionDom?.offsetTop,
  ])

  if (!sectionDom) {
    return <div>{"CAN NOT SHOW TIMELINE"}</div>
  }

  return (
    <div
      className="border-primary-600 absolute z-20 w-px flex-col rounded-lg border-2 border-dashed"
      style={TIMELINE_DOT_STYLE}
    >
      {Array.from(Object.values(CURRICULUM_VITAE[article].section)).map(
        (content, index) => {
          const domElementReferenced = sectionDom.get(content.id)

          if (domElementReferenced) {
            // This code smell sorry
            if (0 !== index) {
              const previousDomElementReferenced = sectionDom.get(
                ArrayOfSection[index - 1].id,
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
                    marginTop: stepPosition,
                    right: 100,
                    top: 100,
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex h-full w-40 flex-row items-center justify-center gap-4 bg-slate-900">
                      <TimelineIcon
                        icon={content.icon}
                        link={content.link}
                      />
                      <p className="basis-10/12 font-sans break-normal">
                        {content.label}
                      </p>
                    </div>
                    <div className="flex w-36 translate-x-10 flex-col items-start justify-start bg-slate-900 font-mono break-words text-slate-400">
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

          return (
            <div
              key={content.id}
              className="text-red-500"
            >
              {"UI ERROR ELEMENT"}
            </div>
          )
        },
      )}
    </div>
  )
}
