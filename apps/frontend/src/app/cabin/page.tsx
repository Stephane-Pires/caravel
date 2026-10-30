import type { Metadata } from "next"

import { CabinClient } from "./CabinClient"

export const metadata: Metadata = {
  title: "Cabin",
  description: "The captain's cabin: an interactive 3D version of Caravel",
}

export default function Cabin() {
  return <CabinClient />
}
