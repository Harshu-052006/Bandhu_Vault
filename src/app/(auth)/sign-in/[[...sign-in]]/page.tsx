import { SignIn } from '@clerk/nextjs'
import { AnimatedGrid } from '@/components/ui/animated-grid'

export default function Page() {
  return (
    <div className="flex justify-center items-center flex-1 w-full min-h-screen relative overflow-hidden">
      <AnimatedGrid />
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  )
}
