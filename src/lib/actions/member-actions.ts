'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUser } from './user-actions'

export async function addProjectMember(projectId: string, formData: FormData) {
  const userId = await ensureUser()
  const email = formData.get('email') as string
  
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can add members")
    
  const userToAdd = await prisma.user.findFirst({ where: { email } })
  if (!userToAdd) throw new Error("User with this email not found in the system. They must log in at least once.")
  
  // Prevent duplicate additions or adding the leader
  if (userToAdd.id === userId) return;
  
  try {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id
      }
    })
  } catch (e) {
    // Ignore unique constraint errors
  }
  
  revalidatePath(`/projects/${projectId}`)
}

export async function removeProjectMember(projectId: string, memberId: string) {
  const userId = await ensureUser()
  
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can remove members")
    
  try {
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId
        }
      }
    })
  } catch (e) {
    // ignore
  }
  
  revalidatePath(`/projects/${projectId}`)
}
