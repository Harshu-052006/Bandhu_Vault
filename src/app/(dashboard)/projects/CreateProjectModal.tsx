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
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border-0 rounded-xl px-6 h-11 transition-all hover:scale-105 active:scale-95 group"
      >
        <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" /> New Workspace
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => !isPending && setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Create Workspace
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Set up a new space for your team to collaborate.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">Project Name <span className="text-destructive">*</span></label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Design System v2"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-foreground ml-1">Description <span className="text-muted-foreground">(Optional)</span></label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Briefly describe what this project is about..."
                    className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-inner"
                  />
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${isPrivate ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{isPrivate ? 'Private Workspace' : 'Public Workspace'}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{isPrivate ? 'Only invited members can access' : 'Anyone in the team can view and join'}</span>
                      </div>
                    </div>
                    
                    {/* Modern Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPrivate}
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isPrivate ? 'bg-muted-foreground' : 'bg-primary'
                      }`}
                    >
                      <span className="sr-only">Toggle privacy</span>
                      <span 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                          isPrivate ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-5 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-11 shadow-lg shadow-primary/20"
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
