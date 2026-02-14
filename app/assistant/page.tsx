"use client";

import Link from "next/link";

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="text-3xl transition-transform group-hover:rotate-12 duration-300">🥭</div>
              <span className="font-black text-2xl tracking-tighter italic uppercase text-foreground">
                Manga<span className="text-mango">Mangos</span>
              </span>
            </Link>
            <ul className="flex gap-8 font-bold text-xs uppercase tracking-widest text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
              <li><Link href="/library" className="hover:text-primary transition-colors">Library</Link></li>
              <li><Link href="/assistant" className="text-primary">Assistant</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tight mb-4">
          <span className="text-mango">/</span> Assistant
        </h1>
        <p className="text-muted-foreground">Manga assistant — more content coming soon.</p>
      </main>
    </div>
  );
}
