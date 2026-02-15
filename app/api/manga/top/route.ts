import { NextRequest, NextResponse } from "next/server";
import { getTopManga } from "@/lib/services/manga.service";
import { MangaType, TopMangaFilter } from "@/types/manga";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = (searchParams.get("type") as MangaType) || MangaType.MANGA;
  const filter = (searchParams.get("filter") as TopMangaFilter) || TopMangaFilter.BY_POPULARITY;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "25", 10);

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
