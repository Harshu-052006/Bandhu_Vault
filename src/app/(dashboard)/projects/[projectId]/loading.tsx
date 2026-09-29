import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectLoading() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 flex flex-col md:flex-row gap-8">
      {/* Main Feed Column */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <Skeleton className="h-4 w-3/4 mb-8" />

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border/50 rounded-xl p-5 bg-card">
              <div className="flex items-start space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="w-full md:w-80 space-y-6">
        <div className="border border-border/50 rounded-xl p-5 bg-card">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="border border-border/50 rounded-xl p-5 bg-card">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-32 w-full rounded-md mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
