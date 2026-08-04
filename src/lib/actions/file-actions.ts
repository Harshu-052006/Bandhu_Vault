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
export async function deleteFile(fileId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  
  const file = await prisma.projectFile.findUnique({ where: { id: fileId } })
  if (!file) throw new Error("File not found")

  // Using dynamic import so aws-sdk doesn't bloat client components if accidentally imported
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
  const { r2 } = await import('@/lib/r2')

  try {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || '',
      Key: file.r2Key
    }))
  } catch (err) {
    console.error("Failed to delete from R2:", err)
    // Still proceed to delete from DB to prevent hanging records if R2 is out of sync
  }

  await prisma.projectFile.delete({
    where: { id: fileId }
  })
}
