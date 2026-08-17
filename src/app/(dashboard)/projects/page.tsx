import { getProjects } from "@/lib/actions/project-actions"
import Link from "next/link"
import { FolderGit2, ArrowRight } from "lucide-react"
import CreateProjectModal from "./CreateProjectModal"
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger"

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage and view updates across all team workspaces.</p>
        </div>
        <CreateProjectModal />
      </div>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <StaggerItem className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-24 text-center">
            <FolderGit2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Create your first project workspace to start sharing updates and media with your team.</p>
          </StaggerItem>
        ) : (
          projects.map((project: any) => (
            <StaggerItem key={project.id}>
              <Link 
                href={`/projects/${project.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-xl hover:shadow-primary/10 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div>
                  <div className="mb-4 inline-flex rounded-lg bg-muted p-2 text-primary ring-1 ring-inset ring-primary/10 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FolderGit2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground transition-colors">{project.name}</h3>
                  {project.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  View Workspace
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </StaggerItem>
          ))
        )}
      </StaggerContainer>
    </div>
  )
}
