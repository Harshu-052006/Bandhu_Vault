'use server'

import prisma from '@/lib/db'
import { ensureUser } from './user-actions'

export async function saveFileMetadata(data: {
  filename: string,
  fileUrl: string,
  r2Key: string,
  mimeType: string,
  fileSize: number,
  projectId: string
}) {
  const userId = await ensureUser()

  const file = await prisma.projectFile.create({
    data: {
      ...data,
      uploaderId: userId,
    }
  })

  return file
}

export async function deleteFile(fileId: string) {
  const userId = await ensureUser()
  
  const file = await prisma.projectFile.findUnique({ where: { id: fileId } })
  if (!file) throw new Error("File not found")
  
  // Basic check: either user is uploader, or user is project leader
  // (In a fuller implementation you'd enforce it strictly, for now we just allow deletion if authorized)
  // We'll let anyone who can view the project delete the file if they are in the project since we haven't strictly limited it, 
  // but let's restrict it to uploader or leader just to be safe.
  const project = await prisma.project.findUnique({ where: { id: file.projectId } })
  if (file.uploaderId !== userId && project?.leaderId !== userId) {
    throw new Error("Unauthorized to delete this file")
  }

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
