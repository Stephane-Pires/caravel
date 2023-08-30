"use client"

import { Designer } from "@pdfme/ui"
import { useEffect, useRef, useState } from "react"

export default function PdfManipulator() {
  const [template, setTemplate] = useState<any>(null)

  const CURRICULUM_RESOURCES_URL = "/api/resources/curriculum?language=english"

  let designer = useRef<Designer>()

  useEffect(() => {
    fetch(CURRICULUM_RESOURCES_URL)
      .then((res) => {
        res
          .json()
          .then((template) => {
            const domContainer = document.getElementById("container")!
            designer.current = new Designer({ domContainer, template })
          })
          .catch((error) =>
            console.log("error while parsing the template json : ", error)
          )
      })
      .catch((error) => console.log("error handle it properly : ", error))
  }, [])

  return (
    <div className="flex flex-col pt-20">
      <div
        id="container"
        className="flex max-h-screen basis-2/12"
      />
      <div className="flex flex-row items-center justify-around">
        <button
          className="m-2 h-full bg-blue-800  p-2"
          onClick={() => {
            console.log(designer.current?.getTemplate())

            const template = designer.current?.getTemplate()
            setTemplate(template)
          }}
        >
          Save
        </button>

        <textarea
          className="h-96 w-96"
          value={JSON.stringify(template, null, 4)}
        />
      </div>
    </div>
  )
}
