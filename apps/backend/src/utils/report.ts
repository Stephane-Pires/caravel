// Where handled failures go (Google down, a refused query…): the console by default,
// Sentry once the Next.js app plugs it in. They don't crash the request, so nothing else would see them.
type Reporter = (error: unknown, context?: string) => void

let reporter: Reporter = (error, context) =>
  context ? console.error(context, error) : console.error(error)

export function setErrorReporter(next: Reporter) {
  reporter = next
}

export function reportError(error: unknown, context?: string) {
  reporter(error, context)
}
