import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  vertical?: boolean;
}

export function Logo({
  className,
  size = "md",
  showText = true,
  vertical = false,
}: LogoProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-40 h-40",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        className,
      )}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-center rounded-[2rem] overflow-hidden shadow-xl border-4 border-white/50 bg-brand-green",
          sizes[size]
        )}
      >
        <img 
          src="/logo.png" 
          alt="Reber Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback content in case image is not uploaded yet
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-brand-green -z-10 flex items-center justify-center text-white font-bold text-xs text-center opacity-50">
          Upload logo.png
        </div>
      </motion.div>

      {showText && (
        <div className="flex flex-col items-center">
           <h1 className="font-black text-brand-green text-3xl tracking-tight">رێبەر</h1>
           <div className="flex items-center gap-2">
             <div className="h-1 w-3 bg-brand-gold rounded-full" />
             <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase">REBER</span>
             <div className="h-1 w-3 bg-brand-red rounded-full" />
           </div>
        </div>
      )}
    </div>
  );
}
