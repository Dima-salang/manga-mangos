'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DiceIcon } from "@/components/icons/dice-icon";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 animate-in fade-in slide-in-from-left duration-1000" suppressHydrationWarning>
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

              <div className="flex justify-start mb-16">
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl group/search">
                  {/* Decorative focus glow */}
                  <div className="absolute -inset-1 bg-black/20 rounded-2xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition duration-700" />
                  
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 group-focus-within/search:text-black transition-colors" />
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search for manga..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-16 rounded-2xl border-black/10 bg-white/90 pl-14 pr-20 text-black text-xl font-bold placeholder:text-black/30 placeholder:italic transition-all shadow-2xl focus-visible:ring-black/10 focus-visible:border-black/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => globalThis.location.href = '/api/manga/random'}
                        className="h-10 px-4 rounded-xl hover:bg-black/5 text-black/60 hover:text-black transition-all flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest group/random"
                        aria-label="Surprise Me"
                      >
                        <span className="opacity-40 group-hover/random:opacity-100 group-hover/random:rotate-180 transition-all duration-500">
                          <DiceIcon className="w-4 h-4" />
                        </span>
                        <span className="hidden sm:inline">Surprise Me</span>
                      </Button>
                      <Kbd className="bg-black/5 border-black/10 text-black/40 text-[10px] h-7 px-2 font-black hidden md:flex">
                        <span className="text-xs opacity-40 mr-1">⌘</span>K
                      </Kbd>
                      <button
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white hover:bg-black/90 transition-all shadow-lg shadow-black/20"
                        aria-label="Search"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      </button>
                    </div>
                  </div>
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

        <div className="justify-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1500">
          <h2 className="text-center text-5xl font-black uppercase tracking-tight mb-8">
            About MangaMangos
          </h2>
          <p className="text-justify text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            MangaMangos is an AI-powered manga review and discovery platform. It does not host or stream manga. Instead, it centralizes community reviews, ratings, summaries, and recommendations, then redirects readers to official, legal publishers.
          </p>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            What is MangaMangos?
          </h2>
          <p className="text-justify text-lg md:text-xl mb-4 font-black/80 leading-relaxed font-medium">
            MangaMangos is a community-driven manga hub enhanced by an AI assistant.<br></br>
            Users can:
          </p>
          <ul className="mx-auto mb-16 list-disc list-inside text-lg md:text-xl space-y-2">
            <li>Browse manga by genre, rating, and trends</li>
            <li>Read and write reviews</li>
            <li>Maintain personal reading lists</li>
            <li>Get AI-generated summaries and recommendations</li>
            <li>Access verified links to legal manga sources</li>
          </ul>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            Does MangaMangos host manga chapters?
          </h2>
          <p className="text-center text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            <span className="font-bold text-2xl">No.</span><br></br>
            MangaMangos does not upload, mirror, or distribute manga files.<br></br>
            All reading happens on external, official publisher platforms.
          </p>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            Where does MangaMangos link readers to?
          </h2>
          <p className="text-justify text-lg md:text-xl mb-4 font-black/80 leading-relaxed font-medium">
            MangaMangos guides users toward established, legal publishers such as:
          </p>
          <ul className="mx-auto mb-12 list-disc list-inside text-lg md:text-xl space-y-2">
            <li>VIZ Media</li>
            <li>Webtoon</li>
            <li>Manga Plus</li>
          </ul>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            Is MangaMangos safe to use?
          </h2>
          <p className="text-justify text-lg md:text-xl mb-4 font-black/80 leading-relaxed font-medium">
            Yes, with standard web precautions.
          </p>
          <ul className="mx-auto mb-12 list-disc list-inside text-lg md:text-xl space-y-2">
            <li>No forced downloads</li>
            <li>No sketchy players or embeds</li>
            <li>No third-party streaming scripts</li>
          </ul>
          <p className="text-justify text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            Account security and data handling follow modern web standards. You are not exposed to the risks you would find on pirate streaming sites.
          </p>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            Do I need to install an app?
          </h2>
          <p className="text-center text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            <span className="font-bold text-2xl">No.</span><br></br>
            MangaMangos is fully web-based, responsive, and works on desktop and mobile browsers. Any app claiming to be “official” is fake.
          </p>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            Is MangaMangos free?
          </h2>
          <p className="text-center text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            <span className="font-bold text-2xl">Yes.</span><br></br>
            Core features: reviews, discovery, AI summaries, and legal redirects, are available without payment.
          </p>

          <h2 className="text-center text-3xl font-black uppercase tracking-tight mb-8">
            What if a manga title is missing?
          </h2>
          <p className="text-center text-lg md:text-xl mb-12 font-black/80 leading-relaxed font-medium">
            Missing titles can be requested.<br></br>
            If a manga exists on a legal platform, it can be indexed and linked.
          </p>
        </div>
      </main>
    </div>
  );
}
