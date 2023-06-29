import { generate } from "@pdfme/generator"

// export an async GET function. This is a convention in NextJS
export async function GET(req: Request) {
  // external file URL
  const CURRICULUM_RESOURCES_URL = `${process.env.HOST}/api/resources/curriculum`

  // TODO : Response is not typed
  const response = await fetch(CURRICULUM_RESOURCES_URL)
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
    },
  })
}
