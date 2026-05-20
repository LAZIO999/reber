import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bookmark, Trash2, Search, ArrowRight, BookOpen } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useWordStore } from "../store/useWordStore";
import { WordImage } from "../components/WordImage";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export function SavedWords() {
  const { profile } = useAuthStore();
  const { savedWords, fetchSavedWords, toggleSaveWord, loading } =
    useWordStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.uid) {
      fetchSavedWords(profile.uid);
    }
  }, [profile?.uid, fetchSavedWords]);

  const filteredWords = savedWords.filter(
    (w) =>
      w.kurdish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 pb-20 font-arabic text-right animate-in fade-in duration-700"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-reverse space-x-3 text-brand-gold">
            <Bookmark className="w-8 h-8 fill-current" />
            <h1 className="text-4xl font-black text-text-secondary tracking-tight">
              كلماتي المحفوظة
            </h1>
          </div>
          <p className="text-text-muted font-medium pr-11">
            الكلمات التي اخترتها لمراجعتها لاحقاً
          </p>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="بحث عن كلمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-white dark:bg-zinc-900 border-2 border-border-main rounded-2xl pr-12 pl-4 focus:border-brand-blue outline-none transition-all font-medium text-text-secondary"
          />
        </div>
      </div>

      {loading && savedWords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">
            جاري تحميل الكلمات...
          </p>
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-border-main border-dashed">
          <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-300">
            <Bookmark className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-text-secondary">
              لا توجد كلمات محفوظة
            </h3>
            <p className="text-text-muted">
              ابدأ بحفظ الكلمات التي تجدها صعبة خلال الدروس!
            </p>
          </div>
          <button
            onClick={() => navigate("/lessons")}
            className="px-8 h-14 bg-brand-blue text-white rounded-2xl font-black shadow-[0_4px_0_0_#1899D6] brutal-button flex items-center gap-2"
          >
            <span>اكتشف الكلمات</span>
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredWords.map((word, idx) => (
              <motion.div
                key={word.wordId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group bg-card-bg rounded-[2rem] border-2 border-border-main p-6 flex items-center justify-between hover:border-brand-gold transition-all"
              >
                <div className="flex items-center space-x-reverse space-x-6">
                  <WordImage
                    src={word.imageUrl}
                    emoji={word.emoji}
                    alt={word.kurdish}
                    className="w-16 h-16 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:scale-110 transition-transform shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-brand-green leading-none">
                        {word.kurdish}
                      </h3>
                    </div>
                    {word.pronunciation && (
                      <div className="pt-1 pb-1">
                        <span className="inline-block bg-brand-blue/10 text-brand-blue font-bold px-4 py-1.5 rounded-full text-base md:text-lg tracking-wide">
                          {word.pronunciation}
                        </span>
                      </div>
                    )}
                    <p className="text-text-muted font-medium">
                      {word.translation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-reverse space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      profile &&
                      toggleSaveWord(profile.uid, {
                        id: word.wordId,
                        kurdish: word.kurdish,
                        translation: word.translation,
                        pronunciation: word.pronunciation || "",
                      } as any)
                    }
                    className="p-3 rounded-xl bg-red-50 text-brand-red hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Practice CTA */}
      {savedWords.length >= 5 && (
        <section className="bg-brand-blue rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_8px_0_0_#1899D6]">
          <div className="space-y-2 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-3xl font-black">جاهز للمراجعة؟</h2>
            </div>
            <p className="text-blue-50 font-medium">
              تدرب على كلماتك المحفوظة لترسيخها في ذاكرتك
            </p>
          </div>
          <button
            onClick={() => navigate("/saved/review")}
            className="px-10 h-16 bg-white text-brand-blue rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <span>بدء المراجعة</span>
            <ArrowRight className="w-6 h-6 transform rotate-180" />
          </button>
        </section>
      )}
    </div>
  );
}
