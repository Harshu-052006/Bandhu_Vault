import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center flex-1 w-full min-h-screen bg-transparent relative overflow-hidden">
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  )
}
