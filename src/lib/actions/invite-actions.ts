'use server'

import prisma from '@/lib/db'
import { ensureUser } from './user-actions'
import nodemailer from 'nodemailer'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const isGmail = process.env.SMTP_HOST.includes('gmail')
    const port = Number(process.env.SMTP_PORT) || 587
    const secure = process.env.SMTP_SECURE === 'true' || port === 465

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
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

/**
 * Ensures a valid RFC 5322 From address format like:
 * "Bandhu Vault" <noreply@bandhuvault.com>
 * Prevents spam filter penalties caused by malformed/unbracketed From headers.
 */
function getFromAddress(): string {
  const rawFrom = (process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@bandhuvault.com').trim()

  // Format: "Name" <email@domain.com> or Name <email@domain.com>
  if (rawFrom.includes('<') && rawFrom.includes('>')) {
    return rawFrom
  }

  // Format without brackets: Name email@domain.com
  const match = rawFrom.match(/^(.*?)\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)
  if (match) {
    const name = match[1].replace(/["']/g, '').trim() || 'Bandhu Vault'
    const email = match[2].trim()
    return `"${name}" <${email}>`
  }

  // Just an email: user@domain.com
  if (rawFrom.includes('@')) {
    return `"Bandhu Vault" <${rawFrom}>`
  }

  return `"Bandhu Vault" <${process.env.SMTP_USER || 'noreply@bandhuvault.com'}>`
}

/**
 * Resolves the public application base URL.
 * Checks request headers first so that deployed environments (Vercel, custom domains)
 * automatically generate links matching the actual domain rather than hardcoded localhost.
 */
async function getBaseAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL

  try {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host')
    const proto = headerStore.get('x-forwarded-proto') || (host && !host.includes('localhost') ? 'https' : 'http')

    if (host) {
      // If NEXT_PUBLIC_APP_URL is explicitly configured to a real domain, use it; otherwise use incoming host
      if (envUrl && !envUrl.includes('localhost')) {
        return envUrl.replace(/\/+$/, '')
      }
      return `${proto}://${host}`.replace(/\/+$/, '')
    }
  } catch {
    // Fall back to env or localhost when headers() cannot be accessed
  }

  return (envUrl || 'http://localhost:3000').replace(/\/+$/, '')
}

/**
 * Helper to build high-deliverability email content (multipart HTML + Plain text)
 */
function buildInviteEmail({
  projectName,
  inviterName,
  inviteLink,
}: {
  projectName: string
  inviterName: string
  inviteLink: string
}) {
  const subject = `You've been invited to join ${projectName} on Bandhu Vault`

  const text = [
    `Hello!`,
    ``,
    `You have been invited by ${inviterName} to collaborate on the project "${projectName}" on Bandhu Vault.`,
    ``,
    `To accept this invitation and access the project, click the link below or paste it into your browser:`,
    `${inviteLink}`,
    ``,
    `If you don't have an account yet, you'll be prompted to create one securely before joining.`,
    `If you weren't expecting this invitation, you can safely ignore this email.`,
    ``,
    `— The Bandhu Vault Team`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Project Invitation - Bandhu Vault</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 32px 16px; color: #18181b; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; max-width: 580px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 36px 32px; text-align: center;">
              <!-- Self-contained SVG Icon to prevent external image tracker flags in spam filters -->
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: rgba(255, 255, 255, 0.12); margin-bottom: 12px; text-align: center;">
                <span style="font-size: 24px; color: #ffffff;">🔒</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">Bandhu Vault</h1>
              <p style="color: #a1a1aa; margin: 6px 0 0 0; font-size: 13px;">Secure Team Collaboration</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #18181b;">
                You've received an invitation
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #3f3f46;">
                <strong style="color: #18181b;">${inviterName}</strong> has invited you to collaborate on the project <strong style="color: #18181b;">${projectName}</strong> on Bandhu Vault.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" style="display: inline-block; background-color: #18181b; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Accept Invitation &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct Link -->
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 14px 16px; margin: 24px 0; word-break: break-all;">
                <p style="margin: 0 0 6px; font-size: 12px; color: #71717a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Or copy and paste this link:</p>
                <a href="${inviteLink}" style="font-size: 13px; color: #2563eb; text-decoration: underline;">${inviteLink}</a>
              </div>

              <p style="margin: 0 0 12px; font-size: 13px; line-height: 20px; color: #71717a;">
                If you don't have an account yet, you'll be prompted to sign up securely before accessing the project.
              </p>
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                If you were not expecting this invitation, you can safely disregard this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 20px 32px; text-align: center; border-top: 1px solid #f4f4f5;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                &copy; ${new Date().getFullYear()} Bandhu Vault. Sent via Bandhu Vault notifications.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, text, html }
}

export async function inviteMember(projectId: string, formData: FormData) {
  const userId = await ensureUser()
  const rawEmail = formData.get('email') as string
  const email = rawEmail?.trim().toLowerCase()
  
  if (!email || !email.includes('@')) {
    throw new Error("A valid email address is required")
  }

  const project = await prisma.project.findUnique({ 
    where: { id: projectId },
    include: { members: { where: { userId } } }
  })
  
  if (!project) throw new Error("Project not found")

  const isLeader = project.leaderId === userId || (project.members[0]?.role === 'LEADER')
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

  // Create or refresh invitation
  const invite = await prisma.projectInvitation.upsert({
    where: {
      email_projectId: { email, projectId }
    },
    update: {
      status: 'PENDING',
      createdAt: new Date(),
      inviterId: userId
    },
    create: {
      email,
      projectId,
      inviterId: userId,
      status: 'PENDING'
    }
  })

  // Build full invite URL
  const appUrl = await getBaseAppUrl()
  const inviteLink = `${appUrl}/invite/${invite.id}`

  // Build email content with both text and HTML for spam avoidance
  const { subject, text, html } = buildInviteEmail({
    projectName: project.name,
    inviterName: inviter?.name || inviter?.email || 'A team leader',
    inviteLink,
  })

  let emailSent = false
  let emailError: string | null = null

  try {
    const transporter = await getTransporter()
    const fromAddress = getFromAddress()

    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: process.env.SMTP_USER || undefined,
      to: email,
      subject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': invite.id,
      }
    })

    emailSent = true

    if (info.messageId && !process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }
  } catch (err: any) {
    console.error("Failed to send invitation email:", err)
    emailError = err.message || "Failed to deliver email"
  }
  
  revalidatePath(`/projects/${projectId}`)

  return {
    success: true,
    inviteId: invite.id,
    inviteLink,
    emailSent,
    emailError
  }
}

