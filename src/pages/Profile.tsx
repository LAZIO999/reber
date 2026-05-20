import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  LogOut,
  Award,
  Calendar,
  Zap,
  MessageSquare,
  ChevronRight,
  Star,
  Flame,
  Sun,
  Moon,
  Bookmark,
  X,
  Mail,
  Send,
  Sparkles,
  Gem,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { XPProgressBar } from "../components/XPProgressBar";
import { LevelMilestones } from "../components/LevelMilestones";
import { Achievements } from "../components/Achievements";

export function Profile() {
  const { profile, signOut } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);

  const stats = [
    {
      label: "إجمالي النقاط",
      value: profile?.xp,
      icon: Zap,
      color: "text-brand-gold",
      bg: "bg-brand-gold/10",
      shadow: "shadow-[0_12px_25px_rgba(212,155,0,0.15)]",
    },
    {
      label: "التتابع اليومي",
      value: profile?.streak,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      shadow: "shadow-[0_12px_25px_rgba(249,115,22,0.15)]",
    },
    {
      label: "المستوى الحالي",
      value: profile?.level,
      icon: Award,
      color: "text-brand-green",
      bg: "bg-brand-green/10",
      shadow: "shadow-[0_12px_25px_rgba(34,197,94,0.15)]",
    },
  ];

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-6 font-arabic text-right relative overflow-hidden"
      dir="rtl"
    >
      {/* 
          ANIMATED MESH BACKGROUND - Matching Auth.tsx
      */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#E8F5E9] dark:bg-emerald-900/10 rounded-full blur-[140px] opacity-60" 
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[90%] h-[90%] bg-[#FFF9E6] dark:bg-amber-900/10 rounded-full blur-[140px] opacity-70" 
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[4rem] border-4 border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-12 transition-all hover:scale-[1.01]"
        >
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="w-48 h-48 rounded-[3rem] border-[8px] border-white dark:border-zinc-800 overflow-hidden shadow-2xl relative z-10 bg-zinc-100 flex items-center justify-center transition-transform"
              >
                {profile === undefined ? (
                  <div className="w-12 h-12 rounded-full border-4 border-brand-green border-t-transparent animate-spin" />
                ) : profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-green to-emerald-600 flex items-center justify-center text-8xl text-white font-black shadow-inner">
                    {profile?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-gold rounded-[1.5rem] border-4 border-white dark:border-zinc-800 flex items-center justify-center text-white shadow-xl z-20"
              >
                <Star className="w-8 h-8 fill-current" />
              </motion.div>
            </div>

            <div className="text-center space-y-3">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white"
              >
                {profile?.username}
              </motion.h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-1 w-4 bg-brand-gold rounded-full" />
                <p className="text-lg font-bold text-zinc-500 uppercase tracking-wide">
                  في رحلة لإتقان اللغة الكردية
                </p>
                <div className="h-1 w-4 bg-brand-red rounded-full" />
              </div>
              <div className="inline-block mt-4 px-6 py-2 bg-brand-green/10 text-brand-green rounded-full font-black text-sm uppercase tracking-widest border border-brand-green/20">
                لهجة {profile?.selectedDialect || "سورانية"}
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <Sparkles className="absolute top-12 left-12 w-8 h-8 text-brand-gold/20" />
          <Gem className="absolute bottom-12 right-12 w-8 h-8 text-brand-blue/20" />
        </motion.div>

        {/* Level & XP */}
        <div className="space-y-4">
           <div className="flex justify-between items-end mb-2 px-2">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white italic">تقدمك الدراسي</h3>
              <span className="text-brand-green font-black text-lg">مستوى {profile?.level}</span>
           </div>
           <XPProgressBar xp={profile?.xp || 0} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className={cn(
                "p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border-2 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center space-y-4 group hover:scale-[1.05] transition-all",
                stat.shadow
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-[1.8rem] flex items-center justify-center transition-transform group-hover:rotate-12",
                stat.bg,
                stat.color
              )}>
                <stat.icon className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-4xl font-black text-zinc-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <LevelMilestones />

        <Achievements />

        {/* Actions & Settings - Bento Style */}
        <div className="space-y-8">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white italic px-2">الإعدادات والتحكم</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
              className="flex items-center justify-between p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-4 border-white rounded-[2.5rem] shadow-xl hover:border-brand-blue group transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center transition-all",
                  isDark ? "bg-brand-gold/10 text-brand-gold" : "bg-brand-blue/10 text-brand-blue"
                )}>
                  {isDark ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
                </div>
                <div className="text-right">
                   <p className="font-black text-xl text-zinc-900 dark:text-white">{isDark ? "الوضع النهاري" : "الوضع الليلي"}</p>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">تغيير مظهر التطبيق</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors p-1",
                isDark ? "bg-brand-green" : "bg-zinc-200"
              )}>
                <motion.div 
                  animate={{ x: isDark ? -20 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/saved")}
              className="flex items-center gap-6 p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-4 border-white rounded-[2.5rem] shadow-xl hover:border-brand-gold group transition-all"
            >
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-3xl flex items-center justify-center transition-all group-hover:rotate-6">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="text-right">
                 <p className="font-black text-xl text-zinc-900 dark:text-white">كلماتي المحفوظة</p>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">مراجعة المفردات المهمة</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSupportModalOpen(true)}
              className="flex items-center gap-6 p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-4 border-white rounded-[2.5rem] shadow-xl hover:border-brand-blue group transition-all"
            >
              <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-3xl flex items-center justify-center transition-all group-hover:-rotate-6">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="text-right">
                 <p className="font-black text-xl text-zinc-900 dark:text-white">تواصل مع الدعم</p>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">نحن هنا لمساعدتك دائماً</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="flex items-center gap-6 p-8 bg-zinc-900 text-white rounded-[2.5rem] shadow-2xl hover:bg-brand-red transition-all group"
            >
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110">
                <LogOut className="w-8 h-8" />
              </div>
              <div className="text-right">
                 <p className="font-black text-xl">تسجيل الخروج</p>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">نأمل رؤيتك قريباً</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white/90 backdrop-blur-3xl w-full max-w-lg rounded-[2.5rem] sm:rounded-[4rem] border-4 border-white p-6 sm:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="absolute top-4 sm:top-10 left-4 sm:left-10 p-2 sm:p-3 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 z-10"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <div className="text-center space-y-2 sm:space-y-4 mb-8 sm:mb-12 mt-4 sm:mt-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-blue/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-brand-blue" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 italic">
                  نسمعك بقلب مفتوح
                </h2>
                <p className="text-sm sm:text-lg font-bold text-zinc-500">
                  فريق رێبەر جاهز للرد على كل استفساراتك
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <a
                  href="mailto:ima3548@icloud.com"
                  className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 sm:gap-6 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-white bg-white/50 hover:bg-brand-blue/5 hover:border-brand-blue transition-all group"
                  dir="rtl"
                >
                  <div className="bg-brand-blue text-white p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] shadow-lg group-hover:rotate-6 transition-transform">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg sm:text-xl font-black text-zinc-900 group-hover:text-brand-blue transition-colors">
                      البريد الإلكتروني للأعمال
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-zinc-400 mt-1" dir="ltr">
                      ima3548@icloud.com
                    </div>
                  </div>
                </a>

                <a
                  href="https://t.me/lazio933"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 sm:gap-6 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-white bg-white/50 hover:bg-[#229ED9]/5 hover:border-[#229ED9] transition-all group"
                  dir="rtl"
                >
                  <div className="bg-[#229ED9] text-white p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] shadow-lg group-hover:-rotate-6 transition-transform">
                    <Send className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg sm:text-xl font-black text-zinc-900 group-hover:text-[#229ED9] transition-colors">
                      الدعم الفني عبر تيليجرام
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-zinc-400 mt-1" dir="ltr">
                      @lazio933
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
