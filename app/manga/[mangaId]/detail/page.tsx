import { MangaService } from "@/lib/services/manga.service";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Star,
  Users,
  Trophy,
  TrendingUp,
  ChevronLeft,
  Info
} from "lucide-react";
import { DetailActions, ReadingStatusSelect, MangaLibraryProvider, MangaReviewsSection } from "./client-actions";
import { z } from "zod";
import { Manga, MangaRecommendation } from "@/types/manga";
import { auth } from "@clerk/nextjs/server";
import { LibraryItem } from "@/types/library";

// zod validation for the manga id
const mangaIdSchema = z.coerce.number().int().positive();




export default async function MangaDetail({ params }: { params: Promise<{ mangaId: string }> }) {
  // get the manga detail
  const { mangaId } = await params;
  const id = Number(mangaId);
  const validId = mangaIdSchema.safeParse(id);

  // if the manga id is not valid, return not found
  if (!validId.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic text-mango mb-4">Manga Not Found</h1>
          <Link href="/browse">
            <Button variant="outline" className="rounded-xl border-mango/20 hover:bg-mango/10">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const mangaService = new MangaService();
  let manga: Manga;

  // try the response
  try {
    const response = await mangaService.getManga(id);
    manga = response.data;
  } catch (error) {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic text-mango mb-4">Manga Not Found</h1>
          <Link href="/browse">
            <Button variant="outline" className="rounded-xl border-mango/20 hover:bg-mango/10">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }


  // parse the published to and from dates into human-readable format
  const fromPublishDate = manga.published?.from 
    ? new Date(manga.published.from).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "Unknown";

  const toPublishDate = manga.published?.to
    ? new Date(manga.published.to).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "Present";


  // get the manga recommendations
  let recommendations: MangaRecommendation[] = [];
  try {
    const response = await mangaService.getMangaRecommendations(id);
    recommendations = response.data;
  } catch (error) {
    // render not found recommendations in the ui
    console.error("No recommendations found", error);
  }

  // get current library status if logged in
  const { userId } = await auth();
  let libraryItem: LibraryItem | null = null;
  if (userId) {
    try {
      libraryItem = await mangaService.getLibraryItem(userId, id);
    } catch (error) {
      console.error("Error fetching library item", error);
    }
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-mango/30" suppressHydrationWarning>
      <div className="fixed inset-0 manga-grid opacity-5 pointer-events-none" suppressHydrationWarning />

      <main className="relative z-10">
        <div className="relative w-full aspect-[21/9] md:aspect-[25/9] overflow-hidden">
          <div className="absolute inset-0 z-0">
            {manga.images?.webp?.large_image_url && (
              <Image
                src={manga.images.webp.large_image_url}
                alt=""
                fill
                className="object-cover blur-1xl opacity-20 scale-110"
                priority
                suppressHydrationWarning
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        </div>

        <MangaLibraryProvider manga={manga} initialLibraryItem={libraryItem}>
          <div className="max-w-7xl mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12 md:pb-20">
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-mango transition-colors group"
                suppressHydrationWarning
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Browse
              </Link>
              <DetailActions />
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              {/* Cover Image */}
              <div className="relative group/cover shrink-0 mx-auto md:mx-0">
                <div className="absolute -inset-1 bg-mango rounded-[2.5rem] blur opacity-25 group-hover/cover:opacity-50 transition duration-1000" />
                <div className="relative w-[280px] aspect-[3/4.2] rounded-[2rem] overflow-hidden border-2 border-mango shadow-2xl bg-neutral-900/50">
                  {manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url ? (
                    <Image
                      src={manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url || ""}
                      alt={manga.title}
                      fill
                      className="object-cover group-hover/cover:scale-105 transition-transform duration-700"
                      priority
                      suppressHydrationWarning
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🥭</div>
                  )}
                  <div className="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 text-[10px] font-black uppercase tracking-[0.5em] text-black/20 pointer-events-none select-none">
                    MANGO_DETAIL
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  {(manga.genres || []).map((genre) => (
                    <Badge
                      key={genre.mal_id}
                      variant="outline"
                      className="bg-white/5 border-white/10 text-muted-foreground uppercase font-black tracking-widest text-[8px] py-1 px-3"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                  <Badge className="bg-mango text-black hover:bg-mango/90 uppercase font-black tracking-widest text-[8px] py-1 px-3">
                    {manga.type || "Manga"}
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6 text-foreground break-words">
                  {manga.title}
                </h1>

                {manga.title_japanese && (
                  <p className="text-xl md:text-2xl font-serif italic text-muted-foreground/60 mb-8">
                    🇯🇵 {manga.title_japanese}
                  </p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-10">
                  <StatItem
                    icon={<Star className="w-5 h-5 text-mango fill-current" suppressHydrationWarning />}
                    label="Score"
                    value={manga.score?.toString() || "N/A"}
                    subValue={`${manga.scored_by?.toLocaleString() || 0} votes`}
                  />
                  <StatItem
                    icon={<Trophy className="w-5 h-5 text-mango" suppressHydrationWarning />}
                    label="Rank"
                    value={`#${manga.rank || "N/A"}`}
                  />
                  <StatItem
                    icon={<TrendingUp className="w-5 h-5 text-mango" suppressHydrationWarning />}
                    label="Popularity"
                    value={`#${manga.popularity || "N/A"}`}
                  />
                  <StatItem
                    icon={<Users className="w-5 h-5 text-mango" suppressHydrationWarning />}
                    label="Members"
                    value={manga.members?.toLocaleString() || "0"}
                  />
                </div>
              </div>
            </div>
          </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
            <div className="lg:col-span-2 space-y-16">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">
                    <span className="text-mango">/</span> Synopsis
                  </h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground/40 cursor-help" suppressHydrationWarning />
                    </TooltipTrigger>
                    <TooltipContent>Plot summary and premise</TooltipContent>
                  </Tooltip>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="prose prose-invert max-w-none" suppressHydrationWarning>
                    <p className="text-lg leading-relaxed text-muted-foreground font-medium">
                      {manga.synopsis || "No synopsis available."}
                    </p>
                  </div>
                </ScrollArea>
              </section>

              {manga.background && (
                <section className="bg-card/20 backdrop-blur-sm rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 manga-grid opacity-10 pointer-events-none" />
                  <h2 className="text-xl font-black italic uppercase mb-6 text-mango">Background Info</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    {manga.background}
                  </p>
                </section>
              )}
            </div>

            <div className="space-y-12">
              <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-black italic uppercase mb-8 flex flex-col gap-2">
                  <span>Information</span>
                  <Separator className="bg-mango/20 h-1" />
                </h2>

                <div className="space-y-6">
                  <MetaItem label="Reading Status" value={<ReadingStatusSelect />} />
                  <Separator className="bg-white/5" />
                  <MetaItem label="Status" value={manga.status || "Unknown"} />
                  <MetaItem label="Published" value={`${fromPublishDate} to ${toPublishDate}`} />
                  <MetaItem 
                    label="Authors" 
                    value={
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {(manga.authors || []).map((a, i) => (
                          <div key={a.mal_id} className="inline-flex items-center gap-1 group/link">
                            <a 
                              href={a.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:text-mango transition-colors relative"
                            >
                              {a.name}
                              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-mango transition-all group-hover/link:w-full" />
                            </a>
                            {i < (manga.authors || []).length - 1 && <span className="text-muted-foreground/20 ml-1">/</span>}
                          </div>
                        ))}
                      </div>
                    } 
                  />
                  <MetaItem label="Chapters" value={manga.chapters?.toString() || "Unknown"} />
                  <MetaItem label="Volumes" value={manga.volumes?.toString() || "Unknown"} />
                  <MetaItem 
                    label="Serialization" 
                    value={
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {(manga.serializations || []).map((s, i) => (
                          <div key={s.mal_id} className="inline-flex items-center gap-1 group/link">
                            <a 
                              href={s.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:text-mango transition-colors italic relative"
                            >
                              {s.name}
                              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-mango transition-all group-hover/link:w-full" />
                            </a>
                            {i < (manga.serializations || []).length - 1 && <span className="text-muted-foreground/20 ml-1">/</span>}
                          </div>
                        ))}
                      </div>
                    } 
                  />
                </div>

              </div>

              <div className="flex flex-wrap gap-2">
                {[...(manga.themes || []), ...(manga.demographics || [])].map(item => (
                  <Badge
                    key={item.mal_id}
                    variant="secondary"
                    className="bg-white/5 hover:bg-white/10 text-muted-foreground/60 border-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1"
                  >
                    #{item.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-24 border-t border-white/5">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-mango font-black uppercase tracking-[0.3em] text-[10px]">
                  <div className="w-8 h-[2px] bg-mango" />
                  <span>Curated for you</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                  More like this
                </h2>
              </div>
            </div>

            <div className="relative px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-6">
                  {recommendations.slice(0, 15).map((rec) => (
                    <CarouselItem key={rec.entry.mal_id} className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <Link 
                        href={`/manga/${rec.entry.mal_id}/detail`}
                        className="block group/rec"
                      >
                        <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover/rec:border-mango/50 transition-colors duration-500 bg-neutral-900/50">
                          <Image
                            src={rec.entry.images.webp?.large_image_url ?? rec.entry.images.jpg?.large_image_url ?? "/placeholder-manga.jpg"}
                            alt={rec.entry.title}
                            fill
                            className="object-cover group-hover/rec:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/rec:opacity-100 transition-opacity duration-500 flex items-end p-4">
                             <span className="text-[10px] font-black uppercase text-mango tracking-widest">View Detail</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground group-hover/rec:text-mango transition-colors line-clamp-2 leading-tight">
                          {rec.entry.title}
                        </h3>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-background/50 border-white/5 hover:bg-mango hover:text-black transition-all" />
                <CarouselNext className="hidden md:flex -right-12 bg-background/50 border-white/5 hover:bg-mango hover:text-black transition-all" />
              </Carousel>
            </div>
          </section>
        )}
        
        <section className="max-w-7xl mx-auto px-4 py-24 border-t border-white/5">
          <MangaReviewsSection mangaId={id} />
        </section>
        </MangaLibraryProvider>
      </main>

      <footer className="py-24 border-t border-white/5 opacity-30 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap animate-pulse">
          {manga.title} {manga.title}
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-1 group" suppressHydrationWarning>
      <div className="flex items-center gap-2 mb-1" suppressHydrationWarning>
        {icon}
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{label}</span>
      </div>
      <div className="text-2xl font-black text-foreground group-hover:text-mango transition-colors">{value}</div>
      {subValue && <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{subValue}</div>}
    </div>
  );
}

function MetaItem({ label, value }: { label: string, value: string | React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1" suppressHydrationWarning>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-mango/60" suppressHydrationWarning>{label}</span>
      <span className="text-sm font-bold text-foreground leading-tight" suppressHydrationWarning>{value}</span>
    </div>
  );
}