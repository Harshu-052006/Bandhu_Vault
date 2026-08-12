'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUser } from './user-actions'

export async function getProjects() {
  const userId = await ensureUser()
  
  return prisma.project.findMany({
    where: {
      OR: [
        { isPrivate: false },
        { leaderId: userId },
        { members: { some: { userId } } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createProject(formData: FormData) {
  const userId = await ensureUser()
    
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isPrivate = formData.get('isPrivate') === 'true'
  
  const project = await prisma.project.create({
    data: {
      name,
      description,
      isPrivate,
      leaderId: userId,
      members: {
        create: { userId }
      }
    }
  })
  
  revalidatePath('/')
}

export async function getProject(projectId: string) {
  const userId = await ensureUser()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: true } },
      leader: true,
      tasks: {
        include: { assignee: true, creator: true },
        orderBy: { createdAt: 'desc' }
      },
      updates: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          files: true,
          comments: {
            orderBy: { createdAt: 'asc' },
            include: { author: true }
          }
        }
      },
      files: {
        where: { updateId: null },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!project) return null
  
  if (project.isPrivate && project.leaderId !== userId && !project.members.some(m => m.userId === userId)) {
    throw new Error("Unauthorized to access this project")
  }
  
  return project
}

export async function postUpdate(projectId: string, formData: FormData) {
  const userId = await ensureUser()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const fileIdsStr = formData.get('fileIds') as string
  const fileIds = fileIdsStr ? JSON.parse(fileIdsStr) : []
  
  const update = await prisma.projectUpdate.create({
    data: {
      title,
      content,
      projectId,
      authorId: userId,
    }
  })
  
  if (fileIds.length > 0) {
    await prisma.projectFile.updateMany({
      where: { id: { in: fileIds } },
      data: { updateId: update.id }
    })
  }

  revalidatePath(`/projects/${projectId}`)
  return update
}

export async function postComment(updateId: string, formData: FormData) {
  const userId = await ensureUser()

  const text = formData.get('text') as string
  
  await prisma.comment.create({
    data: {
      text,
      updateId,
      authorId: userId
    }
  })

  revalidatePath('/')
}

export async function updateProjectDescription(projectId: string, description: string) {
  const userId = await ensureUser()
    
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can update description")
  
  await prisma.project.update({
    where: { id: projectId },
    data: { description }
  })
  
  revalidatePath(`/projects/${projectId}`)
}

export async function deleteProject(projectId: string) {
  const userId = await ensureUser()

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can delete project")

  const files = await prisma.projectFile.findMany({ where: { projectId } })

  if (files.length > 0) {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
    const { r2 } = await import('@/lib/r2')
    
    for (const file of files) {
      try {
        await r2.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME || '',
          Key: file.r2Key
        }))
      } catch (err) {
        console.error("Failed to delete from R2:", err)
      }
    }
  }

  await prisma.project.delete({
    where: { id: projectId }
  })
  
  revalidatePath('/projects')
}

export async function updateProjectVisibility(projectId: string, isPrivate: boolean) {
  const userId = await ensureUser()
    
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can update visibility")
  
  await prisma.project.update({
    where: { id: projectId },
    data: { isPrivate }
  })
  
  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/`)
}

export async function deleteUpdate(updateId: string) {
  const userId = await ensureUser()

  const update = await prisma.projectUpdate.findUnique({
    where: { id: updateId },
    include: { project: true, files: true }
  })

  if (!update) throw new Error("Update not found")

  if (update.authorId !== userId && update.project.leaderId !== userId) {
    throw new Error("Unauthorized to delete this update")
  }

  if (update.files && update.files.length > 0) {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
    const { r2 } = await import('@/lib/r2')
    
    for (const file of update.files) {
      try {
        await r2.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME || '',
          Key: file.r2Key
        }))
      } catch (err) {
        console.error("Failed to delete from R2:", err)
      }
    }
  }

  await prisma.projectUpdate.delete({
    where: { id: updateId }
  })

  revalidatePath(`/projects/${update.projectId}`)
}
