import { NextResponse } from 'next/server';
import { getAllManga } from '@/lib/services/manga.service';

export async function GET() {
  const manga = await getAllManga();
  return NextResponse.json(manga);
}
