import prisma from '@/lib/db'
import { ensureUser } from '@/lib/actions/user-actions'
import { redirect } from 'next/navigation'
import { acceptInvitation } from '@/lib/actions/invite-actions'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AcceptInvitePage({ params }: { params: { inviteId: string } }) {
  const userId = await ensureUser() // Forces login
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  const invite = await prisma.projectInvitation.findUnique({
    where: { id: params.inviteId },
    include: { project: true, inviter: true }
  })

  if (!invite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Invitation Not Found</h1>
        <p className="text-muted-foreground">This invitation link is invalid or has expired.</p>
        <Link href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium mt-4">Go Home</Link>
      </div>
    )
  }

  if (invite.status !== 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <CheckCircle className="h-16 w-16 text-primary" />
        <h1 className="text-2xl font-bold">Already Processed</h1>
        <p className="text-muted-foreground">This invitation has already been accepted or declined.</p>
        <Link href={`/projects/${invite.projectId}`} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium mt-4">View Project</Link>
      </div>
    )
  }

  if (user?.email !== invite.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Email Mismatch</h1>
        <p className="text-muted-foreground">This invitation was sent to <strong>{invite.email}</strong>, but you are logged in as <strong>{user?.email}</strong>.</p>
        <p className="text-sm text-muted-foreground">Please log in with the correct account.</p>
      </div>
    )
  }

  async function handleAccept() {
    'use server'
    const projectId = await acceptInvitation(params.inviteId)
    redirect(`/projects/${projectId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-6">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Project Invitation</h1>
        <p className="text-muted-foreground">
          <strong>{invite.inviter?.name || invite.inviter?.email}</strong> has invited you to collaborate on the project <strong>{invite.project?.name}</strong>.
        </p>

        <form action={handleAccept}>
          <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            Accept Invitation
          </button>
        </form>
      </div>
    </div>
  )
}
