"use client";

import { useState, useEffect, useRef } from "react";
import { CommunityRecommendation, CommunityRecommendationsResponse } from "@/types/manga";
import { Loader2, MessageSquare, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CommunityRecommendations() {
  const [recommendations, setRecommendations] = useState<CommunityRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasStartedFetching = useRef(false);
  const containerRef = useRef<HTMLElement>(null);

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
        const res = await fetch("/api/manga/community-recommendations", { 
          signal: controller.signal 
        });
        if (!res.ok) throw new Error(`Failed to fetch recommendations: ${res.status}`);
        const data: CommunityRecommendationsResponse = await res.json();
        setRecommendations(data.data || []);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn("Community recommendations fetch timed out");
        } else {
          console.error("Error loading community recommendations:", error);
        }
        setRecommendations([]);
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
    <section 
      ref={containerRef} 
      className="py-32 relative overflow-hidden bg-background"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 manga-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 manga-halftone-bg opacity-[0.02] pointer-events-none" />
      
      {/* Large Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none w-full flex justify-center">
        <div className="text-[25vw] font-black text-mango/[0.03] uppercase italic tracking-tighter leading-none manga-halftone">
          
        </div>
      </div>

      {/* Vertical Japanese Decor */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 select-none pointer-events-none z-0">
        <div className="[writing-mode:vertical-rl] text-8xl font-black text-mango/5 uppercase italic tracking-tighter">
          コミュニティ
        </div>
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-mango/20 to-transparent" />
        <div className="[writing-mode:vertical-rl] text-8xl font-black text-white/[0.03] uppercase italic tracking-tighter">
          RECOMMEND
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Editorial Header */}
        <div className="mb-24 flex flex-col md:flex-row items-end gap-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-mango/10 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full blur-2xl" />
            <h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none relative">
              User{" "}
              <br />
              <span className="text-mango flex items-center gap-6">
                Picks{" "}
                <span className="w-16 h-[4px] bg-mango inline-block mt-4" />
              </span>
            </h2>
            <div className="absolute -top-8 -right-8 w-16 h-16 border-t-2 border-r-2 border-mango/20 rounded-tr-3xl" />
          </div>
          
          <div className="flex-1 pb-2">
            <p className="text-muted-foreground font-medium uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-3">
              Community Curated Feed //
            </p>
            <div className="h-px w-full bg-gradient-to-r from-mango/20 via-mango/40 to-transparent" />
          </div>
        </div>

        {(() => {
          if (isLoading) {
            return (
              <div className="w-full flex items-center justify-center py-24">
                <div className="relative">
                  <Loader2 className="animate-spin text-mango" size={48} />
                  <div className="absolute inset-0 blur-xl bg-mango/20 rounded-full animate-pulse" />
                </div>
              </div>
            );
          }

          if (recommendations.length > 0) {
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                {recommendations.slice(0, 6).map((rec, idx) => (
                  <div 
                    key={rec.mal_id || idx}
                    className={cn(
                      "group relative flex flex-col md:flex-row gap-8 items-stretch",
                      "animate-in fade-in duration-1000",
                      idx % 2 === 1 ? "md:mt-12" : ""
                    )}
                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                  >
                    {/* Index Decor */}
                    <div className="absolute -left-6 -top-6 text-6xl font-black italic text-mango/[0.05] select-none group-hover:text-mango/[0.1] transition-colors duration-500">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Manga Panels */}
                    <div className="flex-shrink-0 flex gap-2 relative">
                      {rec.entry.map((manga, mIdx) => {
                        const imageUrl = manga.images.webp?.large_image_url || manga.images.jpg?.large_image_url || "/placeholder.png";
                        return (
                          <div 
                            key={manga.mal_id} 
                            className={cn(
                              "relative w-[140px] h-[200px] md:w-[160px] md:h-[240px] overflow-hidden border-2 border-mango/10 rounded-2xl transition-all duration-700",
                              "hover:border-mango hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,159,67,0.3)]",
                              mIdx === 1 ? "-ml-12 mt-8 z-10" : "z-0"
                            )}
                          >
                            <Link href={`/manga/${manga.mal_id}/detail`} className="block w-full h-full">
                              <Image
                                src={imageUrl}
                                alt={manga.title}
                                sizes="(max-width: 768px) 160px, 200px"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none truncate">
                                  {manga.title}
                                </span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                      {/* Speed Lines Effect */}
                      <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="w-full h-full manga-grid opacity-20 rotate-45" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="relative">
                        <Quote className="absolute -left-4 -top-4 text-mango/20 w-8 h-8 rotate-180" />
                        <div className="mb-6 pl-4 border-l border-mango/10">
                          <p className="text-lg text-white/90 font-medium leading-relaxed italic line-clamp-4 group-hover:text-white transition-colors">
                            {rec.content}
                          </p>
                        </div>
                        
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mango to-mango-secondary flex items-center justify-center p-[1px]">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-mango font-black text-xs">
                              {rec.user.username.slice(0, 1).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase text-mango tracking-widest leading-none mb-1">Curation By</div>
                            <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                              @{rec.user.username}
                            </div>
                          </div>
                        </div>
                        <Link 
                          href={rec.user.url} 
                          target="_blank"
                          className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-mango/50 transition-all duration-300"
                        >
                          <MessageSquare size={16} className="text-mango/60 group-hover:text-mango transition-colors" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="text-center py-24 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none font-black italic text-[10vw] uppercase">
                Empty Feed
              </div>
              <div className="relative text-muted-foreground italic font-black uppercase tracking-[0.4em] opacity-40 text-xl border-y border-white/5 py-12 inline-block">
                No transmissions found...
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer Line Decor */}
      <div className="absolute bottom-0 left-0 w-full h-[600px] pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mango/20 to-transparent" />
        <div className="absolute bottom-12 right-12 flex items-center gap-4 rotate-90 origin-right">
          <div className="w-24 h-px bg-mango/10" />
          <div className="text-[10px] font-black uppercase text-mango/20 tracking-[0.5em]">End of Feed</div>
        </div>
      </div>
    </section>
  );
}

