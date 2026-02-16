"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Manga, JikanResponse } from "@/types/manga";

const GENRES = [
  "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi",
  "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai", "Josei", "Kids",
  "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police",
  "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai",
  "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural",
  "Thriller", "Vampire",
];

// Map genre names to Jikan genre IDs
const GENRE_MAP: Record<string, number> = {
  "Action": 1,
  "Adventure": 2,
  "Cars": 3,
  "Comedy": 4,
  "Dementia": 5,
  "Demons": 6,
  "Drama": 8,
  "Ecchi": 9,
  "Fantasy": 10,
  "Game": 11,
  "Harem": 35,
  "Historical": 13,
  "Horror": 14,
  "Isekai": 62,
  "Josei": 43,
  "Kids": 15,
  "Magic": 16,
  "Martial Arts": 17,
  "Mecha": 18,
  "Military": 38,
  "Music": 19,
  "Mystery": 7,
  "Parody": 20,
  "Police": 39,
  "Psychological": 40,
  "Romance": 22,
  "Samurai": 21,
  "School": 23,
  "Sci-Fi": 24,
  "Seinen": 42,
  "Shoujo": 25,
  "Shoujo Ai": 26,
  "Shounen": 27,
  "Shounen Ai": 28,
  "Slice of Life": 36,
  "Space": 29,
  "Sports": 30,
  "Super Power": 31,
  "Supernatural": 37,
  "Thriller": 41,
  "Vampire": 32,
};

