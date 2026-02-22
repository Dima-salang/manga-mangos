"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Manga } from '@/types/manga';
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendingHeroCarouselProps {
  readonly mangaList: Manga[];
  readonly isLoading?: boolean;
}

export function TrendingHeroCarousel({ mangaList, isLoading }: TrendingHeroCarouselProps) {
  if (isLoading) return <TrendingHeroSkeleton />;
  if (!mangaList || mangaList.length === 0) return null;

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {mangaList.map((manga) => (
            <CarouselItem key={manga.mal_id} className="pl-0">
              <TrendingHeroSlide manga={manga} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex absolute bottom-8 right-12 gap-3 z-20">
          <CarouselPrevious className="static translate-y-0 border-2 border-white/10 bg-black/20 backdrop-blur-md hover:border-mango/50 hover:bg-mango/10 transition-all size-12 rounded-2xl" />
          <CarouselNext className="static translate-y-0 border-2 border-white/10 bg-black/20 backdrop-blur-md hover:border-mango/50 hover:bg-mango/10 transition-all size-12 rounded-2xl" />
        </div>
      </Carousel>
    </div>
  );
}

function TrendingHeroSlide({ manga }: { readonly manga: Manga }) {
  const image = manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url || "/placeholder-manga.jpg";
  const genres = manga.genres?.slice(0, 3) || [];
  
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-card/10 backdrop-blur-sm border border-white/5 group h-[550px] md:h-[600px] w-full">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20 blur-2xl scale-110"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Left: Manga Picture */}
        <div className="w-full md:w-[35%] relative h-[250px] md:h-full p-4 md:p-8">
           <div className="relative h-full w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <Image
                src={image}
                alt={manga.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-[65%] p-8 md:p-16 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="bg-mango text-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-mango/20">
              <Star size={12} fill="currentColor" />
              <span className="text-[11px] font-black uppercase">{manga.score || 'N/A'}</span>
            </div>
            
            {genres.map((genre) => (
              <Badge 
                key={genre.mal_id} 
                variant="outline" 
                className="bg-white/5 backdrop-blur-md border-white/10 text-[10px] uppercase tracking-[0.15em] font-black py-1.5 px-4 rounded-full"
              >
                {genre.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9] group-hover:text-mango transition-colors duration-500 max-w-3xl">
            {manga.title}
          </h1>

          <p className="text-muted-foreground/80 text-sm md:text-lg line-clamp-3 md:line-clamp-4 mb-10 max-w-2xl leading-relaxed font-medium">
            {manga.synopsis || "No synopsis available for this title."}
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <Link href={`/manga/${manga.mal_id}/detail`}>
              <Button className="bg-mango hover:bg-white text-black font-black uppercase tracking-[0.2em] px-10 h-16 rounded-[1.2rem] shadow-xl shadow-mango/20 transition-all hover:-translate-y-2 active:scale-95 text-xs">
                READ NOW
              </Button>
            </Link>
            
            <div className="flex gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Readers</span>
                <span className="text-xl md:text-2xl font-black italic">{manga.members?.toLocaleString() || 0}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Status</span>
                <span className="text-xl md:text-2xl font-black italic uppercase">{formatStatus(manga.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Texture */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden md:block">
         <div className="text-[10rem] font-black italic leading-none select-none">
            MANGO
         </div>
      </div>
    </div>
  );
}

const STATUS_MAP: Record<string, string> = {
  "On Hiatus": "Hiatus",
  "Not yet published": "Unreleased",
  "Publishing": "Ongoing",
  "Finished": "Finished",
  "Discontinued": "Dropped",
};

function formatStatus(status: string | null | undefined): string {
  if (!status) return "N/A";
  
  if (STATUS_MAP[status]) {
    return STATUS_MAP[status];
  }

  // Fallback: limit to 12 characters with ellipsis if too long
  return status.length > 12 ? `${status.substring(0, 11)}…` : status;
}

function TrendingHeroSkeleton() {
  return (
    <div className="w-full h-[550px] md:h-[600px] rounded-[2.5rem] bg-card/10 animate-pulse border border-white/5 flex flex-col md:flex-row mb-16 overflow-hidden">
      <div className="w-full md:w-[35%] p-8">
        <div className="w-full h-full bg-white/5 rounded-[2rem]" />
      </div>
      <div className="w-full md:w-[65%] p-16 flex flex-col justify-center gap-8">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-16 bg-white/5 rounded-full" />
          <Skeleton className="h-8 w-24 bg-white/5 rounded-full" />
          <Skeleton className="h-8 w-24 bg-white/5 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-16 w-3/4 bg-white/5" />
          <Skeleton className="h-16 w-1/2 bg-white/5" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />
          <Skeleton className="h-4 w-4/6 bg-white/5" />
        </div>
        <div className="flex gap-10 pt-4">
          <Skeleton className="h-16 w-44 bg-white/5 rounded-[1.2rem]" />
          <Skeleton className="h-16 w-44 bg-white/5 rounded-[1.2rem]" />
        </div>
      </div>
    </div>
  );
}
