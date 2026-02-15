"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
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

export function DetailActions() {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = useCallback(() => {
    globalThis.navigator.clipboard.writeText(globalThis.location.href);
    toast.success("Link copied to clipboard!", {
      description: "You can now share this manga with others.",
    });
  }, []);

  const handleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
    const setFavorite = !isFavorite;
    toast.success(setFavorite ? "Added to favorites" : "Removed from favorites", {
      description: setFavorite ? "Manga added to your library." : "Manga removed from your library.",
    });
  }, [isFavorite]);

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
            className={`rounded-full border transition-all duration-300 ${
              isFavorite 
                ? 'bg-mango/20 border-mango text-mango shadow-[0_0_15px_rgba(255,159,67,0.2)]' 
                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-mango/10 hover:text-mango hover:border-mango/20'
            }`}
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} suppressHydrationWarning />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-mango/20 font-bold">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function ReadingStatusSelect() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-mango/60"></div>
      <Select onValueChange={(val) => toast.info(`Status updated to: ${val}`)}>
        <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 rounded-xl font-bold focus:ring-mango/50" suppressHydrationWarning>
          <SelectValue placeholder="Add to List" suppressHydrationWarning />
        </SelectTrigger>
        <SelectContent className="bg-card border-white/10 rounded-xl backdrop-blur-xl">
          <SelectItem value="reading" className="font-bold focus:bg-mango/10 transition-colors">Reading</SelectItem>
          <SelectItem value="completed" className="font-bold focus:bg-mango/10 transition-colors">Completed</SelectItem>
          <SelectItem value="on_hold" className="font-bold focus:bg-mango/10 transition-colors">On Hold</SelectItem>
          <SelectItem value="dropped" className="font-bold focus:bg-mango/10 transition-colors">Dropped</SelectItem>
          <SelectItem value="plan_to_read" className="font-bold focus:bg-mango/10 transition-colors">Plan to Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}