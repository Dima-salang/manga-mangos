"use client";

import { JikanReview } from "@/types/review";
import Image from "next/image";
import { Quote, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  readonly review: JikanReview;
  readonly className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  // Extract a shorter snippet of the review
  const snippet = review.review.length > 200 
    ? review.review.substring(0, 200) + "..." 
    : review.review;

  const item = review.manga || review.anime || review.entry;

  return (
    <div 
      className={cn(
        "group relative bg-card border-l-4 border-mango p-6 h-full flex flex-col justify-between overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(255,159,67,1)]",
        className
      )}
    >
      {/* Decorative background element */}
      <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] rotate-12 transition-transform group-hover:rotate-45 duration-700">
        <Quote size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-mango/30 bg-mango/10">
            {review.user?.images?.jpg?.image_url ? (
              <Image 
                src={review.user.images.jpg.image_url} 
                alt={review.user.username || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-mango/20 flex items-center justify-center text-[10px] font-bold text-mango">
                {review.user?.username?.substring(0, 1) || "U"}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-mango">
              {review.user?.username || "Anonymous"}
            </h4>
            <div className="flex gap-1">
              {new Array(5).fill(0).map((_, i) => (
                <Star 
                  key={`star-${review.mal_id}-${i}`} 
                  size={10} 
                  className={cn(
                    "fill-current",
                    i < Math.floor(review.score / 2) ? "text-mango" : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-2 text-mango/20 w-8 h-8 -z-10" />
          <p className="text-foreground/80 font-medium leading-relaxed italic line-clamp-4 pl-4 border-l border-white/5">
            "{snippet}"
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-8 h-12 flex-shrink-0 bg-mango/10 overflow-hidden rounded-sm border border-white/5">
            {item?.images?.jpg?.image_url ? (
              <Image 
                src={item.images.jpg.image_url} 
                alt={item.title || "Manga"}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <div className="w-full h-full bg-mango/5" />
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground truncate max-w-[120px]">
            {item?.title || "Unknown Title"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-mango/5 border border-mango/10">
            <MessageSquare size={10} className="text-mango" />
            <span className="text-[10px] font-bold text-mango">
              {review.reactions.overall}
            </span>
          </div>
        </div>
      </div>

      {/* Manga-style halftone background effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] pointer-events-none transition-opacity duration-500 manga-halftone-bg" />
    </div>
  );
}
