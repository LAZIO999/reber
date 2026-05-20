import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useWordStore } from "../store/useWordStore";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";
import { SavedWord } from "../types";
import { cn } from "../lib/utils";

export function SavedWordsReview() {
  const navigate = useNavigate();
  const { profile, addXp } = useAuthStore();
  const { savedWords, fetchSavedWords, updateWordReviewStatus } =
    useWordStore();

  const [reviewQueue, setReviewQueue] = useState<SavedWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [wordsReviewed, setWordsReviewed] = useState(0);

  useEffect(() => {
    if (profile?.uid) {
      if (savedWords.length === 0) {
        fetchSavedWords(profile.uid);
      }
    }
  }, [profile?.uid]);

  useEffect(() => {
    if (
      savedWords.length > 0 &&
      reviewQueue.length === 0 &&
      !sessionCompleted
    ) {
      const now = new Date();
      // Filter words that are due or overdue for review based on nextReviewDate
      const dueWords = savedWords.filter((word) => {
        if (!word.nextReviewDate) return true; // new words have no date, review them
        const reviewDate = new Date(word.nextReviewDate);
        return reviewDate <= now;
      });
      // Limit session to max 15 words
      setReviewQueue(dueWords.slice(0, 15));
    }
  }, [savedWords]);

  const handleReveal = () => setShowAnswer(true);

  const handleResult = async (isCorrect: boolean) => {
    if (!profile) return;
    const currentWord = reviewQueue[currentIndex];

    await updateWordReviewStatus(profile.uid, currentWord.wordId, isCorrect);

    setWordsReviewed((prev) => prev + 1);

    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionCompleted(true);
      const sessionXp = wordsReviewed * 5 + 10;
      addXp(sessionXp);
    }
  };

  if (reviewQueue.length === 0 && !sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-arabic space-y-6 animate-in fade-in">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-zinc-400" />
        </div>
        <h2 className="text-3xl font-black text-text-secondary text-center">
          أنت جاهز تماماً!
        </h2>
        <p className="text-xl text-text-muted text-center max-w-sm">
          لا توجد كلمات بحاجة للمراجعة حالياً. عد لاحقاً لمراجعة المزيد.
        </p>
        <button
          onClick={() => navigate("/saved")}
          className="mt-4 bg-brand-blue text-white font-black px-8 py-4 rounded-xl border-b-4 border-[#1899D6] active:translate-y-[2px] active:border-b-2 transition-all"
        >
          العودة
        </button>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-arabic space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-brand-green rounded-full flex items-center justify-center text-white shadow-[0_8px_0_0_#1E8449]">
          <Check className="w-16 h-16" />
        </div>
        <h2 className="text-4xl font-black text-text-secondary text-center tracking-tight">
          عمل ممتاز!
        </h2>
        <p className="text-xl text-text-muted text-center">
          لقد راجعت {wordsReviewed} كلمات اليوم
        </p>
        <button
          onClick={() => navigate("/saved")}
          className="bg-brand-blue text-white font-black text-xl px-12 py-4 rounded-full border-b-4 border-[#1899D6] hover:translate-y-[2px] hover:border-b-2 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          العودة للكلمات
        </button>
      </div>
    );
  }

  const currentWord = reviewQueue[currentIndex];
  if (!currentWord) return null;

  return (
    <div
      className="max-w-2xl mx-auto min-h-[80vh] flex flex-col font-arabic"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/saved")}
          className="w-12 h-12 flex items-center justify-center bg-card-bg rounded-full border-2 border-border-main hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary transform rotate-180" />
        </button>
        <div className="flex-1 px-8">
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green transition-all duration-300"
              style={{ width: `${(currentIndex / reviewQueue.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="font-bold text-text-muted min-w-[3rem] text-left">
          {currentIndex + 1} / {reviewQueue.length}
        </span>
      </div>

      {/* Review Card */}
      <div className="flex-1 flex flex-col justify-center pb-20">
        <div className="bg-card-bg rounded-[3rem] p-12 border-2 border-border-main shadow-sm flex flex-col items-center justify-center min-h-[400px] relative">
          <h2
            className={cn(
              "text-5xl font-black text-text-secondary text-center leading-normal mb-8 transition-all duration-300",
              showAnswer ? "text-brand-green" : "",
            )}
          >
            {currentWord.kurdish}
          </h2>

          <AnimatePresence mode="wait">
            {!showAnswer ? (
              <motion.button
                key="reveal-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={handleReveal}
                className="w-full bg-brand-blue text-white font-black text-2xl py-5 rounded-2xl shadow-[0_6px_0_0_#1899D6] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#1899D6] active:translate-y-[6px] active:shadow-none transition-all mt-auto"
              >
                إظهار الترجمة
              </motion.button>
            ) : (
              <motion.div
                key="answer-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-auto flex flex-col items-center space-y-12"
              >
                <div className="text-3xl font-bold text-text-secondary tracking-tight border-b-2 border-dashed border-border-main pb-4 px-8 text-center min-w-[50%]">
                  {currentWord.translation}
                </div>

                <div className="w-full flex gap-4">
                  <button
                    onClick={() => handleResult(false)}
                    className="flex-1 flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/20 text-brand-red border-2 border-brand-red font-black text-xl py-5 rounded-2xl shadow-[0_6px_0_0_var(--brand-red)] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_var(--brand-red)] active:translate-y-[6px] active:shadow-none transition-all"
                  >
                    <RotateCcw className="w-6 h-6" />
                    أحتاج مراجعة
                  </button>
                  <button
                    onClick={() => handleResult(true)}
                    className="flex-1 flex items-center justify-center gap-3 bg-brand-green text-white font-black text-xl py-5 rounded-2xl shadow-[0_6px_0_0_var(--brand-green-dark)] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_var(--brand-green-dark)] active:translate-y-[6px] active:shadow-none transition-all"
                  >
                    <Check className="w-6 h-6" />
                    تذكرتها
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
