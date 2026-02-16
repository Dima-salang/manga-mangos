
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
