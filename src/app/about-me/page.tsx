"use client"

import { Tag } from "@/components/Tag"
import { NavigationCurriculumVitae } from "@/components/clients/curriculum-vitae/navigation/NavigationCurriculumVitae"
import { TimelineContainer } from "@/components/clients/curriculum-vitae/timeline/TimelineContainer"
import { usePercentScrolled } from "@/components/hooks/usePercentIntersection"
import {
  Article,
  CURRICULUM_VITAE,
  Section,
  SectionKey,
} from "@/content/curriculum-vitae/cv"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// export const generateMetadata = ({ params }) => {
//   const content = allContents.find(
//     (content) => content._raw.flattenedPath === params.slug
//   )
//   return { title: content.title }
// }

export default function AboutMe() {
  let articleRef = useRef(new Map<string, HTMLDivElement>())
  let sectionExperienceRef = useRef(new Map<string, HTMLDivElement>())
  let sectionHobbiesRef = useRef(new Map<string, HTMLDivElement>())
  let sectionEducationRef = useRef(new Map<string, HTMLDivElement>())

  const percentScrolled = usePercentScrolled()

  // let [mapDom, setMapDom] = useState(new Map<string, HTMLDivElement>())
  let [mapSectionExperienceDom, setMapSectionExperienceDom] = useState(
    new Map<string, HTMLDivElement>()
  )
  let [mapSectionHobbiesDom, setMapSectionHobbiesDom] = useState(
    new Map<string, HTMLDivElement>()
  )
  let [mapSectionEducationDom, setMapSectionEducationDom] = useState(
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

  // Should be generic setRefSectionExperience & setRefSectionHobbies should be one function setRefSection
  function setRefSectionExperience(section: SectionKey<"EXPERIENCE">) {
    return (node: HTMLDivElement | null) => {
      if (node) {
        sectionExperienceRef.current.set(
          CURRICULUM_VITAE["EXPERIENCE"].section[section].id,
          node
        )
      } else {
        sectionExperienceRef.current.delete(
          CURRICULUM_VITAE["EXPERIENCE"].section[section].id
        )
      }
    }
  }

  function setRefSectionHobbies(section: SectionKey<"LOISIR">) {
    return (node: HTMLDivElement | null) => {
      if (node) {
        sectionHobbiesRef.current.set(
          CURRICULUM_VITAE["LOISIR"].section[section].id,
          node
        )
      } else {
        sectionHobbiesRef.current.delete(
          CURRICULUM_VITAE["LOISIR"].section[section].id
        )
      }
    }
  }

  function setRefSectionEducation(section: SectionKey<"EDUCATION">) {
    return (node: HTMLDivElement | null) => {
      if (node) {
        sectionEducationRef.current.set(
          CURRICULUM_VITAE["EDUCATION"].section[section].id,
          node
        )
      } else {
        sectionEducationRef.current.delete(
          CURRICULUM_VITAE["EDUCATION"].section[section].id
        )
      }
    }
  }

  // Find a way to replace this useEffect + useState
  // by a way to forwarding articleRef (with the Map) only when the component is Mounted
  useEffect(() => {
    // setMapDom(articleRef.current)
    setMapSectionExperienceDom(sectionExperienceRef.current)
    setMapSectionHobbiesDom(sectionHobbiesRef.current)
    setMapSectionEducationDom(sectionEducationRef.current)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-20 md:p-10 md:py-20">
      {/* progress bar */}
      <div
        className={`fixed left-0 top-20 flex h-1 bg-gradient-to-r from-accent-500 to-accent-300  `}
        style={{
          width: `calc((${percentScrolled} * 100vw) / 100)`,
        }}
      />
      <div className="mb-8 mt-4 flex w-full flex-row items-center gap-4 font-serif md:gap-10">
        <div className="sticky top-[40%]  self-start md:basis-2/12">
          <div className="hidden justify-end md:flex">
            {/* <NavigationCurriculumVitae articleDom={mapDom} /> */}
          </div>
        </div>
        <div className=" mx-auto flex  max-w-prose  flex-col items-center md:basis-8/12">
          <div className=" my-10 hidden font-script text-4xl font-bold text-blue-300 md:flex md:text-6xl">
            Me, myself & I ❤️
          </div>
          <div className="flex flex-col gap-4 font-sans md:gap-10">
            <article ref={setRefArticle("EDUCATION")}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.EDUCATION.label}
              </h2>
              <section ref={setRefSectionEducation("ISEP")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.EDUCATION.section.ISEP.label}
                </h3>

                <div
                  className="m-4 flex flex-row flex-wrap items-center justify-center gap-2
              "
                >
                  {CURRICULUM_VITAE.EDUCATION.section.ISEP.content.skills.map(
                    (skill) => (
                      <Tag tag={skill} key={skill} />
                    )
                  )}
                </div>
                <div className="my-10 indent-8">
                  {CURRICULUM_VITAE.EDUCATION.section.ISEP.content.paragraph}
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.EDUCATION.section.ISEP.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>
              <section ref={setRefSectionEducation("AUDENCIA")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.EDUCATION.section.AUDENCIA.label}
                </h3>
                <div
                  className="m-4 flex flex-row flex-wrap items-center justify-center gap-2
              "
                >
                  {CURRICULUM_VITAE.EDUCATION.section.AUDENCIA.content.skills.map(
                    (skill) => (
                      <Tag tag={skill} key={skill} />
                    )
                  )}
                </div>
                <div className="my-10 indent-8">
                  {
                    CURRICULUM_VITAE.EDUCATION.section.AUDENCIA.content
                      .paragraph
                  }
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.EDUCATION.section.AUDENCIA.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>
            </article>

            <article ref={setRefArticle("EXPERIENCE")}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.EXPERIENCE.label}
              </h2>

              <section ref={setRefSectionExperience("ANALOG_WAY")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.label}
                </h3>

                <div
                  className="m-4 flex flex-row flex-wrap items-center justify-center gap-2
              "
                >
                  {CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.content.skills.map(
                    (skill) => (
                      <Tag tag={skill} key={skill} />
                    )
                  )}
                </div>
                <div className="my-10 indent-8">
                  {
                    CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.content
                      .paragraph
                  }
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>

              <section ref={setRefSectionExperience("IZICREDIT")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.label}
                </h3>
                <div
                  className="m-4 flex flex-row flex-wrap items-center justify-center gap-2
              "
                >
                  {CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.content.skills.map(
                    (skill) => (
                      <Tag tag={skill} key={skill} />
                    )
                  )}
                </div>
                <div className="my-10 indent-8">
                  {
                    CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.content
                      .paragraph
                  }
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>
            </article>

            <article ref={setRefArticle("LOISIR")}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.LOISIR.label}
              </h2>

              <section ref={setRefSectionHobbies("VIDEO_GAME")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.LOISIR.section.VIDEO_GAME.label}
                </h3>

                <div className="my-10 indent-8">
                  {CURRICULUM_VITAE.LOISIR.section.VIDEO_GAME.content.paragraph}
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.LOISIR.section.VIDEO_GAME.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>

              <section ref={setRefSectionHobbies("CLIMBING")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.LOISIR.section.CLIMBING.label}
                </h3>
                <div className="my-10 indent-8">
                  {CURRICULUM_VITAE.LOISIR.section.CLIMBING.content.paragraph}
                </div>

                <div className="relative -z-20 h-[600px] ">
                  <Image
                    src={`/about-me/climbing.jpeg`}
                    alt="My Image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              </section>

              <section ref={setRefSectionHobbies("BIKING")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.LOISIR.section.BIKING.label}
                </h3>

                <div className="my-10 indent-8">
                  {CURRICULUM_VITAE.LOISIR.section.BIKING.content.paragraph}
                </div>

                <div className="relative -z-20 my-10 h-[600px] ">
                  <Image
                    src={`/about-me/bike.jpeg`}
                    alt="My Image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>

                <div className="relative -z-20 h-[600px] ">
                  <Image
                    src={`/about-me/bike-treasure.jpeg`}
                    alt="My Image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              </section>

              <section ref={setRefSectionHobbies("BOARD_GAME")}>
                <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
                  {CURRICULUM_VITAE.LOISIR.section.BOARD_GAME.label}
                </h3>

                <div className="my-10 indent-8">
                  {CURRICULUM_VITAE.LOISIR.section.BOARD_GAME.content.paragraph}
                </div>

                <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
                  {CURRICULUM_VITAE.LOISIR.section.BOARD_GAME.content.missions.map(
                    (mission) => (
                      <li key={mission}>{mission}</li>
                    )
                  )}
                </ul>
              </section>
            </article>
          </div>
        </div>
        {/* Should not be included in the JS bundle when the screen is mobile. */}
        <div className="hidden lg:flex lg:basis-2/12">
          <TimelineContainer
            sectionDom={mapSectionEducationDom}
            article="EDUCATION"
            withTag={true}
          />
          <TimelineContainer
            sectionDom={mapSectionHobbiesDom}
            article="LOISIR"
            withTag={false}
          />
          <TimelineContainer
            sectionDom={mapSectionExperienceDom}
            article="EXPERIENCE"
            withTag={true}
          />
        </div>
      </div>
    </main>
  )
}
