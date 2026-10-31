import { LOCAL_SUPPORTED, getCurriculumPDFFilename } from "@/utils/local"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const CACHE_WEEK = 604800

export async function GET(req: NextRequest) {
  // English unless French is asked for: an unknown value must not crash the download
  const language: LOCAL_SUPPORTED =
    req.nextUrl.searchParams.get("language") === LOCAL_SUPPORTED.FRENCH
      ? LOCAL_SUPPORTED.FRENCH
      : LOCAL_SUPPORTED.ENGLISH

  const pdfPath = path.resolve(
    "./public/about-me",
    getCurriculumPDFFilename(language),
  )
  const pdfFile = fs.readFileSync(pdfPath)

  return new NextResponse(await pdfFile, {
    headers: {
      "Cache-control": `public, max-age=${CACHE_WEEK}`,
      // a real file name, with its extension: browsers save exactly this
      "Content-Disposition": `attachment; filename="cv-stephane-pires-${language}.pdf"`,
      "Content-Type": "application/pdf",
    },
  })
}
