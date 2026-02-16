import { auth } from "@clerk/nextjs/server";
import { MangaService } from "@/lib/services/manga.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Star, 
  Users,
  LayoutGrid,
  Heart
} from "lucide-react";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { DB_MANGA } from "@/types/manga";

export default async function LibraryPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null; // Protected by middleware
  }

  const mangaService = new MangaService();
  let libraryItems: (LibraryItem & { manga: DB_MANGA })[] = [];

  try {
    libraryItems = await mangaService.getLibraryWithManga(userId);
  } catch (error) {
    console.error("Error fetching library items:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <div className="text-6xl animate-bounce">🥭</div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md mx-auto">We couldn't load your library at the moment. This might be due to a connection issue with Supabase.</p>
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-mango hover:underline underline-offset-8">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Group items by status
  const reading = libraryItems.filter(item => item.status === LibraryStatus.READING);
  const planToRead = libraryItems.filter(item => item.status === LibraryStatus.PLAN_TO_READ);
  const completed = libraryItems.filter(item => item.status === LibraryStatus.COMPLETED);
  const favorites = libraryItems.filter(item => item.favorite);

  return (
    <div className="min-h-screen bg-background relative selection:bg-mango/30" suppressHydrationWarning>
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 manga-grid opacity-5 pointer-events-none" suppressHydrationWarning />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Editorial Header */}
        <div className="relative mb-24 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-mango font-black uppercase tracking-[0.4em] text-[10px] animate-in fade-in slide-in-from-left duration-1000">
                <div className="w-12 h-[2px] bg-mango" />
                <span>Personal Collection</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom duration-1000">
                My <span className="text-mango">Library</span>
              </h1>
            </div>
            <div className="flex items-center gap-8 pb-4 opacity-40 animate-in fade-in duration-1000 delay-500">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Titles</div>
                <div className="text-3xl font-black italic">{libraryItems.length}</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10" />
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reading</div>
                <div className="text-3xl font-black italic text-mango">{reading.length}</div>
              </div>
            </div>
          </div>
          
          {/* Decorative background text */}
          <div className="absolute -bottom-10 -right-20 text-[15rem] font-black italic uppercase text-white/[0.02] select-none pointer-events-none">
            ARCHIVE
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
            <TabsList className="bg-transparent h-auto p-0 gap-8 flex-wrap justify-start">
              <LibraryTabTrigger value="all" label="All Titles" count={libraryItems.length} />
              <LibraryTabTrigger value="reading" label="Reading" count={reading.length} icon={<BookOpen className="w-4 h-4" />} />
              <LibraryTabTrigger value="plan-to-read" label="Plan to Read" count={planToRead.length} icon={<Clock className="w-4 h-4" />} />
              <LibraryTabTrigger value="completed" label="Completed" count={completed.length} icon={<CheckCircle2 className="w-4 h-4" />} />
              <LibraryTabTrigger value="favorites" label="Favorites" count={favorites.length} icon={<Heart className="w-4 h-4" />} />
            </TabsList>
            
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              <LayoutGrid className="w-4 h-4" />
              <span>Grid View Mode</span>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <LibraryGrid items={libraryItems} />
          </TabsContent>
          <TabsContent value="reading" className="mt-0">
            <LibraryGrid items={reading} emptyMessage="You haven't started any manga yet. Ready to dive in?" />
          </TabsContent>
          <TabsContent value="plan-to-read" className="mt-0">
            <LibraryGrid items={planToRead} emptyMessage="Your 'To Read' list is empty. Found something interesting yet?" />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <LibraryGrid items={completed} emptyMessage="No completed manga yet. Let's finish one!" />
          </TabsContent>
          <TabsContent value="favorites" className="mt-0">
            <LibraryGrid items={favorites} emptyMessage="Mark your favorites to see them here!" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Decorative Footer Element */}
      <footer className="py-24 border-t border-white/5 opacity-5 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap">
          CATALOG REPOSITORY ARCHIVE COLLECTION CATALOG REPOSITORY
        </div>
      </footer>
    </div>
  );
}

function LibraryTabTrigger({ value, label, count, icon }: { value: string, label: string, count: number, icon?: React.ReactNode }) {
  return (
    <TabsTrigger 
      value={value}
      className="data-[state=active]:bg-transparent data-[state=active]:text-mango data-[state=active]:shadow-none p-0 relative group flex items-center gap-3 transition-all"
    >
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          {icon && <span className="opacity-0 group-data-[state=active]:opacity-100 transition-opacity">{icon}</span>}
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div className="h-[2px] w-0 group-data-[state=active]:w-full bg-mango transition-all duration-500" />
      </div>
      <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black shrink-0 px-2 py-0 h-5">
        {count}
      </Badge>
    </TabsTrigger>
  );
}

function LibraryGrid({ items, emptyMessage = "Nothing found in this section." }: { items: (LibraryItem & { manga: DB_MANGA })[], emptyMessage?: string }) {
  if (items.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
        <div className="text-8xl grayscale animate-pulse">🥭</div>
        <div className="space-y-2">
          <p className="text-xl font-black italic uppercase tracking-tighter">{emptyMessage}</p>
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-mango hover:underline underline-offset-8">
            Browse New Manga
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {items.map((item) => (
        <MangaLibraryCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MangaLibraryCard({ item }: { item: LibraryItem & { manga: DB_MANGA } }) {
  const manga = item.manga;
  const image = manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url;
  const title = (manga.titles as any[])?.[0]?.title || "Unknown Title";

  return (
    <Link href={`/manga/${manga.mal_id}/detail`} className="group block">
      <Card className="border-0 bg-transparent shadow-none group-hover:-translate-y-3 transition-transform duration-700">
        <CardContent className="p-0 space-y-4">
          <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group-hover:border-mango/50 transition-colors duration-500">
            {image ? (
              <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            ) : (
              <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-5xl">🥭</div>
            )}
            
            {/* Status Indicator Overlay */}
            <div className="absolute top-4 left-4">
               {item.status === LibraryStatus.READING && (
                 <div className="bg-mango text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                   Reading
                 </div>
               )}
            </div>

            {/* Favorite Indicator */}
            {item.favorite && (
              <div className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg border border-white/10">
                <Heart className="w-3 h-3 fill-current" />
              </div>
            )}

            {/* View Detail Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <span className="text-[10px] font-black uppercase text-mango tracking-[0.3em]">Open Entry</span>
            </div>
          </div>
          
          <div className="space-y-1 px-2">
            <h3 className="font-bold text-sm md:text-base leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-mango transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
               <span>MAL_ID: {manga.mal_id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
