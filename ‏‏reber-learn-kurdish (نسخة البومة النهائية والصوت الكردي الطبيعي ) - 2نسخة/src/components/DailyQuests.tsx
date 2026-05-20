import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CopyCheck,
  Search,
  ChevronLeft,
  ChevronDown,
  Gift,
  Star,
  CheckCircle2,
  Zap,
  Sparkles,
  BookOpen,
  Headphones,
  Flame,
  Award
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

// Simple seeded random to keep quests consistent for the same day
function getSeededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function DailyQuests({ isCompact = false }: { isCompact?: boolean }) {
  const { profile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  // Generate dynamic quests based on the current date
  const quests = useMemo(() => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const seed = parseInt(dateString.replace(/-/g, "")) || 0;
    
    // Check lessons completed today
    const lessonsCompletedToday = profile?.lessonProgress
      ? Object.values(profile.lessonProgress).filter(
          (p) =>
            p.status === "completed" &&
            p.lastAccessed.includes(dateString),
        ).length
      : 0;

    const questPool = [
      {
        id: "q_lessons_1",
        title: "أكمل درساً واحداً",
        icon: <CopyCheck className="w-6 h-6" />,
        target: 1,
        current: lessonsCompletedToday,
        xp: 15,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
        activeBg: "bg-blue-500",
      },
      {
        id: "q_lessons_2",
        title: "أكمل درسين",
        icon: <CopyCheck className="w-6 h-6" />,
        target: 2,
        current: lessonsCompletedToday,
        xp: 30,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
        activeBg: "bg-blue-500",
      },
      {
        id: "q_lessons_3",
        title: "أكمل ٣ دروس",
        icon: <Award className="w-6 h-6" />,
        target: 3,
        current: lessonsCompletedToday,
        xp: 50,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
        activeBg: "bg-purple-500",
      },
      {
        id: "q_xp_30",
        title: "احصل على 30 نقطة خبرة",
        icon: <Zap className="w-6 h-6" />,
        target: 30,
        current: profile?.xp ? profile.xp % 130 : 0, // Mocked progress
        xp: 10,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30",
        activeBg: "bg-amber-500",
      },
      {
        id: "q_xp_50",
        title: "احصل على 50 نقطة خبرة",
        icon: <Zap className="w-6 h-6" />,
        target: 50,
        current: profile?.xp ? profile.xp % 150 : 0, 
        xp: 20,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30",
        activeBg: "bg-amber-500",
      },
      {
        id: "q_xp_100",
        title: "احصل على 100 نقطة خبرة",
        icon: <Flame className="w-6 h-6" />,
        target: 100,
        current: profile?.xp ? profile.xp % 200 : 0, 
        xp: 40,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30",
        activeBg: "bg-orange-500",
      },
      {
        id: "q_review_5",
        title: "راجع 5 كلمات محفوظة",
        icon: <Search className="w-6 h-6" />,
        target: 5,
        current: 0,
        xp: 10,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
        activeBg: "bg-emerald-500",
      },
      {
        id: "q_review_10",
        title: "راجع 10 كلمات محفوظة",
        icon: <Search className="w-6 h-6" />,
        target: 10,
        current: 0,
        xp: 20,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
        activeBg: "bg-emerald-500",
      },
      {
        id: "q_read_1",
        title: "اقرأ قصة قصيرة",
        icon: <BookOpen className="w-6 h-6" />,
        target: 1,
        current: 0,
        xp: 15,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30",
        activeBg: "bg-indigo-500",
      },
      {
        id: "q_listen_1",
        title: "استمع لمحاورة مسجلة",
        icon: <Headphones className="w-6 h-6" />,
        target: 1,
        current: 0,
        xp: 15,
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30",
        activeBg: "bg-rose-500",
      }
    ];

    // Pick 3 random quests based on the daily seed
    const shuffled = [...questPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(getSeededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 3);
  }, [profile?.lessonProgress, profile?.xp]);

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] border-2 border-border-main shadow-xl overflow-hidden transition-all group/container">
      {!isCompact && (
        <div
          className={cn(
            "relative flex items-center justify-between p-6 transition-all",
            isOpen && "border-b-2 border-zinc-100 dark:border-white/5",
          )}
        >
          <div className="flex items-center gap-5 relative z-10 text-right">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-gold to-amber-300 flex items-center justify-center text-white shadow-lg shadow-brand-gold/20 relative"
            >
              <Gift className="w-7 h-7 drop-shadow-md" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-white opacity-80" />
            </motion.div>
            <div className="space-y-1">
              <h3 className="font-black text-zinc-900 dark:text-white text-xl tracking-tight leading-none italic">
                المهام اليومية
              </h3>
              <p className="font-bold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5 justify-end">
                <span>تحدى نفسك واربح</span>
                <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-10 w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {quests.map((quest, idx) => {
                const progress = Math.min(
                  (quest.current / quest.target) * 100,
                  100,
                );
                const isCompleted = quest.current >= quest.target;

                return (
                  <motion.div
                    key={quest.id}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "group p-4 rounded-3xl border-2 transition-all relative overflow-hidden",
                      isCompleted
                        ? "bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-zinc-900 border-amber-200 dark:border-amber-500/30 shadow-md"
                        : "bg-white dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 shadow-sm",
                    )}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                          isCompleted
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : cn(quest.bg, quest.color, "border"),
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : quest.icon}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <h4
                            className={cn(
                              "font-bold text-sm md:text-base tracking-tight",
                              isCompleted ? "text-amber-700 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100",
                            )}
                          >
                            {quest.title}
                          </h4>

                          {isCompleted ? (
                            <div className="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black py-1 px-2.5 rounded-full shadow-lg shadow-amber-500/20">
                               <Sparkles className="w-2.5 h-2.5" />
                               تم
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-black text-brand-gold">
                              <Zap className="w-3 h-3 fill-current" />
                              <span>+{quest.xp} XP</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(progress, 8)}%` }}
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                isCompleted ? "bg-amber-500" : quest.activeBg,
                              )}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-black min-w-8 text-center",
                              isCompleted ? "text-amber-600" : "text-zinc-400",
                            )}
                          >
                            {quest.current}/{quest.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {!isCompact && (
               <div className="px-5 pb-5">
                  <button className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-brand-blue/20">
                     عرض جميع المهام المستهدفة
                  </button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}
