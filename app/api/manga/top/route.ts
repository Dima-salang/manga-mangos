import { NextRequest, NextResponse } from "next/server";
import { getTopManga } from "@/lib/services/manga.service";
import { MangaTypeFilter, TopMangaFilter } from "@/types/manga";
import { z } from "zod";

const querySchema = z.object({
  type: z.enum(MangaTypeFilter).default(MangaTypeFilter.MANGA),
  filter: z.enum(TopMangaFilter).default(TopMangaFilter.BY_POPULARITY),
  page: z.preprocess((val) => Number.parseInt(val as string, 10), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number.parseInt(val as string, 10), z.number().min(1).max(25).default(25)),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawParams = Object.fromEntries(searchParams.entries());

  const result = querySchema.safeParse(rawParams);
  const { type, filter, page, limit } = result.success 
    ? result.data 
    : { 
        type: MangaTypeFilter.MANGA, 
        filter: TopMangaFilter.BY_POPULARITY, 
        page: 1, 
        limit: 25 
      };

  try {
    const data = await getTopManga(type, filter, page, limit);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching top manga:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top manga" },
      { status: 500 }
    );
  }
}
