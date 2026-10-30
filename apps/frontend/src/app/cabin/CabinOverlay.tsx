import { memo } from "react"

import { FidelitySwitch } from "@/components/FidelitySwitch"

// The cabin's overlay: top bar, panel, wanted scroll, tooltip and loading veil.
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

      <section
        className="panel"
        aria-live="polite"
      >
        <div
          className="view"
          id="overview"
        >
          <h1>Captain&apos;s cabin</h1>
          <p className="mood">
            Sunset through the stern windows. Tap anything in the cabin to walk
            up to it; each object is a page of the site. The lantern switches
            day and night.
          </p>
          <div
            id="chips"
            className="chips"
            role="group"
            aria-label="Objects in the cabin"
          />
          <p className="detail">
            Drag to look around. Tap an object, or one of the labels above, to
            zoom in.
          </p>
        </div>
        <div
          className="view"
          id="focus"
          hidden
        >
          <div className="focus-head">
            <h2 id="f-title">Close-up</h2>
            <button
              type="button"
              className="back"
              id="back"
            >
              ← Back to the cabin
            </button>
          </div>
          <p
            className="lede"
            id="f-lede"
          />
          <div id="f-body" />
          <p
            className="note"
            id="f-note"
          />
        </div>
      </section>

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
