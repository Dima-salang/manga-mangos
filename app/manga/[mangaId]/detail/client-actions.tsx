"use client";

import { useState, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
  Loader2
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Manga } from "@/types/manga";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { addMangaToLibraryAction } from "@/app/library/library";

interface DetailActionsProps {
  manga: Manga;
  initialLibraryItem: LibraryItem | null;
}

export function DetailActions({ manga, initialLibraryItem }: DetailActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialLibraryItem?.favorite || false);
  const [isPending, startTransition] = useTransition();

  const handleShare = useCallback(() => {
    globalThis.navigator.clipboard.writeText(globalThis.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          description: "You can now share this manga with others.",
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          description: "Please copy the URL manually.",
        });
      });
  }, []);

  const handleFavorite = useCallback(() => {
    const newFavorite = !isFavorite;
    
    startTransition(async () => {
      const result = await addMangaToLibraryAction(
        manga, 
        initialLibraryItem?.status || LibraryStatus.PLAN_TO_READ, 
        newFavorite
      );

      if (result.success) {
        setIsFavorite(newFavorite);
        toast.success(newFavorite ? "Added to favorites" : "Removed from favorites", {
          description: newFavorite ? "Manga added to your favorites." : "Manga removed from your favorites.",
          icon: newFavorite ? <Heart className="w-4 h-4 fill-mango text-mango" /> : undefined
        });
      } else {
        toast.error("Failed to update favorite status", {
          description: result.error
        });
      }
    });
  }, [isFavorite, manga, initialLibraryItem]);

  return (
    <div className="flex items-center gap-4" suppressHydrationWarning>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/5 border border-white/10 hover:bg-mango/10 hover:text-mango hover:border-mango/20 transition-all duration-300"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" suppressHydrationWarning />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-mango/20 font-bold">Share this manga</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isPending}
            className={`rounded-full border transition-all duration-300 ${
              isFavorite 
                ? 'bg-mango/20 border-mango text-mango shadow-[0_0_15px_rgba(255,159,67,0.2)]' 
                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-mango/10 hover:text-mango hover:border-mango/20'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleFavorite}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover:scale-110'}`} suppressHydrationWarning />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-mango/20 font-bold">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface ReadingStatusSelectProps {
  manga: Manga;
  initialLibraryItem: LibraryItem | null;
}

export function ReadingStatusSelect({ manga, initialLibraryItem }: ReadingStatusSelectProps) {
  const [status, setStatus] = useState<LibraryStatus | "none">(initialLibraryItem?.status || "none");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (val: LibraryStatus) => {
    startTransition(async () => {
      const result = await addMangaToLibraryAction(
        manga, 
        val, 
        initialLibraryItem?.favorite || false
      );

      if (result.success) {
        setStatus(val);
        toast.success(`Status updated to: ${val.replaceAll('_', ' ')}`, {
          description: "Your library has been updated.",
          className: "bg-mango/10 border-mango/20 text-foreground font-bold"
        });
      } else {
        toast.error("Failed to update status", {
          description: result.error
        });
      }
    });
  };

  return (
    <div className="space-y-3">
      <Select 
        defaultValue={status === "none" ? undefined : status} 
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 rounded-xl font-bold focus:ring-mango/50 relative overflow-hidden group" suppressHydrationWarning>
          <div className="flex items-center gap-2">
            {isPending ? <Loader2 className="w-3 h-3 animate-spin text-mango" /> : null}
            <SelectValue placeholder="Add to List" suppressHydrationWarning />
          </div>
          <div className="absolute inset-0 bg-mango/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </SelectTrigger>
        <SelectContent className="bg-card border-white/10 rounded-xl backdrop-blur-xl">
          <SelectItem value={LibraryStatus.READING} className="font-bold focus:bg-mango/10 transition-colors">Reading</SelectItem>
          <SelectItem value={LibraryStatus.COMPLETED} className="font-bold focus:bg-mango/10 transition-colors">Completed</SelectItem>
          <SelectItem value={LibraryStatus.PLAN_TO_READ} className="font-bold focus:bg-mango/10 transition-colors">Plan to Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}