import { NextRequest, NextResponse } from "next/server";
import { MangaService } from "@/lib/services/manga.service";
import { z } from "zod";

const searchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(25).default(25),
  type: z.string().optional(),
  status: z.string().optional(),
  min_score: z.coerce.number().min(0).max(10).optional(),
  max_score: z.coerce.number().min(0).max(10).optional(),
  sfw: z.string().optional(),
  order_by: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  genres: z.string().optional(),
  genres_exclude: z.string().optional(),
  letter: z.string().length(1).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  language: z.string().optional(),
}).loose(); // Allow other params just in case

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Safe parse the params
  const rawParams = Object.fromEntries(searchParams.entries());
  const parseResult = searchParamsSchema.safeParse(rawParams);
  
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid search parameters", details: z.treeifyError(parseResult.error) },
      { status: 400 }
    );
  }

  const mangaService = new MangaService();

  try {
    const data = await mangaService.getSearchResults(searchParams);
    
    const language = parseResult.data.language;
    if (language && language !== "all" && data.data) {
      // TODO: implement language filtering
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error searching manga:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search manga" },
      { status: 500 }
    );
  }
}
