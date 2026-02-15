import { NextResponse } from "next/server";
import { getAllManga } from "@/lib/services/manga.service";

export async function GET() {
  try {
    const data = await getAllManga();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching manga list:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch manga list" },
      { status: 500 }
    );
  }
}
