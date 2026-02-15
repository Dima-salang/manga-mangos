
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { MANGA_DATA, Manga as LocalManga } from '@/lib/manga-data';
import { JikanManga, JikanResponse, MangaType, TopMangaFilter } from '@/types/manga';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Manga {
  id: number;
  genres: string[];
  views: number;
  rating: number;
  title: string;
  image?: string;
  description?: string;
}

export default function BrowsePage() {
  const [trendingManga, setTrendingManga] = useState<JikanManga[]>([]);
  const [recommendedManga, setRecommendedManga] = useState<Manga[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrendingManga(sortBy);
    loadRecommendedManga();
  }, [sortBy]);

  const loadTrendingManga = async (sortType: string) => {
    setIsLoading(true);
    try {
      let filter = TopMangaFilter.BY_POPULARITY;
      if (sortType === 'rating') {
        filter = TopMangaFilter.FAVORITE;
      }
      
      const response = await fetch(`/api/manga/top?type=${MangaType.MANGA}&filter=${filter}&limit=6`);
      const data: JikanResponse<JikanManga[]> = await response.json();
      setTrendingManga(data.data || []);
    } catch (error) {
      console.error("Failed to load trending manga:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendedManga = () => {
    const recommended = MANGA_DATA.filter((m: LocalManga) => 
      m.genres.some((g: string) => ['Action', 'Adventure', 'Fantasy'].includes(g))
    );
    setRecommendedManga(recommended.slice(0, 6));
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />

      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">🥭</div>
              <span className="font-black text-2xl tracking-tighter italic uppercase text-foreground">
                Manga<span className="text-mango">Mangos</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <ul className="flex gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                <li><Link href="/browse" className="hover:text-mango transition-colors">Browse</Link></li>
                <li><Link href="/search" className="hover:text-mango transition-colors">Search</Link></li>
                <li><Link href="/library" className="hover:text-mango transition-colors">Library</Link></li>
                <li><Link href="/assistant" className="hover:text-mango transition-colors">Assistant</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

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
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border-2 border-primary/20 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-primary transition-all outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              new Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-[1.5rem] bg-card/20 animate-pulse border border-white/5" />
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
            {recommendedManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
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

function MangaCard({ manga }: { manga: Manga | JikanManga }) {
  // Normalize types
  const isJikan = (m: any): m is JikanManga => 'mal_id' in m;
  
  const id = isJikan(manga) ? manga.mal_id : manga.id;
  const title = manga.title;
  const genres = isJikan(manga) ? manga.genres.map(g => g.name) : manga.genres;
  const rating = isJikan(manga) ? manga.score || 0 : manga.rating;
  const views = isJikan(manga) ? manga.members || 0 : manga.views;
  const image = isJikan(manga) ? manga.images.webp.large_image_url : manga.image;
  const description = isJikan(manga) ? manga.synopsis : manga.description;

  return (
    <Card className="group relative overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md hover:border-mango/40 transition-all duration-700 hover:-translate-y-4 cursor-pointer rounded-[2rem] shadow-xl hover:shadow-mango/10">
      <CardContent className="p-0">
        <div className="aspect-[3/4.2] relative m-3 overflow-hidden rounded-[1.6rem]">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
          ) : (
            <div className="w-full h-full bg-neutral-900/50 flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition-all duration-500">🥭</div>
          )}
          
          {/* Genre Bagde */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-black/60 backdrop-blur-lg text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-lg">
              {genres[0]}
            </div>
            {isJikan(manga) && (
              <div className="bg-mango text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                {manga.type}
              </div>
            )}
          </div>

          {/* Read Now Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
             <Button className="w-full bg-mango text-black font-black uppercase text-[10px] tracking-widest rounded-xl h-12 hover:bg-white transition-colors border-0">
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
              <span className="text-foreground font-black text-[10px]">{rating}</span>
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
                 {views.toLocaleString()} Active Readers
               </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}