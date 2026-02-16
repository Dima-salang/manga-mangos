
"use client";

import { useState, useEffect } from 'react';
import { Manga, JikanResponse, MangaTypeFilter, TopMangaFilter } from '@/types/manga';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MangaCard, MangaCardSkeleton } from "@/components/manga-card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";




export default function BrowsePage() {
  const [trendingManga, setTrendingManga] = useState<Manga[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrendingManga(sortBy);
  }, [sortBy]);

  const loadTrendingManga = async (sortType: string) => {
    setIsLoading(true);
    try {
      let filter = TopMangaFilter.BY_POPULARITY;
      if (sortType === 'rating') {
        filter = TopMangaFilter.FAVORITE;
      }
      
      const response = await fetch(`/api/manga/top?type=${MangaTypeFilter.MANGA}&filter=${filter}&limit=6`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`API Error (${response.status}):`, text.slice(0, 100));
        throw new Error(`Failed to fetch trending manga: ${response.status}`);
      }

      const data: JikanResponse<Manga[]> = await response.json();
      setTrendingManga(data.data || []);
    } catch (error) {
      console.error("Failed to load trending manga:", error);
      toast.error("Failed to load trending manga. Please try again later.", {
        description: "The API might be rate-limited or experiencing issues.",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30" suppressHydrationWarning>
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" suppressHydrationWarning />


      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="relative rounded-[2.5rem] p-12 md:p-20 mb-24 overflow-hidden border border-mango shadow-2xl bg-mango group">
          <div className="absolute inset-0 manga-grid opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-0 right-0 p-12 text-black/5 text-[15rem] font-black italic select-none pointer-events-none group-hover:translate-x-8 transition-transform duration-1000">
            MANGO
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight leading-[1.1] text-black">
              The Best <br/>
              <span className="font-black italic uppercase">Manga</span>
              <span className="font-serif italic opacity-40">Hub.</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-12 text-black/80 max-w-xl leading-relaxed font-medium">
              Track and discover your favorite next favorite manga.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Button size="lg" className="h-14 px-10 rounded-xl bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-900 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-black/20">
                Browse Now
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl border-black/10 bg-black/5 text-black font-bold uppercase tracking-wider hover:bg-black/10 transition-all">
                Latest Updates
              </Button>
            </div>
          </div>

          <div className="absolute right-12 bottom-12 hidden lg:block">
            <div className="flex flex-col gap-4 items-end opacity-40 group-hover:opacity-60 transition-opacity duration-500">
              <div className="text-6xl font-black italic uppercase leading-none text-black">🥭</div>
              <div className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-black">MANGO_CORE</div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12 border-b-4 border-primary/20 pb-6">
            <h2 className="text-4xl font-black italic uppercase tracking-tight">
              <span className="text-mango mr-2">/</span>Trending Now
            </h2>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] bg-card border-2 border-primary/20 rounded-xl font-bold h-11 focus:ring-2 focus:ring-primary transition-all" suppressHydrationWarning>
                  <SelectValue placeholder="Sort by" suppressHydrationWarning />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-primary/20 rounded-xl overflow-hidden backdrop-blur-xl">
                  <SelectItem value="popularity" className="font-bold hover:bg-mango/10 focus:bg-mango/10 transition-colors">Popularity</SelectItem>
                  <SelectItem value="rating" className="font-bold hover:bg-mango/10 focus:bg-mango/10 transition-colors">Rating</SelectItem>
                  <SelectItem value="recent" className="font-bold hover:bg-mango/10 focus:bg-mango/10 transition-colors">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              ['s1', 's2', 's3', 's4', 's5', 's6'].map((key) => (
                <MangaCardSkeleton key={key} />
              ))
            ) : (
              trendingManga.map(manga => (
                <MangaCard key={manga.mal_id} manga={manga} />
              ))
            )}
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-12 border-b-4 border-mango-secondary/20 pb-6">
            <h2 className="text-4xl font-black italic uppercase tracking-tight">
              <span className="text-mango mr-2">/</span>Recommended
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            { /* placeholder */}
            {trendingManga.slice(0, 3).map(manga => (
              <MangaCard key={`rec-${manga.mal_id}`} manga={manga} />
            ))}
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5 opacity-30 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap animate-pulse">
           CHAPTER 01 VOLUME 01 CHAPTER 01 VOLUME 01
        </div>
      </footer>
    </div>
  );
}
