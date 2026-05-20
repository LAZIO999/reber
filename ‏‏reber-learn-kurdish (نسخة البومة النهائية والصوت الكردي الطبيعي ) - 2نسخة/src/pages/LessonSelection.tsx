import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Star,
  Play,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";
import { MOCK_LESSONS } from "../data/mockLessons";

const CATEGORY_STYLES: Record<string, { bg: string, text: string, border: string, icon: React.ReactNode }> = {
  alphabet: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "🅰️" },
  greetings: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: "👋" },
  family: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "👨‍👩‍👧‍👦" },
  travel: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", icon: "✈️" },
  food: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", icon: "🍔" },
  colors: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", icon: "🎨" },
  numbers: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", icon: "🔢" },
  nature: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "🌲" },
  time: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: "⏱️" },
  weather: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200", icon: "☁️" },
  professions: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "💼" },
  human: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", icon: "👤" },
  house: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", icon: "🏠" },
  verbs: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", icon: "🏃" },
  adjectives: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", border: "border-fuchsia-200", icon: "✨" },
  grammar: { bg: "bg-zinc-50", text: "text-zinc-600", border: "border-zinc-200", icon: "📚" },
  phrases: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", icon: "💬" },
  shopping: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-300", icon: "🛒" },
  clothes: { bg: "bg-lime-50", text: "text-lime-600", border: "border-lime-200", icon: "👕" },
};