export async function resendInvitation(projectId: string, inviteId: string) {
  const userId = await ensureUser()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { where: { userId } } }
  })
  if (!project) throw new Error("Project not found")

  const isLeader = project.leaderId === userId || (project.members[0]?.role === 'LEADER')
  if (!isLeader) throw new Error("Only leaders can resend invitations")

  const invite = await prisma.projectInvitation.findUnique({
    where: { id: inviteId },
    include: { project: true }
  })
  if (!invite) throw new Error("Invitation not found")
  if (invite.status !== 'PENDING') throw new Error("Invitation is no longer pending")

  const inviter = await prisma.user.findUnique({ where: { id: userId } })
  const appUrl = await getBaseAppUrl()
  const inviteLink = `${appUrl}/invite/${invite.id}`

  const { subject, text, html } = buildInviteEmail({
    projectName: project.name,
    inviterName: inviter?.name || inviter?.email || 'A team leader',
    inviteLink,
  })

  let emailSent = false
  let emailError: string | null = null

  try {
    const transporter = await getTransporter()
    const fromAddress = getFromAddress()

    await transporter.sendMail({
      from: fromAddress,
      replyTo: process.env.SMTP_USER || undefined,
      to: invite.email,
      subject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': invite.id,
      }
    })
    emailSent = true

    // Update timestamp
    await prisma.projectInvitation.update({
      where: { id: inviteId },
      data: { createdAt: new Date() }
    })
  } catch (err: any) {
    console.error("Failed to resend invitation email:", err)
    emailError = err.message || "Failed to deliver email"
  }

  revalidatePath(`/projects/${projectId}`)

  return {
    success: true,
    inviteId: invite.id,
    inviteLink,
    emailSent,
    emailError
  }
}

export async function cancelInvitation(projectId: string, inviteId: string) {
  const userId = await ensureUser()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { where: { userId } } }
  })
  if (!project) throw new Error("Project not found")

  const isLeader = project.leaderId === userId || (project.members[0]?.role === 'LEADER')
  if (!isLeader) throw new Error("Only leaders can cancel invitations")

  await prisma.projectInvitation.delete({
    where: { id: inviteId }
  })

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function acceptInvitation(inviteId: string) {
  const userId = await ensureUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  const invite = await prisma.projectInvitation.findUnique({
    where: { id: inviteId }
  })

  if (!invite) throw new Error("Invitation not found")
  if (invite.status !== 'PENDING') throw new Error("Invitation is no longer pending")
  
  // Case-insensitive email check
  if (user?.email && invite.email && user.email.trim().toLowerCase() !== invite.email.trim().toLowerCase()) {
    throw new Error(`This invitation was sent to ${invite.email}, but you are logged in as ${user.email}.`)
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
