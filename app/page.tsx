'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.SubmitEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30" suppressHydrationWarning>
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" suppressHydrationWarning />
      
      <main className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        <div className="relative rounded-[2.5rem] p-12 mb-24 overflow-hidden border border-mango shadow-2xl bg-mango group">
          <div className="absolute inset-0 manga-grid opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-0 right-0 p-12 text-black/5 text-[15rem] font-black italic select-none pointer-events-none group-hover:translate-x-8 transition-transform duration-1000">
            MANGO
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight leading-[1.1] text-black">
              The Best <br/>
              <span className="font-black italic uppercase">Manga</span>
              <span className="font-serif italic opacity-40">Hub.</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-12 text-black/80 max-w-xl leading-relaxed font-medium">
              Track and discover your next favorite manga.
            </p>

              <div className="flex justify-center mb-12">
                <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Enter manga name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-black/20 bg-white/90 px-6 py-3 pr-12 text-black placeholder:text-black/40 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-black p-1 focus:outline-none"
                    aria-label="Search"
                  >
                    🔍
                  </button>
                </form>
              </div>
            
            <div className="flex flex-wrap gap-5">
              <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-900 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-black/20">
                <Link href="/browse">Browse Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl border-black/10 bg-black/5 text-black font-bold uppercase tracking-wider hover:bg-black/10 transition-all">
                Latest Updates {/* TODO: Link to updates page */}
              </Button>
            </div>
          </div>

          <div className="absolute right-12 bottom-12 hidden lg:block">
            <div className="flex flex-col gap-4 items-end opacity-40 group-hover:opacity-60 transition-opacity duration-500">
              <div className="text-6xl font-black italic uppercase leading-none text-black">🥭</div>
              <div className="text-[10px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-rl] text-black">MANGO_CORE</div>
            </div>
          </div>
        </div>

        <div>
          {/* TODO: Write Website Info*/}
        </div>
      </main>
    </div>
  );
}
