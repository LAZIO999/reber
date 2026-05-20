import React from "react";
import { motion } from "motion/react";
import { Gamepad2, Layers, Zap, Trophy, Brain, Baseline, Swords, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Games() {
  const navigate = useNavigate();

  const availableGames = [
    {
      id: "roleplay",
      title: "قصص المحادثة",
      description: "قصص تفاعلية، اختر الرد الكردي المناسب للتقدم في القصة!",
      icon: MessageCircle,
      color: "bg-pink-500",
      shadow: "shadow-[0_4px_0_0_#db2777]",
      xp: "+80 XP",
      path: "/roleplay",
    },
    {
      id: "battles",
      title: "معارك الكلمات",
      description: "تحدَّ لاعبين آخرين وأثبت مهارتك في اللغة الكردية في معارك حية!",
      icon: Swords,
      color: "bg-purple-500",
      shadow: "shadow-[0_4px_0_0_#9333ea]",
      xp: "+100 XP",
      path: "/battles",
    },
    {
      id: "matching",
      title: "مطابقة الكلمات",
      description: "طابق الكلمات الكردية مع ترجمتها العربية بأسرع ما يمكن!",
      icon: Layers,
      color: "bg-brand-blue",
      shadow: "shadow-[0_4px_0_0_#1899D6]",
      xp: "+30 XP",
      path: "/games/matching",
    },
    {
      id: "scramble",
      title: "تحدي التهجئة",
      description: "رتب الحروف المبعثرة لتكوين الكلمة الكردية الصحيحة!",
      icon: Zap,
      color: "bg-brand-gold",
      shadow: "shadow-[0_4px_0_0_#D49B00]",
      xp: "+40 XP",
      path: "/games/scramble",
    },
    {
      id: "cards",
      title: "بطاقات الذاكرة",
      description: "اختبر ذاكرتك مع البطاقات التعليمية التفاعلية!",
      icon: Brain,
      color: "bg-brand-green",
      shadow: "shadow-[0_4px_0_0_#1E8449]",
      xp: "+25 XP",
      path: "/games/cards",
    },
    {
      id: "sentence-builder",
      title: "بناء الجمل",
      description: "رتب الكلمات المبعثرة لتكوين جمل كردية صحيحة!",
      icon: Baseline,
      color: "bg-brand-red",
      shadow: "shadow-[0_4px_0_0_#C0392B]",
      xp: "+50 XP",
      path: "/games/sentence-builder",
    },
  ];

  return (
    <div
      className="space-y-10 animate-in fade-in duration-500 font-arabic text-right"
      dir="rtl"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-brand-green rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_6px_0_0_#1E8449] mb-4">
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-text-secondary">
          ألعاب تعليمية
        </h2>
        <p className="text-text-muted">تعلم بمتعة وتنافس مع الآخرين!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {availableGames.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => game.path !== "#" && navigate(game.path)}
            className={`group p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-border-main dark:border-zinc-800 transition-all ${game.path !== "#" ? "cursor-pointer hover:border-brand-blue hover:translate-y-[-4px]" : "opacity-60 grayscale"}`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-3xl ${game.color} flex items-center justify-center text-white ${game.shadow}`}
              >
                <game.icon className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-text-secondary">
                  {game.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">
                  {game.description}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full border border-border-main dark:border-zinc-700">
                <Trophy className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                  {game.xp}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
