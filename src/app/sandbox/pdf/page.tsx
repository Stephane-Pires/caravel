"use client"

import { BLANK_PDF, generate } from "@pdfme/generator"
import { Designer, Template, Viewer } from "@pdfme/ui"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// import { Template, BLANK_PDF } from '@pdfme/ui'; <- Template types and BLANK_PDF can also be imported from @pdfme/ui.

const template: Template = {
  basePdf: BLANK_PDF,
  schemas: [
    {
      title: {
        type: "text",
        position: { x: 0, y: 0 },
        width: 100,
        height: 10,
      },
      subtitle: {
        type: "text",
        position: { x: 10, y: 10 },
        width: 100,
        height: 10,
      },
      c: {
        type: "text",
        position: { x: 20, y: 20 },
        width: 10,
        height: 10,
      },
    },
  ],
}

const inputs = [
  { title: "Stéphane Pires", subtitle: "développeur fullstack", c: "c1" },
]

let blob = null

generate({ template, inputs }).then((pdf) => {
  //   console.log(pdf)

  // Browser
  blob = new Blob([pdf.buffer], { type: "application/pdf" })

  // Node.js
  return blob // fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
})

// export const generateMetadata = ({ params }) => {
//   const content = allContents.find(
//     (content) => content._raw.flattenedPath === params.slug
//   )
//   return { title: content.title }
// }

export default function Blog() {
  const [pdfBlob, setPdfBlob] = useState<any>(null)
  const [templateee, setTemplate] = useState<any>(null)

  let designer = useRef<Designer>()

  useEffect(() => {
    // if (pdfBlob === null) {
    //   generate({ template, inputs }).then((pdf) => {
    //     setPdfBlob(new Blob([pdf.buffer], { type: "application/pdf" }))
    //   })
    // }

    const domContainer = document.getElementById("container")!
    // const viewer = new Viewer({ domContainer, template, inputs })
    designer.current = new Designer({ domContainer, template })

    // if (pdfBlob !== null) {
    //   window.open(URL.createObjectURL(pdfBlob))
    // }
  }, [])

  return (
    // <main className="flex min-h-screen flex-col items-center  p-10">
    //   <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl sm:text-6xl ">
    //     <div className="relative h-[150px] w-[150px] ">
    //       <Image src="/logbook/logbook.png" alt="Icon logbook" fill />
    //     </div>
    //   </div>
    // </main>

    <div className="pt-20">
      <div id="container" className="flex max-h-screen" />
      <button
        onClick={() => {
          console.log(designer.current?.getTemplate())

          const template = designer.current?.getTemplate()
          setTemplate(template)
        }}
      >
        SAVE TEMPLATE BUTTON
      </button>

      <textarea value={JSON.stringify(templateee, null, 4)} />
    </div>
  )
}
