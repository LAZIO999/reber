import React from "react";
import { motion } from "motion/react";
import { Award, Target } from "lucide-react";
import { cn } from "../lib/utils";
import { getLevelProgress } from "../lib/xpHelpers";

export function XPProgressBar({
  xp,
  className,
}: {
  xp: number;
  className?: string;
}) {
  const {
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressPercentage,
  } = getLevelProgress(xp);

  return (
    <div
      className={cn(
        "p-6 bg-card-bg rounded-[2rem] border-2 border-border-main space-y-4",
        className,
      )}
    >
      <div className="flex items-center justify-between text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green/10 rounded-xl relative">
            <Award className="w-5 h-5 text-brand-green relative z-10" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              المستوى الحالي
            </div>
            <div className="text-xl font-black">{currentLevel}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-left" dir="ltr">
          <div className="p-2 bg-brand-blue/10 rounded-xl relative">
            <Target className="w-5 h-5 text-brand-blue relative z-10" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 text-right">
              المستوى القادم
            </div>
            <div className="text-xl font-black text-right">
              {currentLevel + 1}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs font-black text-zinc-500 dark:text-zinc-400">
        <span>{xpInCurrentLevel} خبرة</span>
        <span>{xpRequiredForNextLevel} للوصول</span>
      </div>

      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 relative">
        <div className="absolute inset-0 bg-white/20 z-10" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, type: "spring", stiffness: 30 }}
          className="h-full bg-brand-green/80 rounded-full relative overflow-hidden"
        >
          <div className="absolute inset-0 border-t-2 border-white/30" />
          {/* subtle striped reflection effect */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-30" />
        </motion.div>
      </div>
    </div>
  );
}
