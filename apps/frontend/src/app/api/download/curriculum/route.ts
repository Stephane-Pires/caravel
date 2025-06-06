import { LOCAL_SUPPORTED, getCurriculumPDFFilename } from "@/utils/local"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const CACHE_WEEK = 604800

export async function GET(req: NextRequest) {
  // should be checked by zod via a controller.
  const language: LOCAL_SUPPORTED = req.nextUrl.searchParams.get(
    "language",
  ) as LOCAL_SUPPORTED

  const pdfPath = path.resolve(
    "./public/about-me",
    getCurriculumPDFFilename(language),
  )
  const pdfFile = fs.readFileSync(pdfPath)

  return new NextResponse(await pdfFile, {
    headers: {
      "Cache-control": `public, max-age=${CACHE_WEEK}`,
      "Content-Disposition": "filename=cv-stephane-pires",
      "Content-Type": "application/pdf",
    },
  })
}
