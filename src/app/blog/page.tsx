import { Card } from "@/components/Card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <Card
        title="Ship leaving the coast"
        image="boat-living-coast.jpeg"
        date="Mon 12 Dec 2003"
        subject="MOVIE"
        type="INSPIRATION"
      />
      <Card
        title="sandbox_title"
        image="boat-living-coast.jpeg"
        date="sandbox_12_03_20"
        subject="MOVIE"
        type="INSPIRATION"
      />
      <Card
        title="sandbox_title"
        image="boat-living-coast.jpeg"
        date="sandbox_12_03_20"
        subject="MOVIE"
        type="INSPIRATION"
      />
    </main>
  )
}
