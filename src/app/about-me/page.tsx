"use client"

import { NavigationCurriculumVitae } from "@/components/clients/curriculum-vitae/navigation/NavigationCurriculumVitae"
import { TimelineContainer } from "@/components/clients/curriculum-vitae/timeline/TimelineContainer"
import { usePercentScrolled } from "@/components/hooks/usePercentIntersection"
import {
  Article,
  CURRICULUM_VITAE,
  Section,
} from "@/content/curriculum-vitae/cv"
import { useEffect, useRef, useState } from "react"

// export const generateMetadata = ({ params }) => {
//   const content = allContents.find(
//     (content) => content._raw.flattenedPath === params.slug
//   )
//   return { title: content.title }
// }

export default function AboutMe() {
  let articleRef = useRef(new Map<string, HTMLDivElement>())
  let sectionRef = useRef(new Map<string, HTMLDivElement>())

  const percentScrolled = usePercentScrolled()

  let [mapDom, setMapDom] = useState(new Map<string, HTMLDivElement>())
  let [mapSectionDom, setMapSectionDom] = useState(
    new Map<string, HTMLDivElement>()
  )

  const setRefArticle = (article: Article) => {
    return (node: HTMLDivElement | null) => {
      if (node) {
        articleRef.current.set(CURRICULUM_VITAE[article].id, node)
      } else {
        articleRef.current.delete(CURRICULUM_VITAE[article].id)
      }
    }
  }

  function setRefSection(section: Section<"EXPERIENCE">) {
    return (node: HTMLDivElement | null) => {
      if (node) {
        sectionRef.current.set(
          CURRICULUM_VITAE["EXPERIENCE"].section[section].id,
          node
        )
      } else {
        sectionRef.current.delete(
          CURRICULUM_VITAE["EXPERIENCE"].section[section].id
        )
      }
    }
  }

  // Find a way to replace this useEffect + useState
  // by a way to forwarding articleRef (with the Map) only when the component is Mounted
  useEffect(() => {
    setMapDom(articleRef.current)
    setMapSectionDom(sectionRef.current)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-20 sm:p-10">
      {/* progress bar */}
      <div
        className={`fixed left-0 top-20 hidden h-1 bg-gradient-to-r from-accent-500 to-accent-300 sm:flex `}
        style={{
          width: `calc((${percentScrolled} * 100vw) / 100)`,
        }}
      />
      <div className="mb-8 mt-4 flex w-full flex-row items-center gap-4 font-serif sm:gap-10">
        <div className="sticky top-[40%] basis-1/12 self-start sm:basis-2/12">
          <div className="flex justify-end">
            <NavigationCurriculumVitae articleDom={mapDom} />
          </div>
        </div>
        <div className="mx-auto flex max-w-prose  basis-11/12  flex-col items-center sm:basis-9/12">
          <div className=" my-10 hidden font-script text-4xl font-bold text-blue-300 sm:flex sm:text-6xl">
            Me, myself & I ❤️
          </div>
          <div className="flex flex-col gap-4 sm:gap-10">
            <article ref={setRefArticle("FORMATION")}>
              <h2 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.FORMATION.label}
              </h2>
              <section>
                section-2 is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </section>
              <section>
                section-3 Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </section>
            </article>

            <article ref={setRefArticle("EXPERIENCE")}>
              <h2 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.EXPERIENCE.label}
              </h2>

              <h3 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.label}
              </h3>
              <section ref={setRefSection("ANALOG_WAY")}>
                DIV-4 Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
              </section>
              <h3 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.label}
              </h3>
              <section ref={setRefSection("IZICREDIT")}>
                section-4 Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
              </section>
              <h3 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.EXPERIENCE.section.NAWAK.label}
              </h3>
              <section ref={setRefSection("NAWAK")}>
                section-4 Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
                <section>
                  section-4 Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </section>
              </section>
            </article>

            <article ref={setRefArticle("LOISIR")}>
              <h2 className="m-6 text-center font-script text-3xl font-bold text-blue-300">
                {CURRICULUM_VITAE.LOISIR.label}
              </h2>
              section-7 Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
              <section>
                section-6 Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </section>
            </article>
          </div>
        </div>
        <div className="hidden basis-1/12 sm:flex">
          <TimelineContainer sectionDom={mapSectionDom} />
        </div>
      </div>
    </main>
  )
}
