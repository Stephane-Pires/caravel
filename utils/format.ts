export function formatMissions<T>(missions: readonly T[]): string {
  return missions.map((mission) => "- " + mission).join("\n\n")
}
