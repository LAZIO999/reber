import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "motion/react";
import {
  Flame,
  Trophy,
  Star,
  BookOpen,
  Play,
  Hand,
  Users,
  Plane,
  Utensils,
  Lock,
  Zap,
  Puzzle,
  Compass,
  ShoppingBag,
  Loader2,
  Gamepad2,
  Sun,
  Type,
  Briefcase,
  User,
  Home as HomeIcon,
  CloudSnow,
  Activity,
  Sparkles,
  TreePine,
  Clock,
  Book,
  MessageCircle,
  ShoppingCart,
  Shirt,
  HeartPulse,
  GraduationCap,
  Laptop,
  Smile,
  ChevronRight,
  Award,
} from "lucide-react";
import { cn } from "../lib/utils";
import { MOCK_LESSONS } from "../data/mockLessons";
import { Logo } from "../components/ui/Logo";
import { getLevelProgress } from "../lib/xpHelpers";
import { DailyQuests } from "../components/DailyQuests";

const LESSONS_BY_CATEGORY = MOCK_LESSONS.reduce((acc, lesson) => {
  if (!acc[lesson.categoryId]) acc[lesson.categoryId] = [];
  acc[lesson.categoryId].push(lesson);
  return acc;
}, {} as Record<string, typeof MOCK_LESSONS>);

