import { useIsVisible } from "@/components/hooks/useIsVisible"
import Image from "next/image"
import { useCallback } from "react"

interface PropsTimelineButton {
  label?: string
  domElementReferenced: HTMLDivElement
  //Find the type for HeroIcon
  icon: string
}

export function NavigationButton({
  domElementReferenced,
  label,
  icon,
}: PropsTimelineButton) {
  const isVisible = useIsVisible(domElementReferenced)

  const scrollIntoView = (domElement: HTMLDivElement) => {
    domElement.scrollIntoView({ behavior: "smooth" })
  }

  const handleButtonClick = useCallback(
    () => scrollIntoView(domElementReferenced),
    [domElementReferenced],
  )

  return (
    <button
      onClick={handleButtonClick}
      className={`${
        isVisible ? "bg-accent-500/80 text-blue-900" : "bg-blue-950"
      } m-2 hidden w-full items-center rounded-2xl border-2 border-blue-950 px-4 py-2 font-sans font-bold hover:bg-blue-900 hover:text-white sm:flex sm:flex-row sm:gap-2`}
    >
      <div className="basis-4/12">
        <Image
          height={30}
          width={30}
          src={isVisible ? icon.split(".svg").join("-blue.svg") : icon}
          alt="icon of the navigation button"
        />
      </div>
      <div className="basis-8/12">{label}</div>
    </button>
  )
}

export function NavigationButtonMobile({
  domElementReferenced,
  icon,
}: PropsTimelineButton) {
  const isVisible = useIsVisible(domElementReferenced)

  const scrollIntoView = (domElement: HTMLDivElement) => {
    domElement.scrollIntoView({ behavior: "smooth" })
  }

  const handleButtonClick = useCallback(
    () => scrollIntoView(domElementReferenced),
    [domElementReferenced],
  )

  return (
    <button
      onClick={handleButtonClick}
      className={`${
        isVisible ? "bg-accent-500/80 text-blue-900" : "bg-blue-950"
      } m-1 flex size-12 items-center justify-center rounded-full border-2 border-red-950 p-1 font-sans font-bold hover:bg-blue-900 hover:text-white sm:visible sm:hidden`}
    >
      {icon}
    </button>
  )
}
