import { memo } from "react"

import { FidelitySwitch } from "@/components/FidelitySwitch"

// The cabin's overlay: top bar, hint and close-up caption, keyboard path, wanted scroll, tooltip and loading veil.
// cabin/cabin.js drives it through these ids (it fills the empty containers and toggles `hidden`),
// so this component is memoized: React renders it once and never re-renders over the scene's changes.
export const CabinOverlay = memo(function CabinOverlay() {
  return (
    <>
      <canvas
        id="stage"
        aria-label="Interactive 3D captain's cabin"
        tabIndex={-1}
      />

      <header className="bar">
        <div className="brand">
          <span className="name">Caravel</span>
          <span className="tag">Captain&apos;s log</span>
        </div>
        <FidelitySwitch />
      </header>

      {/* no panel: the objects carry the content. A hint until the first touch, a caption in close-ups */}
      <p
        className="hint"
        id="hint"
      >
        Drag to look around · tap what glows
      </p>

      <div
        className="caption"
        id="focus"
        hidden
        aria-live="polite"
      >
        <button
          type="button"
          className="back"
          id="back"
          aria-label="Back to the cabin"
        >
          ←
        </button>
        <p>
          <strong id="f-title">Close-up</strong> <span id="f-lede" />
          <span
            className="note"
            id="f-note"
          />
        </p>
      </div>

      {/* the keyboard path: the same places as a list, out of sight until it has focus */}
      <nav
        className="keys"
        id="keys"
        aria-label="Cabin objects"
      >
        <div
          id="chips"
          className="chips"
        />
        <div
          id="f-body"
          className="keys-links"
        />
      </nav>

      <div
        className="scroll-wrap"
        id="scroll"
        hidden
        role="dialog"
        aria-modal="true"
        aria-labelledby="scroll-title"
      >
        <div className="scroll">
          <div
            className="rod"
            aria-hidden="true"
          />
          <div
            className="sheet"
            id="sheet"
          >
            <nav
              className="tabs"
              id="scroll-nav"
              aria-label="Sections of the wanted sheet"
            >
              <div
                className="tab-list"
                id="scroll-tabs"
              />
              <button
                type="button"
                className="roll"
                id="scroll-close"
              >
                Roll it up ✕
              </button>
            </nav>
          </div>
          <div
            className="rod"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="tip"
        id="tip"
        hidden
      />

      <div
        className="veil"
        id="veil"
        role="status"
        aria-live="polite"
      >
        {/* plain HTML and CSS, so it sails while three.js is still downloading */}
        <div className="voyage">
          <div className="course">
            <svg
              className="ship"
              viewBox="0 0 64 56"
              aria-hidden="true"
            >
              <path
                className="mast"
                d="M31 6v36"
              />
              <path
                className="sail"
                d="M34 9c10 4 14 13 12 24H34z"
              />
              <path
                className="sail"
                d="M28 13c-8 5-11 12-10 20h10z"
              />
              <path
                className="pennant"
                d="M31 6l9 3-9 3"
              />
              <path
                className="hull"
                d="M4 37h56c-2 8-8 13-17 13H21C12 50 6 45 4 37z"
              />
            </svg>
            <svg
              className="waves"
              viewBox="0 0 240 16"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 8q10-8 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" />
            </svg>
            {/* the stretch already sailed: the same waves, in gold */}
            <div
              className="sailed"
              aria-hidden="true"
            >
              <svg
                className="waves"
                viewBox="0 0 240 16"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 8q10-8 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" />
              </svg>
            </div>
          </div>
          <p id="veil-text">Hoisting the sails…</p>
        </div>
      </div>
    </>
  )
})
