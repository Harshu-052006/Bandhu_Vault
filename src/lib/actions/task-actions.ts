'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUser } from './user-actions'

export async function createTask(projectId: string, formData: FormData) {
  const userId = await ensureUser()
  
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can create tasks")
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const assigneeId = formData.get('assigneeId') as string
  
  if (!title || !assigneeId) throw new Error("Title and Assignee are required")
  
  await prisma.task.create({
    data: {
      title,
      description,
      assigneeId,
      projectId,
      creatorId: userId
    }
  })
  
  revalidatePath(`/projects/${projectId}`)
}

export async function completeTask(taskId: string, formData: FormData) {
  const userId = await ensureUser()
  
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new Error("Task not found")
  if (task.assigneeId !== userId) throw new Error("Only the assignee can complete this task")
  
  const proofText = formData.get('proofText') as string
  const proofFileUrl = formData.get('proofFileUrl') as string
  
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'COMPLETED',
      proofText,
      proofFileUrl
    }
  })
  
  revalidatePath(`/projects/${task.projectId}`)
}

export async function deleteTask(taskId: string) {
  const userId = await ensureUser()
  
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return
  
  const project = await prisma.project.findUnique({ where: { id: task.projectId } })
  if (project?.leaderId !== userId) throw new Error("Only leader can delete tasks")
  
  await prisma.task.delete({ where: { id: taskId } })
  
  revalidatePath(`/projects/${task.projectId}`)
}
