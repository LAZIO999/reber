import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { playKurdishAudio } from "../lib/audio";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Volume2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  Bookmark
} from "lucide-react";
import { useWordStore } from "../store/useWordStore";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "../lib/utils";
import { WordImage } from "../components/WordImage";
import { convertLatinToSorani } from "../lib/kurdishTransliterator";

export function Flashcards() {
  const { profile } = useAuthStore();
  const { savedWords, fetchSavedWords, failedWords } = useWordStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState<"smart" | "saved">("smart");

  useEffect(() => {
    if (profile?.uid) {
      fetchSavedWords(profile.uid);
    }
  }, [profile?.uid, fetchSavedWords]);

  // Determine which words to show based on review mode
  const wordsToList = reviewMode === "smart" ? failedWords : savedWords;

  // Simple spaced repetition logic (mock implementation for UI)
  const sortedWords = [...wordsToList].sort((a, b) => {
    // In a real SR system, we'd sort by nextReviewDate
    return 0; 
  });

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedWords.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + sortedWords.length) % sortedWords.length);
    }, 150);
  };

  const handleSpeak = async (text: string) => {
    await playKurdishAudio(text);
  };

  if (sortedWords.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in font-arabic text-center py-20 bg-white rounded-3xl border-4 border-gray-50 shadow-sm mt-10">
        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Brain className="w-12 h-12 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-black text-slate-800">لا توجد كلمات للمراجعة</h2>
        <p className="text-slate-500 font-bold mb-8">
          {reviewMode === "smart" 
            ? "لم تخطئ في أي كلمة بعد. استمر في الدروس!" 
            : "لم تقم بحفظ أي كلمة بعد. قم بحفظ الكلمات أثناء الدروس."}
        </p>
        <Link to="/lessons">
          <button className="bg-brand-green text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_#15803d] hover:-translate-y-1 transition-transform">
            الذهاب للدروس
          </button>
        </Link>
      </div>
    );
  }

  const currentWordRecord = sortedWords[currentIndex];
  // `currentWordRecord` could be from savedWords (which stores {word, savedAt}) 
  // or failedWords (which stores {word, failedCount, lastFailed}).
  const word = "word" in currentWordRecord ? (currentWordRecord as any).word : currentWordRecord;


  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in font-arabic pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border-2 border-white shadow-sm">
        
        <div className="flex bg-gray-100 rounded-xl p-1 relative w-full md:w-auto">
          {/* Active indicator */}
          <motion.div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
            layoutId="active-tab"
            initial={false}
            animate={{ left: reviewMode === "smart" ? "4px" : "calc(50%)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => { setReviewMode("smart"); setCurrentIndex(0); setIsFlipped(false); }}
            className={`flex-1 relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-black text-sm transition-colors ${
              reviewMode === "smart" ? "text-brand-blue" : "text-gray-400"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>الذكية</span>
          </button>
          <button
            onClick={() => { setReviewMode("saved"); setCurrentIndex(0); setIsFlipped(false); }}
            className={`flex-1 relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-black text-sm transition-colors ${
              reviewMode === "saved" ? "text-brand-gold" : "text-gray-400"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>المحفوظة</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm font-black text-slate-400 bg-white px-4 py-2 rounded-xl border border-gray-50 shadow-sm">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{sortedWords.length}</span>
        </div>
      </div>

      {/* Review Info Bar */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-4">
        {reviewMode === "smart" && (
           <div className="flex items-center gap-1.5 text-orange-500">
             <AlertCircle className="w-4 h-4" />
             أخطأت فيها {("failedCount" in currentWordRecord) ? (currentWordRecord as any).failedCount : 0} مرات
           </div>
        )}
      </div>

      {/* Flashcard */}
      <div 
        className="relative perspective-1000 h-96 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
           className="w-full h-full relative preserve-3d"
           initial={false}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
           {/* Front Mode (Arabic) */}
           <div className={cn(
             "absolute inset-0 backface-hidden bg-white rounded-[3rem] border-4 border-gray-50 flex flex-col items-center justify-center p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-shadow",
           )}>
              <div className="absolute top-6 left-6 text-2xl opacity-20 group-hover:opacity-100 transition-opacity">🔄</div>
              
              <h3 className="text-5xl font-black text-brand-green mb-4 drop-shadow-sm text-center" dir="rtl">
                {word.translation}
              </h3>
              <p className="text-gray-400 font-bold text-center mt-4 text-lg">
                انقر للقلب
              </p>
           </div>

           {/* Back Mode (Kurdish) */}
           <div className={cn(
             "absolute inset-0 backface-hidden bg-gradient-to-br from-brand-blue to-blue-600 rounded-[3rem] border-4 border-white flex flex-col items-center justify-center p-8 shadow-xl text-white",
             "[transform:rotateY(180deg)]"
           )}>
              <div className="absolute top-6 left-6 text-2xl opacity-20">🔄</div>
              
              <WordImage src={word.imageUrl} emoji={word.emoji} alt={word.translation} className="w-32 h-32 mb-6 rounded-3xl shadow-md border-4 border-white/20" />
              
              <h3 className="text-5xl font-black mb-4 text-center" dir="rtl">
                {convertLatinToSorani(word.kurdish)}
              </h3>
              
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="relative w-14 h-14 rounded-2xl bg-black/10 text-white/50 flex flex-col items-center justify-center cursor-not-allowed group overflow-hidden mt-2"
                title="قريباً"
              >
                <Volume2 className="w-6 h-6 mb-1" />
                <span className="font-bold text-[10px] bg-white text-zinc-900 px-2 py-0.5 rounded-full shadow-sm">قريباً</span>
              </button>
           </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-center gap-6 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white/50 backdrop-blur-md border-t border-border-main/50">
        <button
          onClick={handlePrev}
          className="w-14 h-14 rounded-2xl bg-white border-2 border-border-main flex items-center justify-center text-text-muted hover:text-brand-blue hover:border-blue-200 shadow-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="text-xs font-black uppercase tracking-widest text-text-muted">اسحب للتنقل</div>
        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-2xl bg-white border-2 border-border-main flex items-center justify-center text-text-muted hover:text-brand-blue hover:border-blue-200 shadow-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
