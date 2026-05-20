import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Volume2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SentenceLevel {
  id: string;
  kurdish: string[]; // Correct ordered words
  translation: string;
  pronunciation: string;
}

const levels: SentenceLevel[] = [
  {
    id: "s1",
    kurdish: ["Ez", "xwendekar", "im"],
    translation: "أنا طالب",
    pronunciation: "ئەز خوەندەکار م",
  },
  {
    id: "s2",
    kurdish: ["Tu", "ji", "kû", "yî?"],
    translation: "من أين أنت؟",
    pronunciation: "تو ژ کوو ئیی؟",
  },
  {
    id: "s3",
    kurdish: ["Ew", "zimanê", "kurdî", "fêr", "dibe"],
    translation: "هو/هي يتعلم اللغة الكردية",
    pronunciation: "ئەو زمانێ کوردی فێر دبە",
  },
  {
    id: "s4",
    kurdish: ["Min", "birçî", "ye"],
    translation: "أنا جائع",
    pronunciation: "من برچی ئیە",
  },
  {
    id: "s5",
    kurdish: ["Navê", "te", "çîye?"],
    translation: "ما اسمك؟",
    pronunciation: "ناڤێ تە چییە؟",
  },
  {
    id: "s6",
    kurdish: ["Ez", "sed", "hezar", "dînar", "didim"],
    translation: "أنا أدفع مئة ألف دينار",
    pronunciation: "ئەز سەد هەزار دینار ددم",
  },
  {
    id: "s7",
    kurdish: ["Wî", "şeş", "sêv", "xwarin"],
    translation: "هو أكل ست تفاحات",
    pronunciation: "ئوی شەش سێڤ خوارن",
  },
  {
    id: "s8",
    kurdish: ["Ew", "yanzdeh", "salî", "ye"],
    translation: "عمره أحد عشر عاماً",
    pronunciation: "ئەو ئیانزدەه سالی ئیە",
  },
];