export function LessonSelection() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [searchParams] = useSearchParams();
  const defaultCategory = searchParams.get("category") || "alphabet";
  
  const [selectedCategory, setSelectedCategory] = React.useState(defaultCategory);
  
  // Create a sorted list of unique categories found in MOCK_LESSONS
  const categories = useMemo(() => {
    const cats = [...new Set(MOCK_LESSONS.map((l) => l.categoryId))];
    // Return them with some basic metadata fallback if not in CATEGORY_STYLES
    return cats.map((id) => ({
      id,
      title: MOCK_LESSONS.find((l) => l.categoryId === id)?.title || id,
      style: CATEGORY_STYLES[id] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", icon: "📌" }
    }));
  }, []);

  // Update selected category when URL params change
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams, selectedCategory]);

  const filteredLessons = useMemo(() => {
    return MOCK_LESSONS.filter((l) => l.categoryId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-arabic pb-20">
      
      {/* Dynamic Header */}
      <div className="relative bg-card-bg rounded-[2.5rem] p-6 md:p-10 border border-border-main shadow-soft overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Abstract Background Element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-green/5 rounded-full blur-[50px] pointer-events-none" />
        
        <div className="z-10 text-center md:text-right flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 px-5 py-2 rounded-full border border-brand-gold/20">
             <Star className="w-4 h-4 text-brand-gold fill-current" />
             <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">مسار التعلم</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">ابحث عن مسارك</h1>
          <p className="text-text-muted font-medium text-lg leading-relaxed max-w-xl">اختر الوحدة المناسبة لمستواك وابدأ التعلم بخطوات ثابتة وممتعة.</p>
        </div>

        <div className="z-10 bg-bg-main p-6 rounded-[2rem] border border-border-main shadow-sm flex items-center gap-8 shrink-0">
           <div className="text-center space-y-1">
             <div className="text-xs font-bold text-text-muted uppercase tracking-widest">نقاطك</div>
             <div className="flex items-center gap-2 text-brand-blue font-black text-2xl">
               <Zap className="w-6 h-6 fill-current" />
               {profile?.xp || 0}
             </div>
           </div>
           <div className="w-px h-12 bg-border-main" />
           <div className="text-center space-y-1">
             <div className="text-xs font-bold text-text-muted uppercase tracking-widest">المستوى</div>
             <div className="flex items-center gap-2 text-brand-green font-black text-2xl">
               <Award className="w-6 h-6 fill-current" />
               {profile?.level || 1}
             </div>
           </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="relative -mx-4 px-4 overflow-hidden">
        {/* Gradient fades for edge of scroll area */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-main to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-main to-transparent z-10 pointer-events-none" />
        
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold transition-all shadow-sm",
                selectedCategory === cat.id
                  ? cn(cat.style.bg, cat.style.text, cat.style.border, "shadow-deep scale-105")
                  : "bg-card-bg border-border-main text-text-muted hover:bg-bg-main hover:text-text-main"
              )}
            >
              <span className="text-xl">{cat.style.icon}</span>
              <span className="text-base">{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Map */}
      <div className="relative isolate px-2">
        {/* Vertical Journey Line connecting the dots */}
        <div className="absolute top-10 bottom-10 right-1/2 md:right-[50px] w-2 bg-gray-100 rounded-full -z-10 translate-x-1/2 md:translate-x-0" />

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredLessons.map((lesson, index) => {
              const progress = profile?.lessonProgress?.[lesson.id];
              const isCompleted = profile?.completedLessons?.includes(lesson.id);
              const inProgress = progress?.status === "in-progress";

              // Always allow the first lesson of a category, or if the user has enough XP, or if it's already started/completed.
              // For a simpler demo, we just unlock everything or unlock sequentially.
              // Here, let's unlock sequentially within the category based on XP, but since it's a prototype, we unlock all for ease of play,
              // OR we can strictly enforce: unlock if index === 0 OR previous lesson is completed.
              const isUnlocked = index === 0 || profile?.completedLessons?.includes(filteredLessons[index - 1]?.id);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  key={lesson.id}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-6",
                    !isUnlocked && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  {/* Journey Node */}
                  <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-24">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-4 z-10 transition-all",
                      isCompleted ? "bg-brand-green border-green-100 text-white shadow-lg shadow-green-200" :
                      inProgress ? "bg-amber-400 border-amber-100 text-white shadow-lg shadow-amber-200" :
                      isUnlocked ? "bg-white border-brand-green text-brand-green" :
                      "bg-gray-100 border-gray-50 text-gray-400"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       !isUnlocked ? <Lock className="w-4 h-4" /> : 
                       <span className="font-black font-sans">{index + 1}</span>}
                    </div>
                  </div>

                  {/* Mobile Journey Node (Overlay) */}
                  <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                     <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all",
                        isCompleted ? "bg-brand-green border-green-100 text-white shadow-sm" :
                        inProgress ? "bg-amber-400 border-amber-100 text-white shadow-sm" :
                        isUnlocked ? "bg-white border-brand-green text-brand-green shadow-sm" :
                        "bg-gray-100 border-gray-50 text-gray-400 shadow-sm"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                         !isUnlocked ? <Lock className="w-3 h-3" /> : 
                         <span className="font-black font-sans text-xs">{index + 1}</span>}
                      </div>
                  </div>

                  {/* Lesson Card */}
                  <div
                    onClick={() => isUnlocked && navigate(`/lessons/${lesson.id}`)}
                    className={cn(
                      "flex-1 w-full bg-card-bg rounded-[2.5rem] p-6 md:p-8 border-2 flex flex-col sm:flex-row sm:items-center gap-8 transition-all shadow-soft group relative overflow-hidden",
                      isUnlocked ? "cursor-pointer border-border-main hover:border-brand-green/30 hover:shadow-deep hover:-translate-y-1" : "cursor-not-allowed border-transparent opacity-80"
                    )}
                  >
                    
                    <div className="flex-1 space-y-3 text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-bold uppercase tracking-widest text-text-muted">
                        <span className="bg-bg-main px-3 py-1 rounded-full border border-border-main">الدرس {lesson.order}</span>
                        <span className="text-amber-500 flex items-center gap-1 font-black"><Zap className="w-3 h-3 fill-current" /> {lesson.xpReward} XP</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-text-main tracking-tight group-hover:text-brand-green transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-text-muted font-medium text-base leading-relaxed max-w-xl">
                        {lesson.description}
                      </p>

                      {inProgress && (
                        <div className="mt-4 max-w-md">
                          <div className="flex items-center justify-between text-xs font-bold mb-2">
                            <span className="text-brand-gold uppercase tracking-widest">قيد التقدم</span>
                            <span className="text-text-main">{Math.round(progress.progress)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-bg-main rounded-full overflow-hidden border border-border-main">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.progress}%` }}
                              className="h-full bg-brand-gold rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex justify-center">
                      <button
                        className={cn(
                          "w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center transition-all shadow-soft",
                          isCompleted ? "bg-brand-green text-white shadow-lg shadow-green-500/20" :
                          inProgress ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20" :
                          isUnlocked ? "bg-bg-main text-brand-green group-hover:bg-brand-green group-hover:text-white border border-border-main" :
                          "bg-bg-main text-text-muted border border-border-main opacity-50"
                        )}
                        disabled={!isUnlocked}
                      >
                        {isCompleted ? <BookOpen className="w-7 h-7 md:w-8 md:h-8" /> : 
                         !isUnlocked ? <Lock className="w-7 h-7 md:w-8 md:h-8" /> : 
                         <Play className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredLessons.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-500">لا توجد دروس حالياً في هذا المسار</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
