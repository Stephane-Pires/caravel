"use client"

import { useTheme } from "next-themes"
import { useMemo } from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  const style = useMemo(
    () =>
      ({
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }) as React.CSSProperties,
    [],
  )

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={style}
      {...props}
    />
  )
}

export { Toaster }
