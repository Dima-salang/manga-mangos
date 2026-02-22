"use client";

import { useState, useEffect } from 'react';
import { Manga, JikanResponse, MangaTypeFilter, TopMangaFilter } from '@/types/manga';
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const DecorativeReviews = dynamic(
  () => import("@/components/manga/decorative-reviews").then((mod) => mod.DecorativeReviews),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center"><Loader2 className="animate-spin text-mango" size={32} /></div>
  }
);

const TrendingHeroCarousel = dynamic(
  () => import("@/components/manga/trending-hero-carousel").then((mod) => mod.TrendingHeroCarousel),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-card/10 rounded-[2.5rem] mb-16 animate-pulse" />
  }
);

const GenreSectionCarousel = dynamic(
  () => import("@/components/manga/genre-section-carousel").then((mod) => mod.GenreSectionCarousel),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-card/5 rounded-3xl mb-24 animate-pulse" />
  }
);

const CommunityRecommendations = dynamic(
  () => import("@/components/manga/community-recommendations").then((mod) => mod.CommunityRecommendations),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-card/10 rounded-[2.5rem] mb-16 animate-pulse" />
  }
);

const SECTIONS = ["Action", "Shounen", "Romance", "Fantasy", "Horror"];

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
      
      const response = await fetch(`/api/manga/top?type=${MangaTypeFilter.MANGA}&filter=${filter}&limit=10`);
      
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
          
          <TrendingHeroCarousel mangaList={trendingManga} isLoading={isLoading} />
        </section>

        <GenreSectionCarousel genreName="Action" />
        <GenreSectionCarousel genreName="Romance" />
        <GenreSectionCarousel genreName="Comedy" />
        <GenreSectionCarousel genreName="Fantasy" />

        <DecorativeReviews />
        <CommunityRecommendations />

        <GenreSectionCarousel genreName="Shounen" />
        <GenreSectionCarousel genreName="Adventure" />
        <GenreSectionCarousel genreName="Sci-Fi" />
        <GenreSectionCarousel genreName="Horror" />
        <GenreSectionCarousel genreName="Mystery" />
        <GenreSectionCarousel genreName="Supernatural" />
      </main>

      <footer className="py-24 border-t border-white/5 opacity-30 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap animate-pulse">
           CHAPTER 01 VOLUME 01 CHAPTER 01 VOLUME 01
        </div>
      </footer>
    </div>
  );
}