export default function SearchPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<JikanResponse<Manga[]>["pagination"] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [sfw, setSfw] = useState(false);
  const [language, setLanguage] = useState("all");
  const [orderBy, setOrderBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [excludedGenres, setExcludedGenres] = useState<string[]>([]);
  const [letter, setLetter] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endDay, setEndDay] = useState("");

  // Build query params for API
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    
    params.append("page", currentPage.toString());
    params.append("limit", "25");
    
    // Type filter
    if (type !== "all") {
      params.append("type", type);
    }
    
    // Status filter
    if (status !== "all") {
      params.append("status", status);
    }
    
    // Score filters
    if (minScore) {
  params.append("min_score", minScore);
}
if (maxScore) {
  params.append("max_score", maxScore);
}
    
    // SFW filter
    if (sfw) {
      params.append("sfw", "true");
    }
    
    // Language filter (server-side only)
    if (language !== "all") {
      params.append("language", language);
    }
    
    // Order and sort (direct API parameters)
    if (orderBy) {
      params.append("order_by", orderBy);
    }
    if (sortOrder) {
      params.append("sort", sortOrder);
    }
    
    // Map genre names to IDs
    if (selectedGenres.length > 0) {
      const genreIds = selectedGenres
        .map((g) => GENRE_MAP[g])
        .filter((id) => id !== undefined)
        .join(",");
      if (genreIds) {
        params.append("genres", genreIds);
      }
    }
    
    // Excluded genres
    if (excludedGenres.length > 0) {
      const genreIds = excludedGenres
        .map((g) => GENRE_MAP[g])
        .filter((id) => id !== undefined)
        .join(",");
      if (genreIds) {
        params.append("genres_exclude", genreIds);
      }
    }
    
    // Letter filter
    if (letter && letter.length === 1) {
      params.append("letter", letter.toUpperCase());
    }
    
    // Build date range filter
    if (startYear || startMonth || startDay) {
      const dateParts = [];
      if (startYear) dateParts.push(startYear.padStart(4, "0"));
      if (startMonth) dateParts.push(startMonth.padStart(2, "0"));
      if (startDay) dateParts.push(startDay.padStart(2, "0"));
      if (dateParts.length > 0) {
        params.append("start_date", dateParts.join("-"));
      }
    }
    
    if (endYear || endMonth || endDay) {
      const dateParts = [];
      if (endYear) dateParts.push(endYear.padStart(4, "0"));
      if (endMonth) dateParts.push(endMonth.padStart(2, "0"));
      if (endDay) dateParts.push(endDay.padStart(2, "0"));
      if (dateParts.length > 0) {
        params.append("end_date", dateParts.join("-"));
      }
    }
    
    return params.toString();
  }, [currentPage, type, status, minScore, maxScore, sfw, language, orderBy, sortOrder, selectedGenres, excludedGenres, letter, startYear, startMonth, startDay, endYear, endMonth, endDay]);

  // Fetch manga from search API with filters
  useEffect(() => {
    async function loadManga() {
      setIsLoading(true);
      try {
        const queryString = buildSearchParams();
        const response = await fetch(`/api/manga/search?${queryString}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data: JikanResponse<Manga[]> = await response.json();
        setMangaList(data.data || []);
        setPagination(data.pagination);
      } catch (e) {
        console.error("Failed to load manga for search:", e);
        setMangaList([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadManga();
  }, [buildSearchParams]);

  const toggleGenre = (genre: string, exclude: boolean = false) => {
    if (exclude) {
      setExcludedGenres((prev) => {
        const newGenres = prev.includes(genre) 
          ? prev.filter((g) => g !== genre)
          : [...prev, genre];
        setCurrentPage(1);
        return newGenres;
      });
    } else {
      setSelectedGenres((prev) => {
        const newGenres = prev.includes(genre) 
          ? prev.filter((g) => g !== genre)
          : [...prev, genre];
        setCurrentPage(1);
        return newGenres;
      });
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tight mb-8">
          <span className="text-mango">/</span> Advanced Search
        </h1>

        {/* Filter row */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</span>
              <select value={type} onChange={(e) => { setType(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Type">
                <option value="all">All</option>
                <option value="manga">Manga</option>
                <option value="novel">Novel</option>
                <option value="lightnovel">Light Novel</option>
                <option value="oneshot">One-shot</option>
                <option value="doujin">Doujinshi</option>
                <option value="manhwa">Manhwa</option>
                <option value="manhua">Manhua</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
              <select value={status} onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Status">
                <option value="all">All</option>
                <option value="publishing">Publishing</option>
                <option value="complete">Complete</option>
                <option value="hiatus">Hiatus</option>
                <option value="discontinued">Discontinued</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min Score</span>
              <select value={minScore} onChange={(e) => { setMinScore(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Min Score">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="6">6+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
                <option value="9">9+</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Score</span>
              <select value={maxScore} onChange={(e) => { setMaxScore(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Max Score">
                <option value="">Any</option>
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
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SFW</span>
              <input type="checkbox" checked={sfw} onChange={(e) => { setSfw(e.target.checked); handleFilterChange(); }} className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Language</span>
              <select value={language} onChange={(e) => { setLanguage(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Language">
                <option value="all">All</option>
                <option value="english">English</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Letter</span>
              <input type="text" maxLength={1} placeholder="A-Z" value={letter} onChange={(e) => { setLetter(e.target.value.toUpperCase().replace(/[^A-Z]/g, "")); handleFilterChange(); }} className="input-filter w-16" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Date</span>
              <input type="text" placeholder="Year" value={startYear} onChange={(e) => { setStartYear(e.target.value); handleFilterChange(); }} className="input-filter w-16" />
              <input type="text" placeholder="Month" value={startMonth} onChange={(e) => { setStartMonth(e.target.value); handleFilterChange(); }} className="input-filter w-16" />
              <input type="text" placeholder="Day" value={startDay} onChange={(e) => { setStartDay(e.target.value); handleFilterChange(); }} className="input-filter w-14" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</span>
              <input type="text" placeholder="Year" value={endYear} onChange={(e) => { setEndYear(e.target.value); handleFilterChange(); }} className="input-filter w-16" />
              <input type="text" placeholder="Month" value={endMonth} onChange={(e) => { setEndMonth(e.target.value); handleFilterChange(); }} className="input-filter w-16" />
              <input type="text" placeholder="Day" value={endDay} onChange={(e) => { setEndDay(e.target.value); handleFilterChange(); }} className="input-filter w-14" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order By</span>
              <select value={orderBy} onChange={(e) => { setOrderBy(e.target.value); handleFilterChange(); }} className="select-filter" aria-label="Order By">
                <option value="">Default</option>
                <option value="mal_id">ID</option>
                <option value="title">Title</option>
                <option value="start_date">Start Date</option>
                <option value="end_date">End Date</option>
                <option value="chapters">Chapters</option>
                <option value="volumes">Volumes</option>
                <option value="score">Score</option>
                <option value="scored_by">Scored By</option>
                <option value="rank">Rank</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort</span>
              <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as "asc" | "desc" | ""); handleFilterChange(); }} className="select-filter" aria-label="Sort">
                <option value="">Default</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </section>

        {/* Genre tags */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Genres (Include)</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre, false)}
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Genres (Exclude)</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={`exclude-${genre}`}
                type="button"
                onClick={() => toggleGenre(genre, true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  excludedGenres.includes(genre)
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-white/5 text-foreground border border-white/10 hover:border-red-500/40 hover:bg-white/10"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">
            {pagination ? `${pagination.items.total.toLocaleString()} result${pagination.items.total !== 1 ? "s" : ""}` : "Loading…"}
          </span>
        </div>

        {/* Results grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <p className="col-span-full text-muted-foreground text-center py-12">Loading manga…</p>
          ) : (
            mangaList.map((manga) => (
              <MangaCard key={manga.mal_id} manga={manga} />
            ))
          )}
        </section>

        {!isLoading && mangaList.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No manga match your filters. Try adjusting or clearing some filters.</p>
        )}

        {/* Pagination */}
        {pagination && pagination.last_visible_page > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              variant="outline"
              className="bg-card border-white/10"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pagination.last_visible_page}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(pagination.last_visible_page, p + 1))}
              disabled={currentPage >= pagination.last_visible_page || isLoading}
              variant="outline"
              className="bg-card border-white/10"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function MangaCard({ manga }: { manga: Manga }) {
  const image = manga.images?.webp?.large_image_url;
  const genreName = manga.genres?.[0]?.name;
  const rating = manga.score ?? 0;
  const members = manga.members ?? 0;

  return (
    <Link href={`/manga/${manga.mal_id}/detail`}>
      <Card className="group relative overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md hover:border-mango/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer rounded-[1.5rem] shadow-lg hover:shadow-mango/5">
        <CardContent className="p-0">
          <div className="aspect-[3/4] relative m-2 overflow-hidden rounded-[1.2rem]">
            {image ? (
              <Image src={image} alt={manga.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-neutral-900/50 flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition-all duration-500">🥭</div>
            )}
            {genreName && (
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10">
                {genreName}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <Button className="w-full bg-mango text-white font-bold uppercase text-[10px] tracking-widest rounded-lg h-10">READ NOW</Button>
            </div>
          </div>
          <div className="px-5 pb-5 pt-3">
            <h3 className="font-bold text-lg mb-1.5 line-clamp-1 group-hover:text-mango transition-colors tracking-tight leading-tight">
              {manga.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed font-medium opacity-70">
              {manga.synopsis ?? ""}
            </p>
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="text-mango text-xs">★</span>
                <span className="text-foreground font-bold text-xs">{rating}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-50">{members.toLocaleString()} READ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
