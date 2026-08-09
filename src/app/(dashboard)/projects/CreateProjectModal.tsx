'use client'

import { useState, useTransition } from 'react'
import { Plus, X, Lock, Globe, Loader2, Sparkles } from 'lucide-react'
import { createProject } from '@/lib/actions/project-actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isPrivate, setIsPrivate] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('isPrivate', isPrivate.toString())
    
    startTransition(async () => {
      try {
        await createProject(formData)
        setIsOpen(false)
        router.refresh()
      } catch (error) {
        console.error("Failed to create project:", error)
      }
    })
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-0 rounded-xl px-6 h-11 transition-all hover:scale-105 active:scale-95 group"
      >
        <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" /> New Workspace
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => !isPending && setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                    Create Workspace
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">Set up a new space for your team to collaborate.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-300 ml-1">Project Name <span className="text-red-400">*</span></label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Design System v2"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-neutral-300 ml-1">Description <span className="text-neutral-600">(Optional)</span></label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Briefly describe what this project is about..."
                    className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                  />
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4 transition-colors hover:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${isPrivate ? 'bg-neutral-800 text-neutral-300' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-200">{isPrivate ? 'Private Workspace' : 'Public Workspace'}</span>
                        <span className="text-xs text-neutral-500 mt-0.5">{isPrivate ? 'Only invited members can access' : 'Anyone in the team can view and join'}</span>
                      </div>
                    </div>
                    
                    {/* Modern Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPrivate}
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
                        isPrivate ? 'bg-neutral-600' : 'bg-indigo-600'
                      }`}
                    >
                      <span className="sr-only">Toggle privacy</span>
                      <span 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isPrivate ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/50 mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl px-5 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 h-11 shadow-lg shadow-indigo-500/20"
                  >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {isPending ? 'Creating...' : 'Create Workspace'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
