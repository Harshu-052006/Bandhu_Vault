import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Layers } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30 w-full">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">Bandhu Vault</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-neutral-800" } }} />
          </div>
        </div>
      </header>
      <main className="flex-1 flex w-full">
        {children}
      </main>
    </div>
  )
}