export function SentenceBuilder() {
  const navigate = useNavigate();
  const { addXp } = useAuthStore();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "checking">("idle");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const currentLevel = levels[currentLevelIdx];

  useEffect(() => {
    if (currentLevel) {
      // Shuffle words for available
      const shuffled = [...currentLevel.kurdish].sort(
        () => Math.random() - 0.5,
      );
      setAvailableWords(shuffled);
      setSelectedWords([]);
      setStatus("idle");
    }
  }, [currentLevel, currentLevelIdx]);

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (status !== "idle") return;

    if (fromAvailable) {
      setAvailableWords((prev) => prev.filter((w) => w !== word));
      setSelectedWords((prev) => [...prev, word]);
    } else {
      setSelectedWords((prev) => prev.filter((w) => w !== word));
      setAvailableWords((prev) => [...prev, word]);
    }
  };

  const handleCheck = () => {
    if (selectedWords.length !== currentLevel.kurdish.length) return;

    setStatus("checking");

    const isCorrect =
      selectedWords.join(" ") === currentLevel.kurdish.join(" ");

    setTimeout(() => {
      if (isCorrect) {
        setStatus("success");
        setScore((prev) => prev + 10);
      } else {
        setStatus("idle");
        setAvailableWords(
          currentLevel.kurdish.slice().sort(() => Math.random() - 0.5),
        );
        setSelectedWords([]);
      }
    }, 1000);
  };

  const handleNext = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      setGameOver(true);
      addXp(score);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-arabic space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-[0_8px_0_0_#D49B00] mb-8"
        >
          <Trophy className="w-16 h-16" />
        </motion.div>
        <h2 className="text-4xl font-black text-text-secondary text-center">
          عمل رائع!
        </h2>
        <p className="text-xl text-text-muted text-center">
          لقد أكملت تكوين الجمل بنجاح
        </p>
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-full border-2 border-border-main">
          <Trophy className="w-6 h-6 text-brand-gold" />
          <span className="text-xl font-black text-text-secondary">
            +{score} XP
          </span>
        </div>
        <button
          onClick={() => navigate("/games")}
          className="mt-8 bg-brand-blue text-white font-black text-xl px-12 py-4 rounded-full border-b-4 border-[#1899D6] hover:translate-y-[2px] hover:border-b-2 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          العودة للألعاب
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 font-arabic text-right mb-24 lg:mb-0"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-card-bg p-6 rounded-3xl border-2 border-border-main shadow-sm">
        <button
          onClick={() => navigate("/games")}
          className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-2 border-border-main"
        >
          <ArrowRight className="w-6 h-6 text-text-secondary" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black text-text-secondary">
            تكوين الجمل
          </h1>
          <span className="text-sm font-bold text-text-muted">
            المستوى {currentLevelIdx + 1} من {levels.length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20">
          <Trophy className="w-5 h-5 text-brand-gold" />
          <span className="font-black text-brand-gold">{score}</span>
        </div>
      </div>

      <div className="bg-card-bg border-2 border-border-main rounded-[2.5rem] p-8 shadow-sm space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-brand-blue tracking-tight">
            {currentLevel.translation}
          </h2>
          <div className="flex mx-auto items-center justify-center gap-2 pt-4">
            <span className="text-brand-blue font-bold tracking-wide text-lg bg-brand-blue/10 px-5 py-2 rounded-full">
              {currentLevel.pronunciation}
            </span>
          </div>
        </div>

        {/* Selected Words Area */}
        <div className="min-h-[100px] border-b-2 border-dashed border-border-main pb-8 flex flex-wrap gap-3 items-center justify-center pt-4">
          {selectedWords.length === 0 && (
            <span className="text-text-muted font-medium text-lg opacity-50">
              اضغط على الكلمات لترتيبها هنا...
            </span>
          )}
          <AnimatePresence>
            {selectedWords.map((word, idx) => (
              <motion.button
                key={`sel-${word}-${idx}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => handleWordClick(word, false)}
                className={cn(
                  "text-xl font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_0_var(--border-main)] transition-all cursor-pointer font-sans",
                  status === "success"
                    ? "bg-brand-green text-white border-brand-green-dark shadow-[0_4px_0_0_var(--brand-green-dark)] cursor-default"
                    : status === "checking"
                      ? "bg-zinc-200 text-zinc-500 border-zinc-300 shadow-[0_4px_0_0_#D4D4D8] cursor-default"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-2 border-border-main dark:border-zinc-700 hover:border-brand-blue hover:text-brand-blue dark:hover:border-brand-blue dark:hover:text-brand-blue shadow-[0_4px_0_0_var(--border-main)] dark:shadow-none",
                )}
                disabled={status !== "idle"}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Available Words */}
        <div className="flex flex-wrap gap-4 items-center justify-center min-h-[80px]">
          <AnimatePresence>
            {availableWords.map((word, idx) => (
              <motion.button
                key={`av-${word}-${idx}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => handleWordClick(word, true)}
                className="bg-white dark:bg-zinc-800 border-2 border-border-main dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xl font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_0_var(--border-main)] dark:shadow-none cursor-pointer hover:border-brand-blue hover:text-brand-blue dark:hover:text-brand-blue dark:hover:border-brand-blue active:translate-y-1 active:shadow-none transition-all font-sans"
                disabled={status !== "idle"}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {status === "idle" &&
          selectedWords.length === currentLevel.kurdish.length && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={handleCheck}
              className="w-full bg-brand-green text-white font-black text-2xl py-5 rounded-2xl shadow-[0_6px_0_0_var(--brand-green-dark)] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_var(--brand-green-dark)] active:translate-y-[6px] active:shadow-none transition-all"
            >
              تحقق
            </motion.button>
          )}

        {status === "success" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-6 border-2 border-brand-green mt-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-brand-green text-xl">
                  إجابة صحيحة!
                </h3>
                <p className="text-brand-green/80 font-bold">
                  {currentLevel.translation}
                </p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="bg-brand-green text-white font-black px-8 py-3 rounded-full hover:bg-brand-green-dark transition-colors"
            >
              التالي
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
