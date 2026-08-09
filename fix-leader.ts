import 'dotenv/config'
import prisma from './src/lib/db'

async function fixLeader() {
  const targetProject = await prisma.project.findFirst({
    where: { name: 'SASUFR' },
    orderBy: { createdAt: 'desc' }
  })

  if (!targetProject) {
    console.log("Error: Project SASUFR not found")
    return
  }
  
  const newestProject = await prisma.project.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  
  if (!newestProject || !newestProject.leaderId) {
    console.log("Error: Could not find the newly created project or its leader.")
    return
  }

  const newUserId = newestProject.leaderId

  if (newUserId === targetProject.leaderId) {
    console.log("The current leader of SASUFR is already the same as the newly created project.")
    return
  }

  await prisma.project.update({
    where: { id: targetProject.id },
    data: { leaderId: newUserId }
  })
  
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: targetProject.id,
        userId: newUserId
      }
    },
    update: {},
    create: {
      projectId: targetProject.id,
      userId: newUserId
    }
  })

  console.log(`Successfully updated leader of project ${targetProject.name} to the current user (ID: ${newUserId}). You should now see the project.`)
}

fixLeader().catch(console.error).finally(() => prisma.$disconnect())
