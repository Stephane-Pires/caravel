// Can this browser draw the cabin smoothly? WebGL 2 on a real GPU: software renderers
// (SwiftShader, llvmpipe…) and GPUs the browser flags as slow get the plain pages instead.
// Shared by /cabin (fallback page) and / (the front door).
export type Support = "checking" | "capable" | "limited"

// ?force=1 enters anyway, ?plain=1 shows the fallback (for testing).
// The answer is cached per query string, so following the fallback's "?force=1" link re-checks.
const cache = new Map<string, Support>()
export function detectSupport(): Support {
  const key = window.location.search
  const known = cache.get(key)
  if (known) return known
  const result = checkSupport(new URLSearchParams(key))
  cache.set(key, result)
  return result
}
function checkSupport(params: URLSearchParams): Support {
  if (params.has("force")) return "capable"
  if (params.has("plain")) return "limited"
  try {
    const gl = document.createElement("canvas").getContext("webgl2")
    if (!gl) return "limited"
    const info = gl.getExtension("WEBGL_debug_renderer_info")
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "",
    )
    const software =
      /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render/i.test(
        renderer,
      )
    const slow = !document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: true })
    return software || slow ? "limited" : "capable"
  } catch {
    return "limited"
  }
}
