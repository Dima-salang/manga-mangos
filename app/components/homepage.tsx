'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MANGA_DATA } from '@/app/lib/manga-data';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadTrendingManga(sortBy);
    loadRecommendedManga();
  }, [sortBy]);

  const loadTrendingManga = (sortType: string) => {
    // Import MANGA_DATA from data source
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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥭</span>
              <span className="font-bold text-xl">MangaMangos</span>
            </div>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex gap-8">
              <li><a href="/browse" className="text-blue-600">Browse</a></li>
              <li><a href="/search" className="hover:text-blue-600">Search</a></li>
              <li><a href="/library" className="hover:text-blue-600">Library</a></li>
              <li><a href="/reviews" className="hover:text-blue-600">Reviews</a></li>
              <li><a href="/assistant" className="hover:text-blue-600">Assistant</a></li>
              <li><a href="/profile" className="hover:text-blue-600">Profile</a></li>
              <li><button onClick={() => handleLogout()} className="hover:text-blue-600">Logout</button></li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 m-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Manga</h1>
        <p className="text-xl mb-8 opacity-90">Explore thousands of manga titles</p>
        <button 
          onClick={() => window.location.href = '/search'}
          className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-full font-semibold"
        >
          Start Exploring
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🔥 Trending Now</h2>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-4 py-2 dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>

        {/* Recommended Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">✨ Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Separate MangaCard component
function MangaCard({ manga }: { manga: Manga }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
        {manga.image ? (
          <Image src={manga.image} alt={manga.title} width={200} height={200} />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <h3 className="font-bold text-lg mb-2">{manga.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{manga.description}</p>
      <div className="flex justify-between text-sm">
        <span>⭐ {manga.rating}</span>
        <span>👁️ {manga.views}</span>
      </div>
    </div>
  );
}

// logout handler
function handleLogout() {
  // Implement logout logic
  console.log('Logging out...');
}