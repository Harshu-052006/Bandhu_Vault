import { currentUser, auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function ensureUser() {
  const user = await currentUser()
  if (!user) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }
  
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const email = user.emailAddresses[0]?.emailAddress || `${user.id}@clerk.local`
  
  await prisma.user.upsert({
    where: { id: user.id },
    update: { name, email },
    create: { id: user.id, name, email }
  })
  
  return user.id
}
