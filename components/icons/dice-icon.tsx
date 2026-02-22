import { cn } from "@/lib/utils";

interface DiceIconProps {
  readonly className?: string;
}

export function DiceIcon({ className }: DiceIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn(className)}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <circle cx="15.5" cy="15.5" r="1.5"/>
      <circle cx="15.5" cy="8.5" r="1.5"/>
      <circle cx="8.5" cy="15.5" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
    </svg>
  );
}
