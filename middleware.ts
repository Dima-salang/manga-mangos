import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // example: block unauthenticated review creation
  return NextResponse.next();
}
// expand later with JWT
