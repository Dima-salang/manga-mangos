"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Star, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MangaSearchResult {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
    webp?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
}

export default function NewReviewPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedManga, setSelectedManga] = useState<MangaSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MangaSearchResult[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const searchManga = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/manga/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!response.ok) throw new Error('Failed to search manga');
      const data = await response.json();
      setSearchResults(data.data || []); // Access the data property from JikanResponse
    } catch (error) {
      toast.error('Failed to search manga');
    } finally {
      setSearchLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedManga || !reviewText.trim()) {
      toast.error('Please select a manga and write a review');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mal_id: selectedManga.mal_id,
          rating,
          review_text: reviewText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
      }

      toast.success('Review created successfully!');
      router.push('/reviews');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => interactive && setRating(i + 1)}
      />
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to write a review.
              </p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reviews" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Reviews
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Write a Review</h1>
        </div>

        <div className="space-y-6">
          {/* Manga Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Manga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && searchManga()}
                />
                <Button onClick={searchManga} disabled={searchLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((manga) => (
                    <div
                      key={manga.mal_id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedManga?.mal_id === manga.mal_id
                          ? 'border-mango bg-mango/10'
                          : 'border-gray-200 hover:border-mango/50'
                      }`}
                      onClick={() => setSelectedManga(manga)}
                    >
                      <div className="flex items-center gap-3">
                        {(manga.images?.webp?.image_url || manga.images?.jpg?.image_url) ? (
                          <img
                            src={manga.images?.webp?.image_url || manga.images?.jpg?.image_url}
                            alt={manga.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : null}
                        <div>
                          <h4 className="font-medium">{manga.title}</h4>
                          <p className="text-sm text-muted-foreground">ID: {manga.mal_id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Manga */}
          {selectedManga && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  {(selectedManga.images?.webp?.image_url || selectedManga.images?.jpg?.image_url) ? (
                    <img
                      src={selectedManga.images?.webp?.image_url || selectedManga.images?.jpg?.image_url}
                      alt={selectedManga.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  ) : null}
                  <div>
                    <h3 className="font-semibold">{selectedManga.title}</h3>
                    <p className="text-sm text-muted-foreground">MAL ID: {selectedManga.mal_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(rating, true)}
                </div>
                <span className="text-lg font-medium">{rating}/10</span>
              </div>
            </CardContent>
          </Card>

          {/* Review Text */}
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="review-text">Your thoughts</Label>
                <Textarea
                  id="review-text"
                  placeholder="Share your thoughts about this manga..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={8}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/reviews')}>
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  disabled={!selectedManga || !reviewText.trim() || loading}
                >
                  {loading ? 'Publishing...' : 'Publish Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
