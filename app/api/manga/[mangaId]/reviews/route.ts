import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MangaService } from "@/lib/services/manga.service";

const mangaIdSchema = z.coerce.number().int().positive();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mangaId: string }> },
) {
  const { mangaId } = await params;
  const result = mangaIdSchema.safeParse(mangaId);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid manga ID" }, { status: 400 });
  }

  const id = result.data;

  try {
    const mangaService = new MangaService();
    const response = await mangaService.getMangaReviews(id);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching manga reviews", error);
    return NextResponse.json(
      { error: "Error fetching manga reviews" },
      { status: 500 },
    );
  }
}
