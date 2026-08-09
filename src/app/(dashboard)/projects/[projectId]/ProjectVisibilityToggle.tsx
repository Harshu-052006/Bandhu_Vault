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
          ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 hover:text-white border border-neutral-700/50' 
          : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 border border-indigo-500/20'
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
        isPrivate ? 'bg-gradient-to-r from-neutral-700/50 to-neutral-600/50' : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
      }`} />
    </button>
  )
}
