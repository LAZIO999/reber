import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  User,
  Sparkles,
  Trophy,
  Book,
  Gamepad2,
  Sun,
  Moon,
  Bookmark,
  Flame,
  Zap,
  Award,
  Gift,
  X,
  Bell,
  ShoppingBag,
  Swords,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../ui/Logo";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { getLevelProgress } from "../../lib/xpHelpers";
import { DailyQuests } from "../DailyQuests";
import { motion, AnimatePresence } from "motion/react";
import { NotificationsPanel } from "../NotificationsPanel";
import { useNotificationStore } from "../../store/useNotificationStore";
import { InteractiveOwl } from "../InteractiveOwl";
import { OutfitStoreModal } from "../OutfitStoreModal";
import { useOutfitStore } from "../../store/useOutfitStore";

export function Shell() {
  const { profile } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [showMobileQuests, setShowMobileQuests] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { setStoreOpen } = useOutfitStore();
  const { notifications } = useNotificationStore();
  const location = useLocation();
  const isLessonScreen = location.pathname.startsWith("/lessons/");
  
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: BookOpen, label: "الدروس", path: "/lessons" },
    { icon: Gamepad2, label: "الألعاب", path: "/games" },
    { icon: Book, label: "القصص", path: "/stories" },
    { icon: Sparkles, label: "المعلم رێبەر", path: "/ai-chat" },
    { icon: User, label: "حسابي", path: "/profile" },
  ];

  const sidebarItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: BookOpen, label: "الدروس", path: "/lessons" },
    { icon: Bookmark, label: "كلماتي المحفوظة", path: "/saved" },
    { icon: Book, label: "القصص", path: "/stories" },
    { icon: Gamepad2, label: "الألعاب", path: "/games" },
    { icon: Sparkles, label: "المعلم رێبەر", path: "/ai-chat" },
    { icon: Trophy, label: "المتصدرون", path: "/leaderboard" },
    { icon: User, label: "الملف الشخصي", path: "/profile" },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-bg-main font-arabic overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-l-2 border-border-main p-4 fixed right-0 h-full bg-card-bg z-50 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-8 flex items-center justify-between border-b-2 border-transparent mb-2">
          <Logo showText size="sm" />
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setStoreOpen(true)}
              className="relative p-2 bg-gradient-to-tr from-brand-gold to-yellow-400 rounded-xl border border-yellow-500/50 shadow-sm text-white hover:scale-105 transition-all group"
              title="متجر البومة"
            >
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 bg-bg-main rounded-xl border border-border-main shadow-sm text-text-muted hover:text-brand-blue hover:border-brand-blue/30 transition-all group"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 mt-2 px-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-reverse space-x-4 px-4 py-3 rounded-xl font-bold transition-all border border-transparent text-sm",
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20 shadow-sm"
                    : "text-text-muted hover:bg-bg-main hover:text-text-main",
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar user info */}
        <div className="pt-8 border-t-2 border-border-main">
          <div className="flex flex-col gap-3 px-4 py-3 bg-card-bg border-2 border-border-main rounded-2xl shadow-sm">
            <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-emerald-600 border-2 border-border-main flex items-center justify-center text-white font-black overflow-hidden shadow-sm shadow-brand-green/20">
                {profile === undefined ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  profile?.username?.[0]?.toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-black truncate text-sm text-text-secondary">
                  {profile?.username}
                </p>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                  المستوى {profile?.level || 1}
                </p>
              </div>
            </div>
            {/* XP Progress bar in sidebar */}
            {(() => {
              const { progressPercentage, xpInCurrentLevel, xpRequiredForNextLevel } = getLevelProgress(profile?.xp || 0);
              return (
                <div className="space-y-1">
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-brand-green to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>{xpInCurrentLevel} نقطة</span>
                    <span>{xpRequiredForNextLevel} للمستوى التالي</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        {/* Sidebar Daily Quests */}
        <div className="mt-8 pt-8 border-t-2 border-zinc-100 dark:border-white/5">
          <div className="px-2 mb-6">
            <div className="group relative bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-5 rounded-[2.5rem] border-2 border-zinc-100 dark:border-white/5 shadow-sm overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-all" />
               
               <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-gold rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-gold/20 -rotate-6 group-hover:rotate-0 transition-transform">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-tight">المهام اليومية</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">أهدافك لليوم</p>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🚀
                  </motion.div>
               </div>
               <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    className="h-full bg-brand-gold rounded-full"
                  />
               </div>
            </div>
          </div>
          <DailyQuests isCompact />
        </div>
      </aside>

      <div className="flex-1 lg:mr-72 h-full overflow-hidden flex flex-col">
        {!isLessonScreen && (
          <header className="lg:hidden flex shrink-0 items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-xl border-b border-orange-100/50 z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Premium Quest Orb Trigger */}
              <motion.button 
                onClick={() => setShowMobileQuests(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group h-[40px] sm:h-12 px-3 sm:px-4 bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-md border border-zinc-100 dark:border-zinc-700 overflow-hidden shrink-0"
              >
                <div className="relative z-10 w-7 h-7 rounded-lg bg-brand-gold flex items-center justify-center text-white shadow-lg glow-gold">
                  <Gift className="w-4 h-4 drop-shadow-md" />
                </div>
                
                <div className="relative z-10 text-right">
                   <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-0.5">المهام</p>
                   <p className="text-xs font-black text-zinc-900 dark:text-white leading-none">اليومية</p>
                </div>

                <div className="relative z-10 w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
              </motion.button>

              {/* Streak */}
              {(profile?.streak ?? 0) > 0 && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-orange-500 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm shrink-0">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
                  <span className="text-[10px] sm:text-xs font-black text-white">{profile?.streak}</span>
                </div>
              )}
              {/* XP */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-brand-blue rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm shrink-0">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white/60" />
                <span className="text-[10px] sm:text-xs font-black text-white">{profile?.xp || 0}</span>
              </div>
              
              {/* Store Button */}
              <button 
                onClick={() => setStoreOpen(true)}
                className="relative p-2 bg-gradient-to-tr from-brand-gold to-yellow-400 rounded-xl border border-yellow-500/50 shadow-sm text-white hover:scale-105 transition-colors group shrink-0"
              >
                <div className="flex items-center gap-1">
                   <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                </div>
              </button>

              {/* Notification Button */}
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm text-text-muted hover:text-brand-blue transition-colors group shrink-0"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </header>
        )}

        <main 
          className={cn("flex-1 overflow-y-auto flex flex-col", !isLessonScreen && "pb-[100px] lg:pb-0")}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="max-w-5xl mx-auto w-full p-3 md:p-6 text-right flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <InteractiveOwl />
      {!isLessonScreen && (
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t-2 border-orange-100/50 flex items-center justify-around px-2 z-50 shadow-[0_-8px_30px_rgba(251,146,60,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)", height: "calc(65px + env(safe-area-inset-bottom))" }}
        dir="rtl"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full transition-all",
                item.label === "المعلم رێبەر" && !isActive ? "text-brand-blue" :
                isActive
                  ? "text-brand-green"
                  : "text-zinc-400 dark:text-zinc-500",
              )
            }
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded-xl transition-all relative",
                  isActive && "bg-brand-green/10",
                  item.label === "المعلم رێبەر" && !isActive && "bg-brand-blue/5 border border-brand-blue/20"
                )}
              >
                {item.label === "المعلم رێبەر" && !isActive && (
                  <div
                    className="absolute inset-0 bg-brand-blue/10 rounded-xl blur-sm"
                  />
                )}
                <div 
                  className="relative"
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 mb-0.5",
                      isActive && "fill-brand-green/20",
                      item.label === "المعلم رێبەر" && "text-brand-blue"
                    )}
                  />
                  {item.label === "المعلم رێبەر" && (
                    <span 
                      className="absolute -top-2.5 -right-2.5 text-[10px]"
                    >
                      ✨
                    </span>
                  )}
                </div>
                    <span className="text-[10px] font-bold tracking-tight">
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      )}

      {/* Mobile Quests Modal */}
      <AnimatePresence>
        {showMobileQuests && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileQuests(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 rounded-t-[3rem] border-t-2 border-zinc-100 dark:border-zinc-800 p-6 z-[101] lg:hidden max-h-[85vh] overflow-y-auto shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.2)]"
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
              <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-brand-gold to-amber-300 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-gold/20 -rotate-6">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">المهام اليومية</h3>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">أهدافك لليوم</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMobileQuests(false)}
                  className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <DailyQuests isCompact />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <OutfitStoreModal />
    </div>
  );
}
