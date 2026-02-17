"use client";

import { useTransition } from "react";
import { removeMangaFromLibraryAction } from "./library";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { DB_MANGA } from "@/types/manga";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MangaLibraryCardProps {
  item: LibraryItem & { manga: DB_MANGA };
}

export default function MangaLibraryCard({ item }: { item: LibraryItem & { manga: DB_MANGA } }) {
  const manga = item.manga;
  const image = manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url;
  const title = (manga.titles as any[])?.[0]?.title || "Unknown Title";
  const [isPending, startTransition] = useTransition();
  const statusLabels: Record<LibraryStatus, string> = {
    [LibraryStatus.READING]: 'Reading',
    [LibraryStatus.PLAN_TO_READ]: 'Plan to Read',
    [LibraryStatus.COMPLETED]: 'Completed',
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!confirm(`Remove "${title}" from your library?`)) {
      return;
    }

    startTransition(async () => {
      const result = await removeMangaFromLibraryAction(manga.mal_id);
      
      if (result.success) {
        toast.success("Removed from library", {
          description: `${title} has been removed from your library.`,
          icon: "🗑️"
        });
      } else {
        toast.error("Failed to remove", {
          description: result.error
        });
      }
    });
  };

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
              {item.status && (
                <div className="bg-mango text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                  {/* Optional pulse only for READING */}
                  {item.status === LibraryStatus.READING && (
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                  )}
                  {statusLabels[item.status]}
                </div>
              )}
            </div>

            {/* Favorite Indicator */}
            {item.favorite && (
              <div className="z-11 absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg border border-white/10">
                <Heart className="w-3 h-3 fill-current" />
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="cursor-pointer z-11 absolute top-4 right-4 bg-red-500/90 hover:bg-red-900 hover:border-orange-300 text-white p-2 rounded-full shadow-lg border border-white/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove from library">
              {isPending ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Trash2 className="w-4 h-4" />)}
            </button>

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
