'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
                      <Kbd className="bg-black/5 border-black/10 text-black/40 text-[10px] h-7 px-2 font-black">
                        <span className="text-xs opacity-40">⌘</span>K
                      </Kbd>
                      <button
                        type="submit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
                        aria-label="Search"
                      >
                         <span className="text-xl rotate-90 scale-x-[-1] inline-block opacity-40 group-focus-within/search:opacity-100 transition-opacity">↳</span>
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

        <div>
          {/* TODO: Write Website Info*/}
        </div>
      </main>
    </div>
  );
}
