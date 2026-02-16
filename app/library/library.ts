"use server";

import { auth } from "@clerk/nextjs/server";
import { MangaService } from "@/lib/services/manga.service";
import { LibraryStatus } from "@/types/library";
import { revalidatePath } from "next/cache";

export async function addMangaToLibraryAction(malId: number, status: LibraryStatus, favorite: boolean) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be logged in to add manga to your library" };
  }

  const mangaService = new MangaService();
  
  try {
    // Validate manga ID against Jikan API to get canonical data
    const response = await mangaService.getManga(malId);
    
    if (!response || !response.data) {
      return { success: false, error: "Manga not found on Jikan API" };
    }

    const canonicalManga = response.data;

    await mangaService.addMangaToLibrary(userId, canonicalManga, status, favorite);
    revalidatePath(`/manga/${malId}/detail`);
    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("Error adding manga to library:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
