import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Layers, Database } from "lucide-react"
import prisma from "@/lib/db"

async function StorageAlert() {
  const result = await prisma.projectFile.aggregate({
    _sum: { fileSize: true }
  });
  const totalBytes = result._sum.fileSize || 0;
  const gbUsed = totalBytes / (1024 * 1024 * 1024);
  const maxGb = 10;
  const percentage = (gbUsed / maxGb) * 100;

  if (percentage < 80) return null;

  return (
    <div className={`w-full text-center py-2 px-4 text-sm font-medium ${percentage >= 90 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
      ⚠️ Storage Alert: You have used {gbUsed.toFixed(2)}GB ({percentage.toFixed(1)}%) of your {maxGb}GB limit.
      <Link href="/admin" className="ml-2 underline hover:text-foreground transition-colors">Manage Storage</Link>
    </div>
  )
}

async function StorageIndicator() {
  const result = await prisma.projectFile.aggregate({
    _sum: { fileSize: true }
  });
  const totalBytes = result._sum.fileSize || 0;
  const gbUsed = totalBytes / (1024 * 1024 * 1024);
  const maxGb = 10;
  const percentage = (gbUsed / maxGb) * 100;
  
  return (
    <Link href="/admin" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border hover:border-muted-foreground/30 hover:bg-muted/80 transition-all group" title={`${gbUsed.toFixed(2)}GB / ${maxGb}GB used`} suppressHydrationWarning>
      <Database className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden" suppressHydrationWarning>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }} 
          suppressHydrationWarning
        />
      </div>
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10 w-full" suppressHydrationWarning>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl" suppressHydrationWarning>
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm" suppressHydrationWarning>
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Bandhu Vault</span>
          </Link>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <StorageIndicator />
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-border" } }} />
          </div>
        </div>
      </header>
      <StorageAlert />
      <main className="flex-1 flex w-full" suppressHydrationWarning>
        {children}
      </main>
    </div>
  )
}
