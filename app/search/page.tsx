"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MANGA_DATA } from "@/lib/manga-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GENRES = [
  "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi",
  "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai", "Josei", "Kids",
  "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police",
  "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai",
  "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural",
  "Thriller", "Vampire",
];

type Manga = (typeof MANGA_DATA)[number];

export default function SearchPage() {
  const [status, setStatus] = useState("all");
  const [rated, setRated] = useState("all");
  const [score, setScore] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endDay, setEndDay] = useState("");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const applyFilters = () => {
    // Filters are applied in useMemo below; this button can reset or trigger UI feedback if needed
  };

  const filteredAndSortedManga = useMemo(() => {
    let list = [...MANGA_DATA];

    // Genre filter: manga must include ALL selected genres
    if (selectedGenres.length > 0) {
      list = list.filter((m) =>
        selectedGenres.every((g) => m.genres.includes(g))
      );
    }

    // Score filter (rating in our data)
    if (score !== "all") {
      const minScore = Number(score);
      list = list.filter((m) => m.rating >= minScore);
    }

    switch (sort) {
      case "recently-added":
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "recently-updated":
        list.sort((a, b) => b.id - a.id);
        break;
      case "score":
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name-az":
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "released-date":
        list.sort((a, b) => b.id - a.id);
        break;
      case "most-watched":
      case "popularity":
        list.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return list;
  }, [selectedGenres, score, sort]);

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
              <li><Link href="/search" className="text-primary">Search</Link></li>
              <li><Link href="/library" className="hover:text-primary transition-colors">Library</Link></li>
              <li><Link href="/assistant" className="hover:text-primary transition-colors">Assistant</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tight mb-8">
          <span className="text-mango">/</span> Advanced Search
        </h1>

        {/* Filter row */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="select-filter" aria-label="Status">
                <option value="all">All</option>
                <option value="finished">Finished</option>
                <option value="currently-ongoing">Currently ongoing</option>
                <option value="coming-soon">Coming soon</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rated</span>
              <select value={rated} onChange={(e) => setRated(e.target.value)} className="select-filter" aria-label="Rated">
                <option value="all">All</option>
                <option value="g">G</option>
                <option value="pg">PG</option>
                <option value="pg-13">PG-13</option>
                <option value="r">R</option>
                <option value="r+">R+</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Score</span>
              <select value={score} onChange={(e) => setScore(e.target.value)} className="select-filter" aria-label="Score">
                <option value="all">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="select-filter" aria-label="Language">
                <option value="all">All</option>
                <option value="japanese">Japanese</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Date</span>
              <input type="text" placeholder="Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="input-filter w-16" />
              <input type="text" placeholder="Month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="input-filter w-16" />
              <input type="text" placeholder="Day" value={startDay} onChange={(e) => setStartDay(e.target.value)} className="input-filter w-14" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</span>
              <input type="text" placeholder="Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="input-filter w-16" />
              <input type="text" placeholder="Month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="input-filter w-16" />
              <input type="text" placeholder="Day" value={endDay} onChange={(e) => setEndDay(e.target.value)} className="input-filter w-14" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-filter" aria-label="Sort">
                <option value="default">Default</option>
                <option value="recently-added">Recently Added</option>
                <option value="recently-updated">Recently Updated</option>
                <option value="score">Score</option>
                <option value="name-az">Name A-Z</option>
                <option value="released-date">Released Date</option>
                <option value="most-watched">Most Watched</option>
              </select>
            </div>
          </div>
        </section>

        {/* Genre tags */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Genre</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGenres.includes(genre)
                    ? "bg-mango text-white"
                    : "bg-white/5 text-foreground border border-white/10 hover:border-mango/40 hover:bg-white/10"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={applyFilters}
            className="bg-mango hover:bg-mango/90 text-white font-bold uppercase tracking-widest rounded-lg px-8 py-3"
          >
            Filter
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedManga.length} result{filteredAndSortedManga.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Results grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedManga.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </section>

        {filteredAndSortedManga.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No manga match your filters. Try adjusting or clearing some filters.</p>
        )}
      </main>
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
