import React from "react";
import { Award, Flame, Star, Zap, ShieldCheck, Crown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "../lib/utils";

export function Achievements() {
  const { profile } = useAuthStore();

  const achievements = [
    {
      id: "first_lesson",
      title: "البداية القوية",
      description: "أكمل أول درس لك",
      condition:
        profile && Object.keys(profile.lessonProgress || {}).length > 0,
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      color: "text-brand-blue",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      activeBorder: "border-brand-blue",
      shadow: "shadow-[0_4px_0_0_#1899D6]",
    },
    {
      id: "streak_3",
      title: "شعلة النشاط",
      description: "حافظ على تتابع لمدة 3 أيام",
      condition: profile && profile.streak >= 3,
      icon: <Flame className="w-6 h-6 md:w-8 md:h-8" />,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      activeBorder: "border-orange-500",
      shadow: "shadow-[0_4px_0_0_#f97316]",
    },
    {
      id: "level_5",
      title: "طالب مجتهد",
      description: "صل إلى المستوى 5",
      condition: profile && profile.level >= 5,
      icon: <Star className="w-6 h-6 md:w-8 md:h-8" />,
      color: "text-brand-gold",
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      activeBorder: "border-brand-gold",
      shadow: "shadow-[0_4px_0_0_#FFC800]",
    },
    {
      id: "10_words",
      title: "جامع الكلمات",
      description: "احفظ 10 كلمات في قائمتك",
      condition: false, // We would check this from useWordStore, but let's mock false for now unless we import useWordStore
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />,
      color: "text-brand-green",
      bg: "bg-green-50 dark:bg-green-900/30",
      activeBorder: "border-brand-green",
      shadow: "shadow-[0_4px_0_0_#1E8449]",
    },
    {
      id: "master",
      title: "خبير اللغة",
      description: "أكمل 50 درساً",
      condition:
        profile &&
        profile.completedLessons &&
        profile.completedLessons.length >= 50,
      icon: <Crown className="w-6 h-6 md:w-8 md:h-8" />,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      activeBorder: "border-purple-500",
      shadow: "shadow-[0_4px_0_0_#a855f7]",
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-tight flex items-center space-x-reverse space-x-3 text-text-secondary">
        <Award className="w-6 h-6 text-brand-gold" />
        <span>الإنجازات</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={cn(
              "flex flex-col items-center justify-center p-6 bg-card-bg rounded-3xl border-2 text-center transition-all brutal-button hover:translate-y-0",
              ach.condition
                ? cn(ach.activeBorder, ach.shadow)
                : "border-border-main opacity-50 grayscale shadow-[0_4px_0_0_var(--color-border-main)]",
            )}
          >
            <div
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3",
                ach.condition ? ach.bg : "bg-zinc-100 dark:bg-zinc-800",
                ach.condition ? ach.color : "text-zinc-400",
              )}
            >
              {ach.icon}
            </div>
            <h4 className="font-black text-text-secondary text-sm md:text-base mb-1">
              {ach.title}
            </h4>
            <p className="text-[10px] md:text-xs font-bold text-text-muted">
              {ach.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
