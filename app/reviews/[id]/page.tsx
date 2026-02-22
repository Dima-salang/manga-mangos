"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Review {
  id: number;
  created_at: string;
  user_id: string;
  mal_id: number;
  rating: number;
  review_text: string;
  manga?: {
    mal_id: number;
    titles: any;
  };
}

export default function EditReviewPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      fetchReview();
    }
  }, [user, params.id]);

  const fetchReview = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const reviews = await response.json();
      const userReview = reviews.find((r: Review) => r.id === parseInt(params.id as string));
      
      if (!userReview) {
        toast.error('Review not found');
        router.push('/reviews');
        return;
      }

      setReview(userReview);
      setRating(userReview.rating);
      setReviewText(userReview.review_text);
    } catch (error) {
      toast.error('Failed to load review');
      router.push('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async () => {
    if (!review || !reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review_text: reviewText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update review');
      }

      toast.success('Review updated successfully!');
      router.push('/reviews');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update review');
    } finally {
      setSaving(false);
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

  const getMangaTitle = (titles: any) => {
    if (!titles) return 'Unknown Manga';
    if (typeof titles === 'string') return titles;
    if (titles.en) return titles.en;
    if (titles.ja) return titles.ja;
    return JSON.stringify(titles);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !review) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Access denied</h3>
              <p className="text-muted-foreground mb-4">
                You don't have permission to edit this review.
              </p>
              <Button asChild>
                <Link href="/reviews">Back to Reviews</Link>
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
          <h1 className="text-3xl font-bold">Edit Review</h1>
        </div>

        <div className="space-y-6">
          {/* Manga Info */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <h3 className="font-semibold mb-2">
                  {getMangaTitle(review.manga?.titles)}
                </h3>
                <p className="text-sm text-muted-foreground">MAL ID: {review.mal_id}</p>
              </div>
            </CardContent>
          </Card>

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
                <textarea
                  id="review-text"
                  placeholder="Share your thoughts about this manga..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={8}
                  className="mt-2 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/reviews')}>
                  Cancel
                </Button>
                <Button
                  onClick={updateReview}
                  disabled={!reviewText.trim() || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
