// The visitor's choice between the classic site (lo-fi) and the 3D cabin (hi-fi), kept in this
// browser so the front door (/) never sends back to the cabin someone who just left it.
export type Fidelity = "lo-fi" | "hi-fi"

const KEY = "caravel:fidelity"

export function getFidelity(): Fidelity | null {
  try {
    const value = window.localStorage.getItem(KEY)
    return value === "lo-fi" || value === "hi-fi" ? value : null
  } catch {
    return null // storage blocked (private mode…): behave as a first visit
  }
}

export function setFidelity(fidelity: Fidelity) {
  try {
    window.localStorage.setItem(KEY, fidelity)
  } catch {
    // nothing to remember it in: the switch still works for this visit
  }
}
