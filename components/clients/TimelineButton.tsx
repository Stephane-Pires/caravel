import { useIsVisible } from "@/components/hooks/useIsVisible"

interface PropsTimelineButton {
  label: string
  domElementReferenced: HTMLDivElement
}

export function TimelineButton({
  domElementReferenced,
  label,
}: PropsTimelineButton) {
  const isVisible = useIsVisible(domElementReferenced)

  const scrollIntoView = (domElement: HTMLDivElement) => {
    domElement.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <button
      onClick={() => scrollIntoView(domElementReferenced)}
      className={`${
        isVisible ? "bg-accent-500/80 text-blue-900" : "bg-blue-950"
      } 
    
      sticky top-2 m-2 flex w-full items-center justify-center rounded-2xl border-2 border-blue-950 px-4 py-2 font-sans font-bold hover:bg-blue-800 hover:text-white`}
    >
      {label}
    </button>
  )
}
