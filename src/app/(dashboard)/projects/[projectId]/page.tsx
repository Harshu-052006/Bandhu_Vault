import { getProject } from "@/lib/actions/project-actions"
import { ensureUser } from "@/lib/actions/user-actions"
import { notFound } from "next/navigation"
import ProjectFeedClient from "./ProjectFeedClient"
import Link from "next/link"
import { ArrowLeft, Lock, Globe } from "lucide-react"
import ProjectVisibilityToggle from "./ProjectVisibilityToggle"

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = await ensureUser()
  const project = await getProject(projectId)

  if (!project) notFound()

  const isLeader = project.leaderId === userId

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 w-full" suppressHydrationWarning>
      <div className="mb-8" suppressHydrationWarning>
        <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-indigo-400 transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          {isLeader ? (
            <ProjectVisibilityToggle projectId={project.id} initialIsPrivate={project.isPrivate} />
          ) : project.isPrivate ? (
            <span className="flex items-center text-xs font-medium bg-neutral-800/80 text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-700/50"><Lock className="h-3.5 w-3.5 mr-1.5"/> Private</span>
          ) : (
            <span className="flex items-center text-xs font-medium bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20"><Globe className="h-3.5 w-3.5 mr-1.5"/> Public</span>
          )}
        </div>
      </div>
      
      <ProjectFeedClient project={project} currentUserId={userId} />
    </div>
  )
}
