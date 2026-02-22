"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Manga } from '@/types/manga';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MangaCardProps {
  readonly manga: Manga;
}

export function MangaCard({ manga }: MangaCardProps) {
  const title = manga.title;
  const genres = manga.genres.map(g => g.name);
  const ratingDisplay = manga.score ?? "N/A";
  const members = manga.members || 0;
  const image = manga.images.webp.large_image_url;
  const description = manga.synopsis;

  return (
    <Link href={`/manga/${manga.mal_id}/detail`}>
      <Card className="group relative overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md hover:border-mango/40 transition-all duration-700 hover:-translate-y-4 cursor-pointer rounded-[2rem] shadow-xl hover:shadow-mango/10">
        <CardContent className="p-0">
          <div className="aspect-[3/4.2] relative m-3 overflow-hidden rounded-[1.6rem]">
            {image ? (
              <Image 
                src={image} 
                alt={title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" 
                suppressHydrationWarning 
              />
            ) : (
              <div className="w-full h-full bg-neutral-900/50 flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition-all duration-500">🥭</div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {genres && genres.length > 0 && (
                <div className="bg-black/60 backdrop-blur-lg text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-lg">
                  {genres[0]}
                </div>
              )}
              <div className="bg-mango text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                {manga.type}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
               <Button className="cursor-pointer w-full bg-mango text-black font-black uppercase text-[10px] tracking-widest rounded-xl h-12 hover:bg-white transition-colors border-0">
                  VIEW DETAILS
               </Button>
            </div>
          </div>
          
          <div className="px-6 pb-6 pt-2">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="font-black text-xl line-clamp-1 group-hover:text-mango transition-colors tracking-tighter italic uppercase leading-tight">
                {title}
              </h3>
              <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
                <span className="text-mango text-[10px]">★</span>
                <span className="text-foreground font-black text-[10px]">{ratingDisplay}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mb-5 line-clamp-2 leading-relaxed font-medium opacity-60">
              {description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full bg-mango/20 border border-background flex items-center justify-center text-[6px]">👤</div>
                    ))}
                 </div>
                 <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">
                   {members.toLocaleString()} Members
                 </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MangaCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md rounded-[2rem]">
      <CardContent className="p-0">
        <div className="aspect-[3/4.2] relative m-3 overflow-hidden rounded-[1.6rem]">
          <Skeleton className="w-full h-full bg-mango/10" />
        </div>
        <div className="px-6 pb-6 pt-2 space-y-3">
          <div className="flex justify-between items-start gap-4">
            <Skeleton className="h-6 w-3/4 bg-mango/10" />
            <Skeleton className="h-6 w-12 bg-mango/10" />
          </div>
          <Skeleton className="h-4 w-full bg-mango/5" />
          <Skeleton className="h-4 w-2/3 bg-mango/5" />
        </div>
      </CardContent>
    </Card>
  );
}
