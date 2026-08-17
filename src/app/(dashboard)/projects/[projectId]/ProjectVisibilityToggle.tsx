'use client'

import { useState, useTransition } from 'react'
import { Lock, Globe, Loader2 } from 'lucide-react'
import { updateProjectVisibility } from '@/lib/actions/project-actions'

export default function ProjectVisibilityToggle({
  projectId,
  initialIsPrivate
}: {
  projectId: string
  initialIsPrivate: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate)

  const toggleVisibility = () => {
    const newValue = !isPrivate
    setIsPrivate(newValue)
    startTransition(async () => {
      try {
        await updateProjectVisibility(projectId, newValue)
      } catch (e) {
        setIsPrivate(!newValue) // revert on error
        console.error(e)
      }
    })
  }

  return (
    <button
      onClick={toggleVisibility}
      disabled={isPending}
      className={`group relative flex items-center gap-2 overflow-hidden rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
        isPrivate 
          ? 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50' 
          : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border border-primary/20'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPrivate ? (
        <Lock className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
      ) : (
        <Globe className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
      )}
      <span className="relative z-10">{isPrivate ? 'Private Project' : 'Public Project'}</span>
      
      {/* Interactive hover glow */}
      <div className={`absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
        isPrivate ? 'bg-gradient-to-r from-muted to-muted/80' : 'bg-gradient-to-r from-primary/20 to-primary/10'
      }`} />
    </button>
  )
}
