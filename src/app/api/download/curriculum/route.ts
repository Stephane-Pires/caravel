import { generate } from "@pdfme/generator"
import { NextRequest } from "next/server"

// export an async GET function. This is a convention in NextJS
export async function GET(req: NextRequest) {
  // external file URL

  const language = req.nextUrl.searchParams.get("language")

  const CURRICULUM_RESOURCES_URL = `${process.env.HOST}/api/resources/curriculum?language=${language}`

  // TODO : Response is not typed
  const response = await fetch(CURRICULUM_RESOURCES_URL, {
    cache: "no-cache",
  })
    .then((res) => res.json())
    .catch((error) => console.log("error handle it properly : ", error))

  const maybePdf = new Promise<Uint8Array>((resolve, reject) => {
    generate({ template: response, inputs: response.sampledata })
      .then((pdf) => resolve(pdf))
      .catch((error) => reject(error))
  })

  return new Response(await maybePdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "filename=cv-stephane-pires",
      "Cache-control": "no-cache",
    },
  })
}
