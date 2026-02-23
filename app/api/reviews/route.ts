import { NextRequest, NextResponse } from 'next/server';
import { getUserReviews, createReview, getReviewByUserAndManga } from '@/utils/supabase/reviews';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reviews = await getUserReviews(userId);
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    console.error('REVIEWS FETCH FAILED:', err);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { mal_id, rating, review_text } = body;

    // Explicit null/undefined checks
    if (mal_id == null || rating == null || review_text == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse and validate rating
    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 10' }, { status: 400 });
    }

    // Check for duplicate review
    const existingReview = await getReviewByUserAndManga(userId, mal_id);
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this manga' }, { status: 409 });
    }

    const review = await createReview({
      user_id: userId,
      mal_id,
      rating: ratingNum,
      review_text,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err: unknown) {
    console.error('CREATE REVIEW FAILED:', err);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
