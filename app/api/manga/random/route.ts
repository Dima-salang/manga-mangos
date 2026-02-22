import { NextRequest, NextResponse } from "next/server";
import { MangaService } from "@/lib/services/manga.service";
import { MangaSchema } from "@/types/manga";

export async function GET(req: NextRequest) {
  try {
    const mangaService = new MangaService();
    const response = await mangaService.getRandomManga();
    const rawData = response.data;

    // validate
    const parsed = MangaSchema.safeParse(rawData);

    if (!parsed.success) {
      console.error("Manga validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid data received from external API" },
        { status: 502 },
      );
    }

    // get the mal_id of the manga
    const mal_id = parsed.data.mal_id;

    // redirect to specific manga page
    return NextResponse.redirect(new URL(`/manga/${mal_id}/detail`, req.url));
  } catch (error: any) {
    console.error("Error fetching random manga:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch random manga" },
      { status: 500 },
    );
  }
}
