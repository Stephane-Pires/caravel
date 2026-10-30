// The cabin's overlay DOM (top bar, panel, wanted scroll, tooltip), driven by cabin/cabin.js through element ids
export const CABIN_MARKUP = `
<link id="gf-jp" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&text=%E4%B8%83%E8%BB%A2%E3%81%B3%E5%85%AB%E8%B5%B7%E3%81%8D&display=swap">
<link id="gf" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Merienda:wght@400;700&family=Playfair+Display:wght@700;900&display=swap">
<canvas id="stage" aria-label="Interactive 3D captain's cabin" tabindex="-1"></canvas>

<header class="bar">
  <div class="brand"><span class="name">Caravel</span><span class="tag">Cabin prototype · v8</span></div>
  <button type="button" class="music" id="music" aria-pressed="false"><span class="icon" aria-hidden="true">♪</span><span id="music-label">Play music</span></button>
</header>

<section class="panel" aria-live="polite">
  <div class="view" id="overview">
    <h1>Captain's cabin</h1>
    <p class="mood">Sunset through the stern windows. Tap anything in the cabin to walk up to it; each object is a page of the site. The lantern switches day and night.</p>
    <div id="chips" class="chips" role="group" aria-label="Objects in the cabin"></div>
    <p class="detail">Drag to look around. Tap an object, or one of the labels above, to zoom in.</p>
  </div>
  <div class="view" id="focus" hidden>
    <div class="focus-head">
      <h2 id="f-title"></h2>
      <button type="button" class="back" id="back">← Back to the cabin</button>
    </div>
    <p class="lede" id="f-lede"></p>
    <div id="f-body"></div>
    <p class="note" id="f-note"></p>
  </div>
</section>

<div class="scroll-wrap" id="scroll" hidden role="dialog" aria-modal="true" aria-labelledby="scroll-title">
  <div class="scroll">
    <div class="rod" aria-hidden="true"></div>
    <div class="sheet" id="sheet">
      <nav class="tabs" id="scroll-nav" aria-label="Sections of the wanted sheet">
        <div class="tab-list" id="scroll-tabs"></div>
        <button type="button" class="roll" id="scroll-close">Roll it up ✕</button>
      </nav>
    </div>
    <div class="rod" aria-hidden="true"></div>
  </div>
</div>

<div class="tip" id="tip" hidden></div>

<div class="veil" id="veil"><p>Hoisting the sails…</p></div>
`
