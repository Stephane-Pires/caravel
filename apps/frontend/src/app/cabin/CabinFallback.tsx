import Link from "next/link"

// one object for the module: enter the cabin even on a limited device
const ENTER_ANYWAY = { pathname: "/cabin", query: { force: "1" } } as const

// Shown when the browser can't draw the cabin smoothly (no WebGL 2, or graphics drawn without a GPU)
export function CabinFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-10 pt-28 text-center">
      <h1 className="font-serif text-4xl text-amber-300 sm:text-5xl">
        The captain&apos;s cabin
      </h1>
      <p className="max-w-prose text-slate-300">
        The cabin is a 3D scene, and this browser is drawing graphics without
        a graphics card, so it would run slowly. Everything in it is also on
        the regular pages.
      </p>
      <nav
        aria-label="Caravel pages"
        className="flex flex-wrap justify-center gap-3"
      >
        <Link
          href="/projects"
          className="rounded-lg border-2 border-amber-300 px-4 py-2 font-bold text-amber-300 hover:bg-amber-300 hover:text-slate-900"
        >
          Projects
        </Link>
        <Link
          href="/about-me"
          className="rounded-lg border-2 border-amber-300 px-4 py-2 font-bold text-amber-300 hover:bg-amber-300 hover:text-slate-900"
        >
          About me
        </Link>
      </nav>
      <Link
        href={ENTER_ANYWAY}
        className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
      >
        Enter the cabin anyway
      </Link>
    </main>
  )
}
