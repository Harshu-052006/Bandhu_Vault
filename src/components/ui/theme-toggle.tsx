"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

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
      <div className="flex items-center p-1 rounded-full border border-border bg-surface/50 w-[100px] h-[38px]" />
    )
  }

  const themes = [
    { id: "light", icon: Sun },
    { id: "system", icon: Monitor },
    { id: "dark", icon: Moon },
  ]

  return (
    <div className="flex items-center p-1 rounded-full border border-border bg-surface/80 backdrop-blur-md relative shadow-inner">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`relative flex h-7 w-8 items-center justify-center rounded-full text-xs transition-colors z-10 ${
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            title={`Theme: ${t.id}`}
          >
            {isActive && (
              <motion.div
                layoutId="themeToggleIndicator"
                className="absolute inset-0 bg-primary rounded-full shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}
