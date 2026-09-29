import prisma from '@/lib/db'
import { ensureUser } from '@/lib/actions/user-actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HardDrive, Trash2, Shield, Users, FolderOpen } from 'lucide-react'
import { deleteFile } from '@/lib/actions/file-actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const userId = await ensureUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (!user?.isAdmin) {
    redirect('/')
  }

  const [files, projects, users] = await Promise.all([
    prisma.projectFile.findMany({
      orderBy: { fileSize: 'desc' },
      include: { project: true }
    }),
    prisma.project.findMany({
      include: { leader: true, _count: { select: { members: true, tasks: true, updates: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ])

  const totalBytes = files.reduce((acc, file) => acc + file.fileSize, 0)
  const gbUsed = (totalBytes / (1024 * 1024 * 1024)).toFixed(3)

  async function handleDelete(formData: FormData) {
    'use server'
    const id = formData.get('fileId') as string
    if (id) {
      await deleteFile(id)
      revalidatePath('/admin')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><FolderOpen className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold text-foreground">{projects.length}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><HardDrive className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
            <p className="text-2xl font-bold text-foreground">{gbUsed} GB</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">All Projects</h2>
        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Leader</th>
                  <th className="px-6 py-3 font-medium">Visibility</th>
                  <th className="px-6 py-3 font-medium">Members</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{project.name}</td>
                    <td className="px-6 py-4">{project.leader?.name || project.leader?.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.isPrivate ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {project.isPrivate ? 'Private' : 'Public'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{project._count.members + 1}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/projects/${project.id}`} className="text-primary hover:underline font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">All Users</h2>
        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{u.email}</td>
                    <td className="px-6 py-4">{u.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isAdmin ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Storage Administration</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">File Name</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Size</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium truncate max-w-[300px] text-foreground" title={file.filename}>
                      {file.filename}
                    </td>
                    <td className="px-6 py-4">
                      {file.project?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={handleDelete}>
                        <input type="hidden" name="fileId" value={file.id} />
                        <button
                          type="submit"
                          className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-colors inline-flex items-center"
                          title="Delete File"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      No files found in the vault.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
