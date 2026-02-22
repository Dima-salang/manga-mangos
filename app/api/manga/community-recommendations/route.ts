import { MangaService } from "@/lib/services/manga.service";
import { NextResponse, NextRequest } from "next/server";
import { CommunityRecommendationsResponseSchema } from "@/types/manga";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page")!)
    : 1;

  const mangaService = new MangaService();
  try {
    const data = await mangaService.getCommunityRecommendations(page);

    // validate the response
    const parsed = CommunityRecommendationsResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Invalid community recommendations data:", parsed.error);
      return NextResponse.json(
        { error: "Invalid community recommendations data" },
        { status: 500 },
      );
    }
    return NextResponse.json(parsed.data);
  } catch (error: any) {
    console.error("Error fetching community recommendations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch community recommendations" },
      { status: 500 },
    );
  }
}
