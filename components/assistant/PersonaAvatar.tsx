"use client";

import React from "react";
import Image from "next/image";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaAvatarProps {
    src: string;
    alt: string;
    fallbackEmoji?: string;
    className?: string;
    fallbackIcon?: any;
    priority?: boolean;
    emojiClassName?: string;
    fallbackIconClassName?: string;
}

export const PersonaAvatar = ({ 
    src, 
    alt, 
    fallbackEmoji, 
    className,
    fallbackIcon: FallbackIcon = Bot,
    priority = false,
    emojiClassName = "text-lg",
    fallbackIconClassName = "p-1.5"
}: PersonaAvatarProps) => {
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        setError(false);
    }, [src]);

    if (error) {
        return (
            <div className={cn("flex items-center justify-center w-full h-full", className)}>
                {fallbackEmoji ? (
                    <span className={cn(emojiClassName)}>{fallbackEmoji}</span>
                ) : (
                    <FallbackIcon className={cn("w-full h-full", fallbackIconClassName)} />
                )}
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden w-full h-full", className)}>
            <Image
                src={src}
                alt={alt}
                fill
                unoptimized
                priority={priority}
                className="object-cover"
                style={{ 
                    imageRendering: 'auto',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
                onError={() => setError(true)}
            />
        </div>
    );
};
