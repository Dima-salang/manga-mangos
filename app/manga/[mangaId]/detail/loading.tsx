import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-mango/30">
      <div className="fixed inset-0 manga-grid opacity-5 pointer-events-none" />
      
      <main className="relative z-10">
        <div className="relative w-full aspect-[21/9] md:aspect-[25/9] overflow-hidden bg-muted/20 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="relative w-[280px] aspect-[3/4.2] rounded-[2rem] overflow-hidden border-2 border-mango bg-neutral-900/50">
              <Skeleton className="w-full h-full bg-mango/10" />
            </div>

            <div className="flex-1 space-y-6 pt-10">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20 bg-white/5" />
                <Skeleton className="h-6 w-16 bg-mango/20" />
              </div>
              <Skeleton className="h-16 w-3/4 bg-white/5" />
              <div className="flex gap-10 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-12 bg-white/5" />
                    <Skeleton className="h-8 w-20 bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24 py-20">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <Skeleton className="h-10 w-40 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-2/3 bg-white/5" />
              </div>
              <Skeleton className="h-[200px] w-full bg-white/5 rounded-[2rem]" />
            </div>
            
            <div className="space-y-8">
              <Card className="bg-card/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                <Skeleton className="h-8 w-32 mb-8 bg-white/5" />
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-2 w-16 bg-mango/20" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-16 w-full mt-12 rounded-2xl bg-mango/20" />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
