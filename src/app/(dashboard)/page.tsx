import { getProjects, createProject } from "@/lib/actions/project-actions"
import Link from "next/link"
import { FolderGit2, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
          <p className="text-neutral-400">Manage and view updates across all team workspaces.</p>
        </div>
        <form action={createProject} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            name="name" 
            placeholder="New project name..." 
            required
            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all"
          />
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0">
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-24 text-center">
            <FolderGit2 className="h-12 w-12 text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-200">No projects yet</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">Create your first project workspace to start sharing updates and media with your team.</p>
          </div>
        ) : (
          projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all hover:border-indigo-500/50 hover:bg-neutral-800/60 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div>
                <div className="mb-4 inline-flex rounded-lg bg-neutral-800 p-2 text-indigo-400 ring-1 ring-inset ring-white/10 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                  <FolderGit2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-100 group-hover:text-white transition-colors">{project.name}</h3>
                {project.description && (
                  <p className="mt-2 text-sm text-neutral-400 line-clamp-2">{project.description}</p>
                )}
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
                View Workspace
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
