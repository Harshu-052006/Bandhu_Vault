import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center flex-1 w-full bg-neutral-50 min-h-screen">
      <SignIn />
    </div>
  )
}
