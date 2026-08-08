import { getProject } from "@/lib/actions/project-actions"
import { ensureUser } from "@/lib/actions/user-actions"
import { notFound } from "next/navigation"
import ProjectFeedClient from "./ProjectFeedClient"
import Link from "next/link"
import { ArrowLeft, Lock, Globe } from "lucide-react"

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = await ensureUser()
  const project = await getProject(projectId)

  if (!project) notFound()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-indigo-400 transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          {project.isPrivate ? (
            <span className="flex items-center text-xs font-medium bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md"><Lock className="h-3 w-3 mr-1"/> Private</span>
          ) : (
            <span className="flex items-center text-xs font-medium bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md"><Globe className="h-3 w-3 mr-1"/> Public</span>
          )}
        </div>
      </div>
      
      <ProjectFeedClient project={project} currentUserId={userId} />
    </div>
  )
}
