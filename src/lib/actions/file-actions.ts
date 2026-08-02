'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function saveFileMetadata(data: {
  filename: string,
  fileUrl: string,
  r2Key: string,
  mimeType: string,
  fileSize: number,
  projectId: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@clerk.local` }
  })

  const file = await prisma.projectFile.create({
    data: {
      ...data,
      uploaderId: userId,
    }
  })

  return file
}
