import React from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "../lib/utils";

export function Leaderboard() {
  const players = [
    { name: "Amed_88", xp: 2450, rank: 1, avatar: "A" },
    { name: "Reber", xp: 2120, rank: 2, avatar: "R", isMe: true },
    { name: "Zin_Kurd", xp: 1980, rank: 3, avatar: "Z" },
    { name: "Dilan_X", xp: 1850, rank: 4, avatar: "D" },
    { name: "Soran", xp: 1600, rank: 5, avatar: "S" },
  ];

  return (
    <div
      className="space-y-8 animate-in fade-in duration-500 font-arabic text-right"
      dir="rtl"
    >
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-brand-gold rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_6px_0_0_#D49B00] mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black tracking-tight uppercase text-text-secondary">
          الدوري البرونزي
        </h2>
        <p className="text-sm font-black text-text-muted uppercase tracking-widest">
          متبقي 3 أيام
        </p>
      </div>

      <div className="bg-card-bg rounded-[2.5rem] p-2 border-2 border-border-main shadow-sm overflow-hidden">
        {players.map((p, idx) => (
          <div
            key={p.name}
            className={cn(
              "flex items-center justify-between p-5 rounded-3xl transition-all",
              p.isMe
                ? "bg-bg-main border-2 border-brand-green -translate-x-1"
                : "hover:bg-zinc-50 dark:hover:scale-[1.01]",
            )}
          >
            <div className="flex items-center space-x-reverse space-x-4">
              <span
                className={cn(
                  "w-6 font-black text-lg",
                  idx === 0
                    ? "text-brand-gold"
                    : idx === 1
                      ? "text-zinc-400"
                      : idx === 2
                        ? "text-orange-400"
                        : "text-zinc-300",
                )}
              >
                {idx + 1}
              </span>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white",
                  p.isMe ? "bg-brand-green" : "bg-zinc-300 dark:bg-zinc-700",
                )}
              >
                {p.isMe ? "أنت" : p.avatar}
              </div>
              <span
                className={cn(
                  "font-black text-base",
                  p.isMe ? "text-brand-green" : "text-text-secondary",
                )}
              >
                {p.name}
              </span>
            </div>

            <div
              className={cn(
                "flex items-center space-x-reverse space-x-2 text-left",
                p.isMe ? "text-brand-green" : "text-text-muted",
              )}
            >
              <span className="font-black text-xs uppercase tracking-tighter">
                {p.xp} نقطة
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-brand-blue font-black text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
        عرض جميع الترتيبات
      </button>
    </div>
  );
}
