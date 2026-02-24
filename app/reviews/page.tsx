"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ReviewWithManga, MangaTitle } from '@/types/review';
import { renderStars, getMangaTitle } from '@/utils/reviewUtils';

export default function ReviewsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mangaCache, setMangaCache] = useState<Map<number, any>>(new Map());

  const fetchMangaDetails = async (malId: number) => {
    if (mangaCache.has(malId)) {
      return mangaCache.get(malId);
    }
    
    try {
      const response = await fetch(`https://api.jikan.moe/v4/manga/${malId}`);
      if (!response.ok) return null;
      const data = await response.json();
      const mangaData = data.data;
      
      setMangaCache(prev => new Map(prev.set(malId, mangaData)));
      return mangaData;
    } catch (error) {
      console.error(`Failed to fetch manga details for MAL ID ${malId}:`, error);
      return null;
    }
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      const reviews = data.reviews || [];
      
      // Fetch manga details for each review
      const reviewsWithManga = await Promise.all(
        reviews.map(async (review: any) => {
          const mangaData = await fetchMangaDetails(review.mal_id);
          return {
            ...review,
            manga: mangaData ? {
              mal_id: mangaData.mal_id,
              titles: mangaData.titles
            } : undefined
          };
        })
      );
      
      setReviews(reviewsWithManga);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [mangaCache]);

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      fetchReviews();
    } else {
      setLoading(false);
      // Redirect to sign-in for unauthenticated users
      router.push('/login');
    }
  }, [isLoaded, user, fetchReviews]);

  const handleConfirmDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review');
      
      // Only update UI after successful deletion
      setReviews(prev => prev.filter(review => review.id !== id));
      toast.success('Review deleted successfully');
      setDeleteConfirmOpen(false);
      setSelectedId(null);
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setDeleteConfirmOpen(true);
  };

  
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <Button asChild>
            <Link href="/reviews/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Write Review
            </Link>
          </Button>
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Start sharing your thoughts on manga you've read!
              </p>
              <Button asChild>
                <Link href="/reviews/new" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Write Your First Review
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/manga/${review.mal_id}`}
                          className="text-lg font-semibold hover:text-mango transition-colors"
                        >
                          {getMangaTitle(review.manga?.titles)}
                        </Link>
                        <Badge variant="secondary">MAL ID: {review.mal_id}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {review.rating}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/reviews/${review.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteConfirm(review.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {review.review_text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Reviewed on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => selectedId && handleConfirmDelete(selectedId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
}
