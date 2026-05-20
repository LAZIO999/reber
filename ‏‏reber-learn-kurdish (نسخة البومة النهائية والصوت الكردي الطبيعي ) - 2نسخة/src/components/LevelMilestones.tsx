import React from "react";
import {
  Lock,
  Unlock,
  Zap,
  MessageSquare,
  Trophy,
  BookOpen,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const MILESTONES = [
  {
    level: 1,
    title: "الأساسيات والمبتدئ",
    icon: BookOpen,
    description: "الوصول إلى الدروس الأساسية",
  },
  {
    level: 2,
    title: "لوحة الصدارة",
    icon: Trophy,
    description: "التنافس مع الأصدقاء والمتعلمين الآخرين",
  },
  {
    level: 3,
    title: "تحدي الكلمات المتقدمة",
    icon: Zap,
    description: "فتح الألعاب المتقدمة للكلمات",
  },
  {
    level: 4,
    title: "القصص التفاعلية والمتقدمة",
    icon: BookOpen,
    description: "قراءة قصص أطول وتطوير سرعة القراءة",
  },
  {
    level: 5,
    title: "مواضيع محادثة الذكاء الاصطناعي",
    icon: MessageSquare,
    description: "فتح مواضيع مخصصة مع المساعد الذكي",
  },
];

export function LevelMilestones() {
  const { profile } = useAuthStore();
  const currentLevel = profile?.level || 1;

  return (
    <div className="bg-card-bg border-2 border-border-main rounded-[2rem] p-6 space-y-6">
      <h3 className="font-black text-xl text-text-secondary">
        معالم التقدم المستقبلي
      </h3>
      <div className="space-y-4">
        {MILESTONES.map((milestone, idx) => {
          const isUnlocked = currentLevel >= milestone.level;
          const isNext =
            MILESTONES.findIndex((m) => m.level > currentLevel) === idx;

          return (
            <div
              key={milestone.level}
              className={cn(
                "p-4 rounded-[1.5rem] flex items-center gap-4 transition-all border-2",
                isUnlocked
                  ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm"
                  : isNext
                    ? "bg-blue-50 dark:bg-brand-blue/10 border-brand-blue/40"
                    : "bg-zinc-100 dark:bg-zinc-800/50 border-transparent opacity-80",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  isUnlocked
                    ? "bg-brand-green/20 text-brand-green"
                    : isNext
                      ? "bg-brand-blue/20 text-brand-blue"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400",
                )}
              >
                {isUnlocked ? (
                  <Unlock className="w-6 h-6" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 text-right">
                <div className="flex justify-between items-center mb-1">
                  <h4
                    className={cn(
                      "font-black text-sm",
                      isUnlocked
                        ? "text-text-secondary"
                        : "text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {milestone.title}
                  </h4>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                      isUnlocked
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
                    )}
                  >
                    المستوى {milestone.level}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs font-black",
                    isUnlocked
                      ? "text-zinc-500"
                      : "text-zinc-400 dark:text-zinc-500",
                  )}
                >
                  {milestone.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
