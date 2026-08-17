import prisma from '@/lib/db'
import { HardDrive, Trash2 } from 'lucide-react'
import { deleteFile } from '@/lib/actions/file-actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const files = await prisma.projectFile.findMany({
    orderBy: { fileSize: 'desc' },
    include: { project: true }
  })

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
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <HardDrive className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Storage Administration</h1>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Total Storage Used</h2>
          <p className="text-sm text-muted-foreground">Across all projects</p>
        </div>
        <div className="text-3xl font-mono font-bold text-primary">
          {gbUsed} <span className="text-lg text-muted-foreground">/ 10 GB</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase">
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
                  <td className="px-6 py-4 font-medium truncate max-w-[300px]" title={file.filename}>
                    {file.filename}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {file.project?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-foreground font-mono">
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
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No files found in the vault.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
