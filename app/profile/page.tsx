import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MangaService } from "@/lib/services/manga.service";
import { LibraryStatus, LibraryItem } from "@/types/library";
import { DB_MANGA } from "@/types/manga";
import { BookOpen, CheckCircle2, Clock, Heart, Star, LayoutGrid } from "lucide-react";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/login");
  }

  const mangaService = new MangaService();
  let libraryItems: (LibraryItem & { manga: DB_MANGA })[] = [];
  try {
    libraryItems = await mangaService.getLibraryWithManga(userId);
  } catch (error) {
    console.error("Error fetching library items:", error);
  }

  // Calculate real stats
  const stats = {
    reading: libraryItems.filter(item => item.status === LibraryStatus.READING).length,
    completed: libraryItems.filter(item => item.status === LibraryStatus.COMPLETED).length,
    planToRead: libraryItems.filter(item => item.status === LibraryStatus.PLAN_TO_READ).length,
    favorites: libraryItems.filter(item => item.favorite).length,
  };

  const favoriteMangas = libraryItems.filter(item => item.favorite).slice(0, 6);

  return (
    <div className="min-h-screen bg-background relative selection:bg-mango/30">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 manga-grid opacity-5 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Editorial Header */}
        <div className="relative mb-24 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              {/* Profile Image with decorative frame */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-mango/20 rounded-full blur-2xl group-hover:bg-mango/30 transition-all duration-700" />
                <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-mango p-2 bg-background overflow-hidden border-solid">
                  <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white/10">
                    {user.imageUrl ? (
                      <Image 
                        src={user.imageUrl} 
                        alt={user.fullName || "User"} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-6xl font-black italic text-mango">
                        {user.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-mango text-black font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-xl border-2 border-background">
                  MEMBER
                </div>
              </div>

              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 text-mango font-black uppercase tracking-[0.4em] text-[10px]">
                  <div className="w-12 h-[2px] bg-mango" />
                  <span>User Profile</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                  {user.firstName} <span className="text-mango">{user.lastName}</span>
                </h1>
                <p className="text-muted-foreground/60 font-medium tracking-wide">
                  @{user.username || user.emailAddresses[0].emailAddress.split('@')[0]}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-8 pb-4 opacity-40">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</div>
                <div className="text-xl font-black italic">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10 hidden md:block" />
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</div>
                <div className="text-xl font-black italic text-mango shrink-0 flex items-center gap-2">
                   Active <div className="w-2 h-2 bg-mango rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative background text */}
          <div className="absolute -bottom-10 -right-20 text-[15rem] font-black italic uppercase text-white/[0.02] select-none pointer-events-none">
            DASHBOARD
          </div>
        </div>

        {/* Stats Grid */}
        <section className="mb-24">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Reading" value={stats.reading} icon={<BookOpen className="w-5 h-5 text-mango" />} />
              <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="w-5 h-5 text-green-400" />} />
              <StatCard label="Plan to Read" value={stats.planToRead} icon={<Clock className="w-5 h-5 text-blue-400" />} />
              <StatCard label="Favorites" value={stats.favorites} icon={<Heart className="w-5 h-5 text-red-500" />} />
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Favorites Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tight">
                <span className="text-mango">/</span> Favorite Collection
              </h2>
              <Link href="/library?tab=favorites" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-mango transition-colors">
                View All Collection
              </Link>
            </div>

            {favoriteMangas.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {favoriteMangas.map((item) => (
                    <MangaMiniCard key={item.id} manga={item.manga} />
                  ))}
               </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
                 <div className="text-4xl mb-4 grayscale">🥭</div>
                 <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No favorites marked yet</p>
              </div>
            )}
          </div>

          {/* Activity/Sidebar Column */}
          <div className="space-y-12">
            <div className="border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tight">
                <span className="text-mango">/</span> Quick Menu
              </h2>
            </div>
            
            <div className="space-y-4">
              <MenuButton href="/library" icon={<LayoutGrid className="w-4 h-4" />} label="My Library" />
              <MenuButton href="/search" icon={<Star className="w-4 h-4" />} label="Discover New" />
            </div>

            <Card className="border-0 bg-mango text-black relative overflow-hidden group">
              <div className="absolute inset-0 manga-grid opacity-20 pointer-events-none mix-blend-overlay" />
              <CardContent className="p-8 relative z-10">
                <h3 className="text-2xl font-black italic uppercase leading-none mb-4">Mango AI Assistant</h3>
                <p className="text-xs font-bold leading-relaxed mb-6">Let our AI help you find your next obsession based on your readings.</p>
                <Button asChild className="w-full bg-black text-white hover:bg-neutral-900 border-none font-black uppercase text-[10px] h-12 rounded-xl">
                  <Link href="/assistant">Talk to Assistant</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Decorative Footer */}
      <footer className="py-24 border-t border-white/5 opacity-5 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap">
          PROFILE DASHBOARD USER_CENTRAL ARCHIVE PROFILE DASHBOARD
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon }: { readonly label: string, readonly value: number, readonly icon: React.ReactNode }) {
  return (
    <Card className="border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden group hover:border-mango/30 transition-all duration-500 rounded-[2rem]">
      <CardContent className="p-8 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-mango/20 transition-colors duration-500">
            {icon}
          </div>
          <div className="text-4xl font-black italic tracking-tighter group-hover:scale-110 transition-transform duration-500 group-hover:text-mango">
            {value}
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
          {label}
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-mango w-0 group-hover:w-full transition-all duration-700" />
      </CardContent>
    </Card>
  );
}

function MangaMiniCard({ manga }: { readonly manga: DB_MANGA }) {
  const image = manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url;
  const title = (manga.titles as any[])?.[0]?.title || "Unknown";

  return (
    <Link href={`/manga/${manga.mal_id}/detail`} className="group">
      <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-mango/50 transition-colors duration-500">
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
            sizes="(max-width: 768px) 30vw, 15vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-2xl">🥭</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
           <span className="text-[8px] font-black uppercase tracking-widest text-mango">View Entry</span>
        </div>
      </div>
      <h3 className="font-bold text-xs uppercase tracking-tight line-clamp-1 group-hover:text-mango transition-colors px-1">
        {title}
      </h3>
    </Link>
  );
}

function MenuButton({ href, icon, label }: { readonly href: string, readonly icon: React.ReactNode, readonly label: string }) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start gap-4 h-14 bg-white/5 border border-white/5 hover:border-mango/20 hover:bg-mango/5 rounded-2xl group transition-all duration-300">
      <Link href={href}>
        <span className="p-2 bg-white/5 rounded-xl group-hover:bg-mango/20 group-hover:text-mango transition-colors">
          {icon}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </Link>
    </Button>
  );
}
