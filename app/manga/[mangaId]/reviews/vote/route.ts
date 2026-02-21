import { auth } from '@clerk/nextjs/server';
import { voteReview, removeVote } from '@/lib/services/review.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { reviewId, voteType } = body;

    if (!reviewId || !voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    await voteReview(reviewId, userId, voteType);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Missing reviewId' },
        { status: 400 }
      );
    }

    await removeVote(reviewId, userId);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    );
  }
}
