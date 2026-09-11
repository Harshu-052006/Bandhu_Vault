import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/cinematic(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/webhook(.*)', '/manifest.webmanifest'])

const isCinematicRoute = createRouteMatcher(['/cinematic(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Short-circuit: no Clerk auth work on the public cinematic marketing route
  if (isCinematicRoute(request)) {
    return NextResponse.next()
  }

  const { userId } = await auth()

  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
