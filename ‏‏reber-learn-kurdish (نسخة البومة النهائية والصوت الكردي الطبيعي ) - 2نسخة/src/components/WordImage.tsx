import React, { useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface WordImageProps {
  src?: string;
  emoji?: string;
  alt: string;
  className?: string;
}

export function WordImage({ src, emoji, alt, className }: WordImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // If there's a source and no error, try rendering the image.
  if (src && !hasError) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoading ? "scale-110 blur-lg" : "scale-100 blur-0",
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback to emoji if image fails or is missing
  if (emoji) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-green/10",
          className,
        )}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ y: -5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-6xl sm:text-8xl drop-shadow-md"
        >
          {emoji}
        </motion.div>
      </div>
    );
  }

  // Fallback if both are missing/failed
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
        className,
      )}
    >
      <ImageOff className="w-12 h-12 mb-2 opacity-20" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-20">
        لا يوجد رسم
      </span>
    </div>
  );
}
