"use client";

import { useState, useEffect } from 'react';
import { Manga, JikanResponse, GENRE_MAP } from '@/types/manga';
import { MangaCard, MangaCardSkeleton } from "@/components/manga-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface GenreSectionCarouselProps {
  readonly genreName: string;
}

export function GenreSectionCarousel({ genreName }: GenreSectionCarouselProps) {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInview, setHasInview] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasInview(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    const element = document.getElementById(`genre-section-${genreName}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [genreName]);

  useEffect(() => {
    if (!hasInview) return;

    const fetchGenreManga = async () => {
      setIsLoading(true);
      try {
        const genreId = GENRE_MAP[genreName];
        if (!genreId) {
          throw new Error(`Genre ID not found for ${genreName}`);
        }

        const response = await fetch(`/api/manga/search?genres=${genreId}&type=manga&order_by=popularity&limit=10&sfw=true`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch genre manga");
        }

        const data: JikanResponse<Manga[]> = await response.json();
        setMangaList(data.data || []);
      } catch (error) {
        console.error(`Failed to load ${genreName} manga:`, error);
        toast.error(`Failed to load ${genreName} manga`, {
          description: "API might be rate-limited.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreManga();
  }, [genreName, hasInview]);

  return (
    <section id={`genre-section-${genreName}`} className="mb-24 relative min-h-[400px]">
      <div className="flex justify-between items-end mb-10 border-b-4 border-mango-secondary/10 pb-6 relative">
        <div className="relative group">
          <h2 className="text-3xl font-black italic uppercase tracking-tight flex items-center gap-3">
            <span className="text-mango">/</span>
            {genreName} <span className="text-muted-foreground/30">Manga</span>
          </h2>
          <div className="absolute -bottom-1 left-0 w-0 h-1 bg-mango group-hover:w-full transition-all duration-500" />
        </div>
        
        <Link href={`/search?genres=${GENRE_MAP[genreName]}&type=manga&order_by=popularity`}>
          <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest hover:text-mango transition-colors flex items-center gap-2 group">
            VIEW ALL 
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full relative px-12 -mx-12"
      >
        <CarouselContent className="-ml-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <CarouselItem key={`skeleton-${genreName}-${i}`} className="pl-6 basis-full sm:basis-1/2 md:basis-[340px] lg:basis-[380px]">
                <MangaCardSkeleton />
              </CarouselItem>
            ))
          ) : (
            mangaList.map((manga) => (
              <CarouselItem key={manga.mal_id} className="pl-6 basis-full sm:basis-1/2 md:basis-[340px] lg:basis-[380px]">
                <MangaCard manga={manga} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-20">
            <CarouselPrevious className="static translate-y-0 border-2 border-white/5 bg-background/50 backdrop-blur-md hover:border-mango/50 hover:bg-mango/10 transition-all size-10 rounded-xl" />
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20">
            <CarouselNext className="static translate-y-0 border-2 border-white/5 bg-background/50 backdrop-blur-md hover:border-mango/50 hover:bg-mango/10 transition-all size-10 rounded-xl" />
        </div>
      </Carousel>
      
      {/* Decorative halftone pattern */}
      <div className="absolute -top-10 -right-10 w-40 h-40 manga-halftone-bg opacity-[0.03] -z-10" />
    </section>
  );
}
