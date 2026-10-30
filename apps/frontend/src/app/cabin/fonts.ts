import {
  Atkinson_Hyperlegible,
  Merienda,
  Playfair_Display,
} from "next/font/google"
import localFont from "next/font/local"

// The cabin's fonts, self-hosted by next/font. The scene also paints text on canvases
// (chart, poster, scroll, the 七転び八起き plank), so it gets each generated family name too.
const merienda = Merienda({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--cabin-merienda",
})
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--cabin-atkinson",
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--cabin-playfair",
})
// only the six glyphs of 七転び八起き (3 KB), subset from Yuji Syuku, SIL Open Font License (fonts/YujiSyuku-OFL.txt)
const yuji = localFont({
  src: "./fonts/yuji-syuku-cabin.woff2",
  display: "swap",
  variable: "--cabin-yuji",
})

export interface CabinFonts {
  className: string
  families: { merienda: string; atkinson: string; playfair: string; yuji: string }
}

export const cabinFonts: CabinFonts = {
  className: [merienda, atkinson, playfair, yuji].map((f) => f.variable).join(" "),
  families: {
    merienda: merienda.style.fontFamily,
    atkinson: atkinson.style.fontFamily,
    playfair: playfair.style.fontFamily,
    yuji: yuji.style.fontFamily,
  },
}
