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

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedFetching.current) {
          hasStartedFetching.current = true;
          startFetching();
          observer.unobserve(currentContainer);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(currentContainer);

    async function startFetching() {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      try {
        const res = await fetch("/api/reviews/top", { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
        const data: TopReviewResponse = await res.json();
        setReviews(data.data || []);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn("Decorative reviews fetch timed out");
        } else {
          console.error("Error loading decorative reviews:", error);
        }
        setReviews([]); // Ensure we don't stay in loading state forever
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    }

    return () => {
      if (currentContainer) observer.unobserve(currentContainer);
      observer.disconnect();
    };
  }, []);

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
      ) : reviews.length > 0 ? (
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
      ) : (
        <div className="text-center py-12 text-muted-foreground italic font-black uppercase tracking-[0.2em] opacity-20">
          Searching for reviews...
        </div>
      )}
    </section>
  );
}
