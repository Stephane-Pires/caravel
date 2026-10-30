import { memo } from "react"

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
        <button
          type="button"
          className="music"
          id="music"
          aria-pressed="false"
        >
          <span
            className="icon"
            aria-hidden="true"
          >
            ♪
          </span>
          <span id="music-label">Play music</span>
        </button>
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
      >
        <p>Hoisting the sails…</p>
      </div>
    </>
  )
})
