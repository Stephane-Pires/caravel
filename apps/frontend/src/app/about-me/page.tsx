"use client"

/* eslint-disable react-hooks/preserve-manual-memoization */

import { DownloadModal } from "@/components/clients/curriculum-vitae/modal/DownloadModal"
// import { NavigationCurriculumVitae } from "@/components/clients/curriculum-vitae/navigation/NavigationCurriculumVitae"
import { SectionContent } from "@/components/clients/curriculum-vitae/section/SectionContent"
import { TimelineContainer } from "@/components/clients/curriculum-vitae/timeline/TimelineContainer"
import { usePercentScrolled } from "@/components/hooks/usePercentIntersection"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function AboutMe() {
  const articleRef = useRef(new Map<string, HTMLDivElement>())
  const sectionExperienceRef = useRef(new Map<string, HTMLDivElement>())
  const sectionHobbiesRef = useRef(new Map<string, HTMLDivElement>())
  const sectionEducationRef = useRef(new Map<string, HTMLDivElement>())

  const percentScrolled = usePercentScrolled()

  const [showLanguageModal, setShowLanguageModal] = useState(false)

  // let [mapDom, setMapDom] = useState(new Map<string, HTMLDivElement>())
  const [mapSectionExperienceDom, setMapSectionExperienceDom] = useState(
    new Map<string, HTMLDivElement>(),
  )
  const [mapSectionHobbiesDom, setMapSectionHobbiesDom] = useState(
    new Map<string, HTMLDivElement>(),
  )
  const [mapSectionEducationDom, setMapSectionEducationDom] = useState(
    new Map<string, HTMLDivElement>(),
  )

  // Stable ref callbacks: each element names its entry with data-article / data-section,
  // so no ref is read during render (react-hooks/refs). React 19 runs the returned cleanup on unmount.
  const registerArticle = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const id = node.dataset.article ?? ""
    articleRef.current.set(id, node)
    return () => {
      articleRef.current.delete(id)
    }
  }, [])

  const registerSection = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const maps = {
      EDUCATION: sectionEducationRef.current,
      EXPERIENCE: sectionExperienceRef.current,
      HOBBIES: sectionHobbiesRef.current,
    }
    const map = maps[node.dataset.article as keyof typeof maps]
    const id = node.dataset.section ?? ""
    map.set(id, node)
    return () => {
      map.delete(id)
    }
  }, [])

  const handleDownloadCVClick = useCallback(() => {
    setShowLanguageModal(true)
  }, [])

  // Find a way to replace this useEffect + useState
  // by a way to forwarding articleRef (with the Map) only when the component is Mounted
  useEffect(() => {
    // setMapDom(articleRef.current)
    setMapSectionExperienceDom(sectionExperienceRef.current)
    setMapSectionHobbiesDom(sectionHobbiesRef.current)
    setMapSectionEducationDom(sectionEducationRef.current)
  }, [])

  const scrollableDivStyle = useMemo(
    () => ({
      width: `calc((${percentScrolled} * 100vw) / 100)`,
    }),
    [percentScrolled],
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-20 md:p-10 md:py-20">
      {/* progress bar */}
      <div
        className={`from-accent-500 to-accent-300 bg-linear-to-r fixed left-0 top-20 z-30 flex h-1`}
        style={scrollableDivStyle}
      />
      <div className="mb-8 mt-4 flex w-full flex-col items-center gap-4 font-serif lg:flex-row lg:gap-10">
        {/* <div className="sticky top-[40%] self-start md:basis-2/12">
          <div className="hidden justify-end md:flex">
            <NavigationCurriculumVitae articleDom={mapDom} />
          </div>
        </div> */}
        {/* The button looks like too much like the <Tag /> component */}
        <div className="order-last my-10 lg:sticky lg:top-[90%] lg:order-first lg:basis-2/12 lg:self-start">
          <button
            onClick={handleDownloadCVClick}
            className="bg-accent-200 hover:bg-accent-400 active:bg-accent-400 mx-auto rounded-md p-3 font-sans text-base font-bold text-blue-900 transition delay-75 active:scale-105 md:flex"
          >
            Download CV{" "}
          </button>
        </div>
        <div className="mx-auto flex max-w-prose flex-col items-center md:basis-8/12">
          <div className="font-script my-10 hidden text-4xl font-bold text-blue-300 md:flex md:text-6xl">
            Me, myself & I ❤️
          </div>
          <div className="flex flex-col gap-4 font-sans md:gap-10">
            <article ref={registerArticle} data-article={CURRICULUM_VITAE.EDUCATION.id}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.EDUCATION.label}
              </h2>
              <section ref={registerSection}
                data-article="EDUCATION"
                data-section={CURRICULUM_VITAE.EDUCATION.section.ISEP.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EDUCATION.section.ISEP}
                />
              </section>

              <section ref={registerSection}
                data-article="EDUCATION"
                data-section={CURRICULUM_VITAE.EDUCATION.section.AUDENCIA.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EDUCATION.section.AUDENCIA}
                />
              </section>
            </article>

            <article ref={registerArticle} data-article={CURRICULUM_VITAE.EXPERIENCE.id}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.EXPERIENCE.label}
              </h2>

              <section ref={registerSection}
                data-article="EXPERIENCE"
                data-section={CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EXPERIENCE.section.ANALOG_WAY}
                />
              </section>

              {/* Izicrédit is hidden for now, see english.ts
              <section ref={registerSection}
                data-article="EXPERIENCE"
                data-section={CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EXPERIENCE.section.IZICREDIT}
                />
              </section>
              */}

              <section ref={registerSection}
                data-article="EXPERIENCE"
                data-section={CURRICULUM_VITAE.EXPERIENCE.section.LEAKMITED.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EXPERIENCE.section.LEAKMITED}
                />
              </section>

              <section ref={registerSection}
                data-article="EXPERIENCE"
                data-section={CURRICULUM_VITAE.EXPERIENCE.section.FIGURES.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.EXPERIENCE.section.FIGURES}
                />
              </section>
            </article>

            <article ref={registerArticle} data-article={CURRICULUM_VITAE.HOBBIES.id}>
              <h2 className="my-16 text-center font-sans text-3xl font-bold text-blue-300 underline underline-offset-4">
                {CURRICULUM_VITAE.HOBBIES.label}
              </h2>

              <section ref={registerSection}
                data-article="HOBBIES"
                data-section={CURRICULUM_VITAE.HOBBIES.section.VIDEO_GAME.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.HOBBIES.section.VIDEO_GAME}
                />
              </section>

              <section ref={registerSection}
                data-article="HOBBIES"
                data-section={CURRICULUM_VITAE.HOBBIES.section.CLIMBING.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.HOBBIES.section.CLIMBING}
                />
              </section>

              <section ref={registerSection}
                data-article="HOBBIES"
                data-section={CURRICULUM_VITAE.HOBBIES.section.BIKING.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.HOBBIES.section.BIKING}
                />
              </section>

              <section ref={registerSection}
                data-article="HOBBIES"
                data-section={CURRICULUM_VITAE.HOBBIES.section.BOARD_GAME.id}>
                <SectionContent
                  section={CURRICULUM_VITAE.HOBBIES.section.BOARD_GAME}
                />
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
            article="HOBBIES"
            withTag={false}
          />
          <TimelineContainer
            sectionDom={mapSectionExperienceDom}
            article="EXPERIENCE"
            withTag={true}
          />
        </div>
      </div>

      <DownloadModal
        isShow={showLanguageModal}
        setIsShow={setShowLanguageModal}
      />
    </main>
  )
}
