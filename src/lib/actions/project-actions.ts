'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  
  return prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createProject(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
    
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  const project = await prisma.project.create({
    data: {
      name,
      description
    }
  })
  
  revalidatePath('/')
}

export async function getProject(projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
        include: {
          files: true,
          comments: {
            orderBy: { createdAt: 'asc' }
          }
        }
      },
      files: {
        where: { updateId: null },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function postUpdate(projectId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const fileIdsStr = formData.get('fileIds') as string
  const fileIds = fileIdsStr ? JSON.parse(fileIdsStr) : []
  
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@clerk.local` } 
  })

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
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const text = formData.get('text') as string
  
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@clerk.local` }
  })

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
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
    
  await prisma.project.update({
    where: { id: projectId },
    data: { description }
  })
  
  revalidatePath(`/projects/${projectId}`)
}
