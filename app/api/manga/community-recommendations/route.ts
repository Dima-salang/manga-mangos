import { MangaService } from "@/lib/services/manga.service";
import { NextResponse, NextRequest } from "next/server";
import { CommunityRecommendationsResponseSchema } from "@/types/manga";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = QuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    console.error("Invalid query parameters:", parsed.error);
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }
  const page = parsed.data.page;

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
      { error: "Failed to fetch community recommendations" },
      { status: 500 },
    );
  }
}
