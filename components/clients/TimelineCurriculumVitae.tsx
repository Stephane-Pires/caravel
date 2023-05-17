import { useIsVisible } from "@/components/hooks/useIsVisible"

interface PropsTimelineCurriculumVitae {
  // ANY !!!!!
  refs: Array<any>
}

export function TimelineCurriculumVitae({
  refs,
}: PropsTimelineCurriculumVitae) {
  const isVisibleOne = useIsVisible(refs[0])
  const isVisibleTwo = useIsVisible(refs[1])
  const isVisibleThree = useIsVisible(refs[2])
  const isVisibleFour = useIsVisible(refs[3])
  const isVisibleFive = useIsVisible(refs[4])
  const isVisibleSix = useIsVisible(refs[5])
  const isVisibleSeven = useIsVisible(refs[6])

  // ANY ANOTHER DEMON
  const scrollIntoView = (ref: any) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="fixed top-1/4 flex max-h-[800px] w-40 flex-col items-center overflow-scroll  bg-red-300 ">
      <div className="absolute h-full w-1 bg-slate-50"></div>
      <button
        onClick={() => scrollIntoView(refs[0])}
        className={`${
          isVisibleOne ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        1
      </button>
      <button
        onClick={() => scrollIntoView(refs[1])}
        className={`${
          isVisibleTwo ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        2
      </button>
      <button
        onClick={() => scrollIntoView(refs[2])}
        className={`${
          isVisibleThree ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        3
      </button>
      <button
        onClick={() => scrollIntoView(refs[3])}
        className={`${
          isVisibleFour ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        4
      </button>
      <button
        onClick={() => scrollIntoView(refs[4])}
        className={`${
          isVisibleFive ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        5
      </button>
      <button
        onClick={() => scrollIntoView(refs[5])}
        className={`${
          isVisibleSix ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        6
      </button>
      <button
        onClick={() => scrollIntoView(refs[6])}
        className={`${
          isVisibleSeven ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        7
      </button>
      <button
        onClick={() => scrollIntoView(refs[0])}
        className={`${
          isVisibleThree ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        8
      </button>
      <button
        onClick={() => scrollIntoView(refs[0])}
        className={`${
          isVisibleThree ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        9
      </button>
      <button
        onClick={() => scrollIntoView(refs[0])}
        className={`${
          isVisibleThree ? "bg-red-600" : "bg-red-950"
        }   sticky top-2 m-2 flex h-10 w-10 items-center justify-center rounded-full font-sans hover:bg-green-100`}
      >
        10
      </button>
      <button
        onClick={() => scrollIntoView(refs[0])}
        className={`sticky top-2 m-2 mb-[265xzpx] flex h-10 w-10 items-center justify-center rounded-full bg-red-300 font-sans`}
      >
        11
      </button>
    </div>
  )
}
