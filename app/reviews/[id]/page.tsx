"use client";

import { useState, useEffect, useCallback } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { useUser } from '@clerk/nextjs';

import Link from 'next/link';

import { Star, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';

import { ReviewWithManga, MangaTitle } from '@/types/review';
import { renderStars, getMangaTitle } from '@/utils/reviewUtils';



export default function EditReviewPage() {

  const { user, isLoaded } = useUser();

  const router = useRouter();

  const params = useParams();

  const [review, setReview] = useState<ReviewWithManga | null>(null);

  const [rating, setRating] = useState(5);

  const [reviewText, setReviewText] = useState('');

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  const fetchReview = useCallback(async () => {

    try {

      const response = await fetch(`/api/reviews/${params.id}`);

      if (response.status === 404) {

        toast.error('Review not found');

        router.push('/reviews');

        return;

      }

      if (!response.ok) throw new Error('Failed to fetch review');

      const userReview = await response.json();

      setReview(userReview);

      setRating(userReview.rating);

      setReviewText(userReview.review_text);

    } catch (error) {

      toast.error('Failed to load review');

      router.push('/reviews');

    } finally {

      setLoading(false);

    }

  }, [params.id, router]);



  useEffect(() => {

    if (!isLoaded) return;

    if (user && params.id) {

      fetchReview();

    } else {

      setLoading(false);

    }

  }, [isLoaded, user, params.id, fetchReview]);



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

                  {renderStars(rating, true, setRating)}

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

