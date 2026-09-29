'use server'

import prisma from '@/lib/db'
import { ensureUser } from './user-actions'
import nodemailer from 'nodemailer'
import { revalidatePath } from 'next/cache'

async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    console.warn("No SMTP config found. Creating a test account with Ethereal...")
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }
}

export async function inviteMember(projectId: string, formData: FormData) {
  const userId = await ensureUser()
  const email = formData.get('email') as string
  
  if (!email) throw new Error("Email is required")

  const project = await prisma.project.findUnique({ 
    where: { id: projectId },
    include: { members: { where: { userId } } }
  })
  const isLeader = project?.leaderId === userId || (project?.members[0]?.role === 'LEADER')
  if (!isLeader) throw new Error("Only leaders can invite members")

  const inviter = await prisma.user.findUnique({ where: { id: userId } })

  // Check if already a member
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: existingUser.id } }
    })
    if (isMember) throw new Error("User is already a member of this project")
  }

  // Create invitation
  const invite = await prisma.projectInvitation.upsert({
    where: {
      email_projectId: { email, projectId }
    },
    update: {
      status: 'PENDING',
      createdAt: new Date()
    },
    create: {
      email,
      projectId,
      inviterId: userId,
      status: 'PENDING'
    }
  })

  // Send email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const inviteLink = `${appUrl}/invite/${invite.id}`

  const transporter = await getTransporter()
  
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Bandhu Vault" <noreply@bandhuvault.com>',
    to: email,
    subject: `You've been invited to join ${project?.name} on Bandhu Vault`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Invitation</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 0; color: #18181b;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 40px 30px; text-align: center;">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Bandhu Vault Logo" style="width: 64px; height: 64px; margin-bottom: 16px; object-fit: contain;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Bandhu Vault</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #3f3f46;">
                    Hello!
                  </p>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #3f3f46;">
                    You have been invited by <strong style="color: #18181b;">${inviter?.name || inviter?.email}</strong> to collaborate on the project <strong style="color: #18181b;">${project?.name}</strong>.
                  </p>
                  
                  <!-- Call to Action -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${inviteLink}" style="display: inline-block; background-color: #18181b; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                          Accept Invitation
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 20px; color: #71717a;">
                    If you don't have an account yet, you'll be prompted to create one securely before joining the project.
                  </p>
                  <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a;">
                    If you weren't expecting this invitation, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #fafafa; padding: 24px 30px; text-align: center; border-top: 1px solid #e4e4e7;">
                  <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                    &copy; ${new Date().getFullYear()} Bandhu Vault. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  })

  if (info.messageId && !process.env.SMTP_HOST) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  }
  
  revalidatePath(`/projects/${projectId}`)
}

export async function acceptInvitation(inviteId: string) {
  const userId = await ensureUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  const invite = await prisma.projectInvitation.findUnique({
    where: { id: inviteId }
  })

  if (!invite) throw new Error("Invitation not found")
  if (invite.status !== 'PENDING') throw new Error("Invitation is no longer pending")
  
  // Optional: check if the logged in user matches the invite email
  if (user?.email !== invite.email) {
    throw new Error("This invitation was sent to a different email address.")
  }

  // Create member and update invite
  await prisma.$transaction([
    prisma.projectMember.upsert({
      where: {
        projectId_userId: { projectId: invite.projectId, userId }
      },
      update: {},
      create: {
        projectId: invite.projectId,
        userId: userId
      }
    }),
    prisma.projectInvitation.update({
      where: { id: inviteId },
      data: { status: 'ACCEPTED' }
    })
  ])

  return invite.projectId
}
