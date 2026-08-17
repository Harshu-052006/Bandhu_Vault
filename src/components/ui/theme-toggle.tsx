"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-muted transition-colors relative"
      title="Toggle Theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