export function Home() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();

  const getCategoryProgress = useCallback(
    (categoryId: string) => {
      const categoryLessons = LESSONS_BY_CATEGORY[categoryId] || [];
      if (categoryLessons.length === 0) return 0;

      const progressSum = categoryLessons.reduce((acc, lesson) => {
        const lessonProg = profile?.lessonProgress?.[lesson.id]?.progress || 0;
        return acc + lessonProg;
      }, 0);

      return Math.round(progressSum / categoryLessons.length);
    },
    [profile?.lessonProgress],
  );

  const categories = useMemo(
    () => [
      {
        id: "alphabet",
        title: "الحروف الكردية",
        progress: getCategoryProgress("alphabet"),
        color: "bg-brand-red",
        shadow: "shadow-[0_4px_0_0_var(--brand-red-dark)]",
        icon: <Type className="w-10 h-10" />,
      },
      {
        id: "greetings",
        title: "التحيات",
        progress: getCategoryProgress("greetings"),
        color: "bg-brand-green",
        shadow: "shadow-[0_4px_0_0_var(--brand-green-dark)]",
        icon: <Hand className="w-10 h-10" />,
      },
      {
        id: "family",
        title: "العائلة",
        progress: getCategoryProgress("family"),
        color: "bg-[#EB5757]",
        shadow: "shadow-[0_4px_0_0_#C0392B]",
        icon: <Users className="w-10 h-10" />,
      },
      {
        id: "travel",
        title: "السفر",
        progress: getCategoryProgress("travel"),
        color: "bg-[#2D9CDB]",
        shadow: "shadow-[0_4px_0_0_#1F78A8]",
        icon: <Compass className="w-10 h-10" />,
      },
      {
        id: "food",
        title: "الطعام",
        progress: getCategoryProgress("food"),
        color: "bg-[#F2994A]",
        shadow: "shadow-[0_4px_0_0_#D35400]",
        icon: <Utensils className="w-10 h-10" />,
      },
      {
        id: "colors",
        title: "الألوان",
        progress: getCategoryProgress("colors"),
        color: "bg-[#9B51E0]",
        shadow: "shadow-[0_4px_0_0_#6A2EB9]",
        icon: <Puzzle className="w-10 h-10" />,
      },
      {
        id: "numbers",
        title: "الأرقام",
        progress: getCategoryProgress("numbers"),
        color: "bg-[#00B4D8]",
        shadow: "shadow-[0_4px_0_0_#0077B6]",
        icon: <Gamepad2 className="w-10 h-10" />,
      },
      {
        id: "nature",
        title: "الطبيعة",
        progress: getCategoryProgress("nature"),
        color: "bg-[#2ECC71]",
        shadow: "shadow-[0_4px_0_0_#27AE60]",
        icon: <TreePine className="w-10 h-10" />,
      },
      {
        id: "time",
        title: "الوقت",
        progress: getCategoryProgress("time"),
        color: "bg-[#34495E]",
        shadow: "shadow-[0_4px_0_0_#2C3E50]",
        icon: <Clock className="w-10 h-10" />,
      },
      {
        id: "weather",
        title: "الطقس",
        progress: getCategoryProgress("weather"),
        color: "bg-[#5DADE2]",
        shadow: "shadow-[0_4px_0_0_#3498DB]",
        icon: <CloudSnow className="w-10 h-10" />,
      },
      {
        id: "professions",
        title: "المهن",
        progress: getCategoryProgress("professions"),
        color: "bg-[#E67E22]",
        shadow: "shadow-[0_4px_0_0_#D35400]",
        icon: <Briefcase className="w-10 h-10" />,
      },
      {
        id: "body",
        title: "أجزاء الجسم",
        progress: getCategoryProgress("body"),
        color: "bg-[#F1948A]",
        shadow: "shadow-[0_4px_0_0_#E74C3C]",
        icon: <User className="w-10 h-10" />,
      },
      {
        id: "house",
        title: "في المنزل",
        progress: getCategoryProgress("house"),
        color: "bg-[#8E44AD]",
        shadow: "shadow-[0_4px_0_0_#7D3C98]",
        icon: <HomeIcon className="w-10 h-10" />,
      },
      {
        id: "verbs",
        title: "الأفعال",
        progress: getCategoryProgress("verbs"),
        color: "bg-[#E74C3C]",
        shadow: "shadow-[0_4px_0_0_#C0392B]",
        icon: <Activity className="w-10 h-10" />,
      },
      {
        id: "adjectives",
        title: "الصفات",
        progress: getCategoryProgress("adjectives"),
        color: "bg-[#F39C12]",
        shadow: "shadow-[0_4px_0_0_#D68910]",
        icon: <Sparkles className="w-10 h-10" />,
      },
      {
        id: "grammar",
        title: "القواعد والمفردات",
        progress: getCategoryProgress("grammar"),
        color: "bg-[#1ABC9C]",
        shadow: "shadow-[0_4px_0_0_#16A085]",
        icon: <Book className="w-10 h-10" />,
      },
      {
        id: "phrases",
        title: "العبارات الأولية",
        progress: getCategoryProgress("phrases"),
        color: "bg-[#3498DB]",
        shadow: "shadow-[0_4px_0_0_#2980B9]",
        icon: <MessageCircle className="w-10 h-10" />,
      },
      {
        id: "shopping",
        title: "التسوق",
        progress: getCategoryProgress("shopping"),
        color: "bg-[#E84393]",
        shadow: "shadow-[0_4px_0_0_#D63031]",
        icon: <ShoppingCart className="w-10 h-10" />,
      },
      {
        id: "clothes",
        title: "الملابس",
        progress: getCategoryProgress("clothes"),
        color: "bg-[#00CEC9]",
        shadow: "shadow-[0_4px_0_0_#00B894]",
        icon: <Shirt className="w-10 h-10" />,
      },
      {
        id: "clothing",
        title: "الملابس والتأنق",
        progress: getCategoryProgress("clothing"),
        color: "bg-[#00CEC9]",
        shadow: "shadow-[0_4px_0_0_#00B894]",
        icon: <Shirt className="w-10 h-10" />,
      },
      {
        id: "health",
        title: "الصحة والطبيب",
        progress: getCategoryProgress("health"),
        color: "bg-[#FF7675]",
        shadow: "shadow-[0_4px_0_0_#D63031]",
        icon: <HeartPulse className="w-10 h-10" />,
      },
      {
        id: "education",
        title: "المدرسة والتعليم",
        progress: getCategoryProgress("education"),
        color: "bg-[#0984E3]",
        shadow: "shadow-[0_4px_0_0_#74B9FF]",
        icon: <GraduationCap className="w-10 h-10" />,
      },
      {
        id: "school",
        title: "الجامعة",
        progress: getCategoryProgress("school"),
        color: "bg-[#0984E3]",
        shadow: "shadow-[0_4px_0_0_#74B9FF]",
        icon: <GraduationCap className="w-10 h-10" />,
      },
      {
        id: "technology",
        title: "التكنولوجيا",
        progress: getCategoryProgress("technology"),
        color: "bg-[#6C5CE7]",
        shadow: "shadow-[0_4px_0_0_#A29BFE]",
        icon: <Laptop className="w-10 h-10" />,
      },
      {
        id: "emotions",
        title: "المشاعر",
        progress: getCategoryProgress("emotions"),
        color: "bg-[#FD79A8]",
        shadow: "shadow-[0_4px_0_0_#E84393]",
        icon: <Smile className="w-10 h-10" />,
      },
      {
        id: "items",
        title: "أشياء",
        progress: getCategoryProgress("items"),
        color: "bg-[#A29BFE]",
        shadow: "shadow-[0_4px_0_0_#6C5CE7]",
        icon: <Puzzle className="w-10 h-10" />,
      },
      {
        id: "places",
        title: "أماكن",
        progress: getCategoryProgress("places"),
        color: "bg-[#55EFC4]",
        shadow: "shadow-[0_4px_0_0_#00B894]",
        icon: <Compass className="w-10 h-10" />,
      },
      {
        id: "drinks",
        title: "مشروبات",
        progress: getCategoryProgress("drinks"),
        color: "bg-[#74B9FF]",
        shadow: "shadow-[0_4px_0_0_#0984E3]",
        icon: <Utensils className="w-10 h-10" />,
      },
      {
        id: "adverbs",
        title: "الظروف",
        progress: getCategoryProgress("adverbs"),
        color: "bg-[#2980B9]",
        shadow: "shadow-[0_4px_0_0_#1A5276]",
        icon: <Clock className="w-10 h-10" />,
      },
      {
        id: "animals",
        title: "الأنعام",
        progress: getCategoryProgress("animals"),
        color: "bg-[#FFB142]",
        shadow: "shadow-[0_4px_0_0_#CC8E35]",
        icon: <TreePine className="w-10 h-10" />,
      },
    ],
    [getCategoryProgress],
  );

  const getNextLesson = useCallback(() => {
    const started = Object.entries(profile?.lessonProgress || {})
      .filter(([_, prog]) => prog.status === "in-progress")
      .sort(
        (a, b) =>
          new Date(b[1].lastAccessed).getTime() -
          new Date(a[1].lastAccessed).getTime(),
      )[0];

    if (started) return MOCK_LESSONS.find((l) => l.id === started[0]);

    return MOCK_LESSONS.find((l) => !profile?.completedLessons?.includes(l.id));
  }, [profile?.lessonProgress, profile?.completedLessons]);

  const nextLesson = getNextLesson() || MOCK_LESSONS[0];
  const nextLessonProgress =
    profile?.lessonProgress?.[nextLesson.id]?.progress || 0;

  return (
    <div className="relative min-h-screen font-arabic" dir="rtl">
      {/* Background Blobs for Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 bg-orange-200/20 blur-[100px] rounded-full" 
        />
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full" 
        />
        <div 
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-brand-blue/5 blur-[80px] rounded-full" 
        />
      </div>

      <div className="space-y-10 md:space-y-12 animate-in fade-in duration-1000 max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">

        {/* Desktop Header - Sophisticated & Integrated */}
        <header className="hidden lg:flex items-center justify-between">
          <Logo showText size="lg" />

          <div className="flex items-center gap-6">
            {/* Streak pill */}
            {(profile?.streak ?? 0) > 0 && (
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center gap-4 bg-white dark:bg-card-bg rounded-2xl px-6 py-3 shadow-soft border border-border-main group"
              >
                <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-orange-500/20">
                  <Flame className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-xl font-black text-text-main leading-none">{profile?.streak}</div>
                  <div className="text-[10px] font-bold uppercase text-text-muted">يوم متتالي</div>
                </div>
              </motion.div>
            )}

            {/* XP & Level pill */}
            {(() => {
              const { currentLevel, progressPercentage } = getLevelProgress(profile?.xp || 0);
              return (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-5 bg-white dark:bg-card-bg rounded-2xl px-6 py-3 shadow-soft border border-border-main"
                >
                  <div className="bg-brand-blue p-2 rounded-xl shadow-lg shadow-brand-blue/20">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-text-main leading-none">{currentLevel}</div>
                    <div className="text-[10px] font-bold uppercase text-text-muted">المستوى الحالي</div>
                  </div>
                  <div className="w-28 h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-brand-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </header>

        {/* Continue Learning Hero - Refined & Premium */}
        <section className="relative group overflow-hidden rounded-[2.5rem] bg-orange-400 dark:bg-zinc-900 border border-orange-300 dark:border-white/10 shadow-2xl shadow-orange-500/20 dark:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb74d] to-[#ff8f00] dark:from-orange-600 dark:via-orange-500 dark:to-amber-600 opacity-100 dark:opacity-90 transition-transform group-hover:scale-105 duration-1000" />
          
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-10 z-10">
            <div className="flex-1 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 dark:border-white/20 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                الدرس القادم: الوحدة المتاحة
              </div>
              
              <div className="space-y-3">
                 <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  {nextLesson.title}
                </h2>
                <p className="text-white/90 dark:text-white/80 font-medium text-lg md:text-xl max-w-xl">
                  {nextLesson.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                  className="w-full sm:w-auto bg-white text-[#ea580c] dark:text-orange-600 font-black px-10 py-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.3)] dark:shadow-2xl hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] dark:hover:shadow-white/20 transition-all text-xl flex items-center justify-center gap-3"
                >
                  {nextLessonProgress > 0 ? "استمر في التعلم" : "بدء الدرس الآن"}
                  <Play className="w-6 h-6 fill-current rotate-180" />
                </motion.button>
                
                {nextLessonProgress > 0 && (
                  <div className="flex items-center gap-4 bg-white/20 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm">
                    <span className="text-base font-black text-white">
                      {Math.round(nextLessonProgress)}%
                    </span>
                    <div className="w-24 h-2 bg-white/30 dark:bg-white/20 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-white shadow-[0_0_10px_#fff]" style={{ width: `${nextLessonProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex w-64 h-64 bg-white/15 dark:bg-black/20 backdrop-blur-2xl rounded-[3rem] items-center justify-center relative border border-white/30 dark:border-white/10 -rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-2xl overflow-visible">
              <div className="relative flex items-center justify-center">
                <motion.img 
                  src="/logo.png" 
                  alt="Rêber Logo" 
                  className="w-36 h-36 object-contain drop-shadow-[0_10px_20px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10"
                  animate={{ 
                    y: [0, -6, 0],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-6 border-2 border-white/30 border-dashed rounded-full" 
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 border border-white/10 border-dotted rounded-full" 
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-deep border border-orange-200 dark:border-white/5">
                <Zap className="w-8 h-8 text-orange-500 fill-current animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Grid Refinement */}
        <div className="space-y-8">
          <div className="flex items-baseline justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-text-main flex items-center gap-4">
                <div className="w-2 h-10 bg-brand-green rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                استكشف الوحدات
              </h3>
              <p className="text-text-muted font-medium text-sm mr-6">اختر موضوعاً لبدء رحلتك التعليمية اليوم</p>
            </div>
            <button 
              onClick={() => navigate("/lessons")}
              className="text-sm font-black text-brand-green hover:text-brand-green-dark transition-colors border-b-2 border-brand-green/20 hover:border-brand-green pb-1"
            >
              عرض جميع الوحدات
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-12">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => navigate(`/lessons?category=${cat.id}`)}
                className="group cursor-pointer"
              >
                <div className="h-full bg-white dark:bg-card-bg rounded-[2.5rem] border border-border-main p-6 md:p-8 flex flex-col items-center justify-center gap-6 hover:border-brand-green/30 transition-all duration-500 shadow-soft hover:shadow-deep active:scale-95">
                  
                  <div
                    className={cn(
                      "w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center text-white relative z-10 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                      cat.color,
                    )}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 [&>svg]:w-full [&>svg]:h-full drop-shadow-lg">
                      {cat.icon}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <span className="font-black text-text-main text-lg md:text-xl block">
                      {cat.title}
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 w-16 md:w-24 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-border-main/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.05 }}
                          className={cn("h-full rounded-full", cat.color)}
                        />
                      </div>
                      <span className="text-[11px] font-black text-brand-green" dir="ltr">
                        {cat.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Games Card Teaser - Cleaned up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate("/games")}
              className="col-span-2 md:col-span-1 group cursor-pointer"
            >
              <div className="h-full bg-brand-blue rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 text-white shadow-lg shadow-brand-blue/20 relative overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative bg-white/20 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl group-hover:scale-110 transition-transform border border-white/30">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <div className="text-center relative">
                  <div className="font-black text-2xl">منطقة الألعاب</div>
                  <div className="text-xs font-bold text-blue-100 opacity-80 uppercase tracking-widest mt-1">العب وتعلم بمتعة</div>
                </div>
                
                <Sparkles className="absolute top-6 right-6 w-6 h-6 text-blue-200 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
