"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Manga, JikanResponse } from "@/types/manga";
import { MangaCard, MangaCardSkeleton } from "@/components/manga-card";
import { Search, SlidersHorizontal, Star, Users, ArrowUp } from "lucide-react";

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
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tight mb-8">
          <span className="text-mango">/</span> Advanced Search
        </h1>
        <div className="text-center py-12 text-muted-foreground">Initializing search…</div>
      </main>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const initialQuery = searchParams.get("q") || "";

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
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Sync searchQuery when URL changes (e.g. from back/forward nav)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Update URL when debounced query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    
    // Only push if different to avoid infinite loops or unnecessary history state
    const currentQ = searchParams.get("q") || "";
    if (debouncedQuery !== currentQ) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, pathname, router, searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query params for API
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    
    params.append("page", currentPage.toString());
    params.append("limit", "25");
    
    const addQueryParam = (key: string, value: string | null | undefined) => {
      if (value?.trim() && value !== "all" && value !== "default") {
        params.append(key, value.trim());
      }
    };

    addQueryParam("q", debouncedQuery);
    addQueryParam("type", type);
    addQueryParam("status", status);
    addQueryParam("min_score", minScore);
    addQueryParam("max_score", maxScore);
    addQueryParam("order_by", orderBy);
    addQueryParam("sort", sortOrder);
    addQueryParam("language", language);

    if (sfw) params.append("sfw", "true");
    if (letter?.length === 1) params.append("letter", letter.toUpperCase());

    const getGenreIds = (genres: string[]) => 
      genres.map(g => GENRE_MAP[g]).filter(id => id !== undefined).join(",");

    const includeIds = getGenreIds(selectedGenres);
    if (includeIds) params.append("genres", includeIds);

    const excludeIds = getGenreIds(excludedGenres);
    if (excludeIds) params.append("genres_exclude", excludeIds);

    const buildDateStr = (y: string, m: string, d: string) => {
      const parts = [];
      if (y) parts.push(y.padStart(4, "0"));
      if (m) parts.push(m.padStart(2, "0"));
      if (d) parts.push(d.padStart(2, "0"));
      return parts.length > 0 ? parts.join("-") : null;
    };

    const startDate = buildDateStr(startYear, startMonth, startDay);
    if (startDate) params.append("start_date", startDate);

    const endDate = buildDateStr(endYear, endMonth, endDay);
    if (endDate) params.append("end_date", endDate);
    
    return params.toString();
  }, [currentPage, type, status, minScore, maxScore, sfw, language, orderBy, sortOrder, selectedGenres, excludedGenres, letter, startYear, startMonth, startDay, endYear, endMonth, endDay, debouncedQuery]);

  // Fetch manga from search API with filters
  useEffect(() => {
    const controller = new AbortController();
    
    async function loadManga() {
      setIsLoading(true);
      try {
        const queryString = buildSearchParams();
        const response = await fetch(`/api/manga/search?${queryString}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data: JikanResponse<Manga[]> = await response.json();
        setMangaList(data.data || []);
        setPagination(data.pagination);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Failed to load manga for search:", err);
        setMangaList([]);
        setPagination(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadManga();
    return () => controller.abort();
  }, [buildSearchParams]);

  const scrollToResults = () => {
    if (resultsRef.current) {
      const offset = 140; // Account for sticky header and navbar
      const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isDebouncing = searchQuery !== debouncedQuery;
  const isSearching = isLoading || isDebouncing;

  const includeGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre];
      setCurrentPage(1);
      return newGenres;
    });
  };

  const excludeGenre = (genre: string) => {
    setExcludedGenres((prev) => {
      const newGenres = prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre];
      setCurrentPage(1);
      return newGenres;
    });
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-4">
          <span className="text-mango">#</span> Search <span className="text-muted-foreground/20 italic font-light">&</span> Discovery
        </h1>

        {/* Sticky Search Bar */}
        <section className="sticky top-20 z-40 bg-background/60 backdrop-blur-xl py-6 -mx-4 px-4 border-b border-white/5 shadow-2xl transition-all duration-300 mb-12">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="relative group/search">
               <div className="absolute -inset-1 bg-gradient-to-r from-mango/30 to-mango/10 rounded-2xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition duration-700" />
               <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within/search:text-mango transition-colors" />
                <Input
                  type="text"
                  placeholder="Scan archives by title, creator, or keywords..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                  className="w-full bg-background border-white/10 pl-14 h-16 text-xl rounded-2xl focus-visible:ring-mango/40 focus-visible:border-mango/60 transition-all placeholder:text-muted-foreground/30 font-bold"
                  aria-label="Search archives"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   {isSearching && (
                     <div className="w-8 h-8 rounded-full border-2 border-mango/20 border-t-mango animate-spin" />
                   )}
                   <Button size="icon" className="bg-mango hover:bg-mango/80 text-white rounded-xl h-10 w-10 shadow-lg shadow-mango/20">
                     <ArrowUp className="w-5 h-5 rotate-90" />
                   </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-12 space-y-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-mango" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Search Refinement</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Type</Label>
              <Select value={type} onValueChange={(val) => { setType(val); handleFilterChange(); }}>
                <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="novel">Novel</SelectItem>
                  <SelectItem value="lightnovel">Light Novel</SelectItem>
                  <SelectItem value="oneshot">One-shot</SelectItem>
                  <SelectItem value="doujin">Doujinshi</SelectItem>
                  <SelectItem value="manhwa">Manhwa</SelectItem>
                  <SelectItem value="manhua">Manhua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Status</Label>
              <Select value={status} onValueChange={(val) => { setStatus(val); handleFilterChange(); }}>
                <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="publishing">Publishing</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="hiatus">Hiatus</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Min Score</Label>
              <Select value={minScore || "any"} onValueChange={(val) => { setMinScore(val === "any" ? "" : val); handleFilterChange(); }}>
                <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Score</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                    <SelectItem key={s} value={s.toString()}>{s}+</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Max Score</Label>
              <Select value={maxScore || "any"} onValueChange={(val) => { setMaxScore(val === "any" ? "" : val); handleFilterChange(); }}>
                <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Score</SelectItem>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                    <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Content</Label>
              <div className="flex items-center gap-3 h-10 px-4 bg-card/50 border border-white/10 rounded-lg">
                <Checkbox id="sfw-filter" checked={sfw} onCheckedChange={(checked) => { setSfw(!!checked); handleFilterChange(); }} />
                <Label htmlFor="sfw-filter" className="text-xs font-bold uppercase tracking-widest cursor-pointer">SFW Only</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Language</Label>
              <Select value={language} onValueChange={(val) => { setLanguage(val); handleFilterChange(); }}>
                <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Filter by Letter</Label>
              <Input
                maxLength={1}
                placeholder="A-Z"
                value={letter}
                onChange={(e) => { 
                  setLetter(e.target.value.toUpperCase().replaceAll(/[^A-Z]/g, "")); 
                  handleFilterChange(); 
                }}
                className="bg-card/50 border-white/10 h-10 text-center uppercase font-bold"
              />
            </div>
          </div>

          <Separator className="bg-white/5" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Start Date (Y/M/D)</Label>
              <div className="flex gap-2">
                <Input placeholder="YYYY" value={startYear} onChange={(e) => { setStartYear(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10" />
                <Input placeholder="MM" value={startMonth} onChange={(e) => { setStartMonth(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10 w-20" />
                <Input placeholder="DD" value={startDay} onChange={(e) => { setStartDay(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10 w-20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">End Date (Y/M/D)</Label>
              <div className="flex gap-2">
                <Input placeholder="YYYY" value={endYear} onChange={(e) => { setEndYear(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10" />
                <Input placeholder="MM" value={endMonth} onChange={(e) => { setEndMonth(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10 w-20" />
                <Input placeholder="DD" value={endDay} onChange={(e) => { setEndDay(e.target.value); handleFilterChange(); }} className="bg-card/50 border-white/10 h-10 w-20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Order By</Label>
                <Select value={orderBy || "default"} onValueChange={(val) => { setOrderBy(val === "default" ? "" : val); handleFilterChange(); }}>
                  <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="start_date">Start Date</SelectItem>
                    <SelectItem value="chapters">Chapters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Sort</Label>
                <Select value={sortOrder || "default"} onValueChange={(val) => { setSortOrder((val === "default" ? "" : val) as any); handleFilterChange(); }}>
                  <SelectTrigger className="bg-card/50 border-white/10 h-10 rounded-lg">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Genre filters */}
        <section className="mb-12 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Include Genres</h2>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className={cn(
                    "h-8 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border-white/10",
                    selectedGenres.includes(genre)
                      ? "bg-mango text-white hover:bg-mango/80"
                      : "bg-white/5 hover:bg-white/10 hover:border-mango/40 text-muted-foreground"
                  )}
                  onClick={() => includeGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Exclude Genres</h2>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <Badge
                  key={`exclude-${genre}`}
                  variant={excludedGenres.includes(genre) ? "destructive" : "outline"}
                  className={cn(
                    "h-8 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border-white/10",
                    excludedGenres.includes(genre)
                      ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
                      : "bg-white/5 hover:bg-white/10 hover:border-red-500/40 text-muted-foreground"
                  )}
                  onClick={() => excludeGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <div ref={resultsRef} className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 space-x-4">
            {pagination ? (
              <>
                <span className="text-mango">{pagination.items.total.toLocaleString()}</span> 
                <span>Results</span>
              </>
            ) : "Getting results…"}
          </div>

          <div className="flex items-center gap-3">
             <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-mango transition-all duration-1000" 
                   style={{ width: pagination ? `${(currentPage / pagination.last_visible_page) * 100}%` : '0%' }} 
                />
             </div>
             <span className="text-[9px] font-black italic opacity-30">
                L-{currentPage.toString().padStart(2, '0')}
             </span>
          </div>
        </div>

        {/* Results grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {isSearching ? (
             ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8", "sk9", "sk10", "sk11", "sk12"].map((id) => (
                <MangaCardSkeleton key={id} />
             ))
          ) : (
            mangaList.map((manga) => (
              <MangaCard key={manga.mal_id} manga={manga} />
            ))
          )}
        </section>

        {!isSearching && mangaList.length === 0 && (
          <div className="text-center py-40 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] group hover:border-mango/20 transition-colors duration-700">
            <div className="text-8xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-700 scale-90 group-hover:scale-100 opacity-20 group-hover:opacity-100 font-black italic">!</div>
            <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">No direct matches found</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 mt-4 leading-relaxed">
              Try broadening your refinement parameters <br/> or scanning for alternate genres
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_visible_page > 1 && (
          <div className="mt-20 pb-32">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-2">
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage > 1) {
                        setCurrentPage(p => p - 1);
                        scrollToResults();
                      }
                    }}
                    className={cn(
                      "bg-white/5 border-white/10 rounded-xl hover:bg-mango hover:text-white transition-all font-black uppercase text-[10px] tracking-widest",
                      currentPage === 1 && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
                
                {/* Logic for page numbers */}
                {Array.from({ length: Math.min(5, pagination.last_visible_page) }).map((_, i) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= pagination.last_visible_page - 2) pageNum = pagination.last_visible_page - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > pagination.last_visible_page) return null;

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(pageNum); scrollToResults(); }}
                        isActive={currentPage === pageNum}
                        className={cn(
                          "w-12 h-12 rounded-xl transition-all font-black italic",
                          currentPage === pageNum 
                            ? "bg-mango text-white border-mango scale-110 shadow-lg shadow-mango/20" 
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {pagination.last_visible_page > 5 && currentPage < pagination.last_visible_page - 2 && (
                  <>
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(pagination.last_visible_page); scrollToResults(); }}
                        className="bg-white/5 border-white/10 rounded-xl w-12 h-12 font-black italic"
                      >
                        {pagination.last_visible_page}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage < pagination.last_visible_page) {
                        setCurrentPage(p => p + 1);
                        scrollToResults();
                      }
                    }}
                    className={cn(
                      "bg-white/5 border-white/10 rounded-xl hover:bg-mango hover:text-white transition-all font-black uppercase text-[10px] tracking-widest",
                      currentPage === pagination.last_visible_page && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}

