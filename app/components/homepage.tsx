
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { MANGA_DATA } from '@/lib/manga-data';
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
  const [trendingManga, setTrendingManga] = useState<Manga[]>([]);
  const [recommendedManga, setRecommendedManga] = useState<Manga[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    loadTrendingManga(sortBy);
    loadRecommendedManga();
  }, [sortBy]);

  const loadTrendingManga = (sortType: string) => {
    let sorted = [...MANGA_DATA];
    switch(sortType) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        sorted.sort((a, b) => b.views - a.views);
    }
    setTrendingManga(sorted.slice(0, 6));
  };

  const loadRecommendedManga = () => {
    const recommended = MANGA_DATA.filter(m => 
      m.genres.some(g => ['Action', 'Adventure', 'Fantasy'].includes(g))
    );
    setRecommendedManga(recommended.slice(0, 6));
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />

      {/* Modern Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-3xl transition-transform group-hover:rotate-12 duration-300">🥭</div>
              <span className="font-black text-2xl tracking-tighter italic uppercase text-foreground">
                Manga<span className="text-mango">Mangos</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <ul className="flex gap-8 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse</Link></li>
                <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
                <li><Link href="/library" className="hover:text-primary transition-colors">Library</Link></li>
                <li><Link href="/assistant" className="hover:text-primary transition-colors">Assistant</Link></li>
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

          {/* Minimalist Side Decoration */}
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
            {trendingManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
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

      {/* Footer Decoration */}
      <footer className="py-24 border-t border-white/5 opacity-30 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap animate-pulse">
           CHAPTER 01 VOLUME 01 CHAPTER 01 VOLUME 01
        </div>
      </footer>
    </div>
  );
}

function MangaCard({ manga }: { manga: Manga }) {
  return (
    <Card className="group relative overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md hover:border-mango/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer rounded-[1.5rem] shadow-lg hover:shadow-mango/5">
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative m-2 overflow-hidden rounded-[1.2rem]">
          {manga.image ? (
            <Image src={manga.image} alt={manga.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-neutral-900/50 flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition-all duration-500">🥭</div>
          )}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10">
            {manga.genres[0]}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
             <Button className="w-full bg-mango text-white font-bold uppercase text-[10px] tracking-widest rounded-lg h-10">READ NOW</Button>
          </div>
        </div>
        <div className="px-5 pb-5 pt-3">
          <h3 className="font-bold text-lg mb-1.5 line-clamp-1 group-hover:text-mango transition-colors tracking-tight leading-tight">
            {manga.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed font-medium opacity-70">
            {manga.description}
          </p>
          <div className="flex justify-between items-center pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-mango text-xs">★</span>
              <span className="text-foreground font-bold text-xs">{manga.rating}</span>
            </div>
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-50">{manga.views.toLocaleString()} VIEWS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}