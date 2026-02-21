import { auth } from '@clerk/nextjs/server';
import { createReview } from '@/lib/services/review.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mangaId, rating, reviewText } = body;

    if (!mangaId || !rating || !reviewText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await createReview(userId, mangaId, rating, reviewText);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
