"use client";

import { useState, useEffect, useRef } from "react";
import { JikanReview, TopReviewResponse } from "@/types/review";
import { ReviewCard } from "./review-card";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Loader2 } from "lucide-react";

export function DecorativeReviews() {
  const [reviews, setReviews] = useState<JikanReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasStartedFetching = useRef(false);
  const containerRef = useRef<HTMLElement>(null);

  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      dragFree: true
    },
    [
      AutoScroll({ 
        playOnInit: true, 
        speed: 0.5,
        stopOnInteraction: false,
        stopOnMouseEnter: true
      })
    ]
  );

  useEffect(() => {
    if (hasStartedFetching.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedFetching.current) {
          hasStartedFetching.current = true;
          startFetching();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    async function startFetching() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/reviews/top");
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const json = await res.json();
        const data: TopReviewResponse = json;
        setReviews(data.data || []);
      } catch (error) {
        console.error("Error loading decorative reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }

    return () => observer.disconnect();
  }, []);

  if (reviews.length === 0 && !isLoading) return null;

  return (
    <section ref={containerRef} className="py-24 overflow-hidden relative min-h-[400px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-mango/[0.03] uppercase italic select-none pointer-events-none whitespace-nowrap tracking-tighter">
        Reviews
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16 flex items-center gap-6">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-mango/20" />
        <h2 className="text-3xl font-black italic uppercase tracking-tighter shrink-0 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-mango flex items-center justify-center text-background text-sm not-italic">!</span>
          Community <span className="text-mango">Feed</span>
        </h2>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-mango/20" />
      </div>

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-mango" size={32} />
        </div>
      ) : (
        <div 
          className="embla overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" 
          ref={emblaRef}
        >
          <div className="embla__container flex gap-8 px-[15%]">
            {reviews.map((review, idx) => (
              <div key={`${review.mal_id}-${idx}`} className="embla__slide flex-[0_0_400px] min-w-0 h-[320px]">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
