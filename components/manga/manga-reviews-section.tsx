"use client";

import { useState, useEffect } from "react";
import { JikanReview } from "@/types/review";
import { ReviewCard } from "./review-card";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MangaReviewsSectionProps {
  readonly mangaId: number;
}

export function MangaReviewsSection({ mangaId }: MangaReviewsSectionProps) {
  const [reviews, setReviews] = useState<JikanReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/manga/${mangaId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data.data || []);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (mangaId) {
      fetchReviews();
    }
  }, [mangaId]);

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-mango animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Fetching Community Reviews...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-red-500/5 rounded-[2rem] border border-red-500/10">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm font-bold text-red-400">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => globalThis.location.reload()}
          className="rounded-xl border-red-500/20 hover:bg-red-500/10 mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center opacity-40">
        <div className="text-6xl mb-6 grayscale">💬</div>
        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">No reviews yet</h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] max-w-[200px]">
          Be the first to leave a review for this series.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-12">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-mango font-black uppercase tracking-[0.3em] text-[10px]">
             <MessageSquare className="w-3 h-3" />
             <span>Community Transmission</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Reader <span className="text-mango">Reviews</span>
          </h2>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          Showing {reviews.length} reviews
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div 
            key={`${review.mal_id}-${index}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ReviewCard 
              review={review} 
              className="h-full border-t border-l-0 border-white/5 bg-background/40 backdrop-blur-sm" 
              showMetadata={false}
            />
          </div>
        ))}
      </div>
      
      {/* Editorial Accent */}
      <div className="pt-12 flex justify-center opacity-10 pointer-events-none select-none overflow-hidden">
        <div className="text-[10rem] font-black italic uppercase whitespace-nowrap tracking-[-0.05em]">
          COMMUNITY_FEED_COMMUNITY_FEED
        </div>
      </div>
    </section>
  );
}
