import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  ArrowRight,
  Trophy,
  BookOpen,
  Brain,
  Star,
  Bookmark,
  Sparkles,
  Zap,
  ChevronRight,
  Volume2,
  VolumeX,
  Baseline,
  Lightbulb
} from "lucide-react";
import { MOCK_WORDS, MOCK_LESSONS } from "../data/mockLessons";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useWordStore } from "../store/useWordStore";
import { WordImage } from "../components/WordImage";
import { toast } from "sonner";
import { playCorrectSound, playWrongSound, playFinishSound, playKurdishAudio } from "../lib/audio";
import { convertLatinToSorani, convertSoraniToLatin } from "../lib/kurdishTransliterator";
import { MOCK_SENTENCES } from "../data/sentencesData";

const MOTIVATIONAL_MESSAGES = [
  { msg: "رائع! أنت تتحسن بسرعة 🚀", sub: "استمر في التعلم للوصول إلى الطلاقة" },
  { msg: "عمل ممتاز! عقلك يشتغل بكامل طاقته 💪", sub: "كل كلمة تتعلمها خطوة نحو الأمام" },
  { msg: "أنت نجم اليوم! ⭐", sub: "المثابرة هي سر النجاح" },
  { msg: "ما شاء الله عليك! 🎉", sub: "أنت أقرب من أي وقت مضى للإتقان" },
  { msg: "خطوة بخطوة نحو الطلاقة! 🌟", sub: "الاستمرار هو المفتاح" },
];

// Confetti particle
function ConfettiDot({ delay, x, color, size }: { delay: number; x: number; color: string; size: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: -20, x, rotate: 0 }}
      animate={{ opacity: 0, y: 350, x: x + (Math.random() - 0.5) * 200, rotate: 720 }}
      transition={{ duration: 2.5, delay, ease: "easeIn" }}
      className={`absolute top-0 ${color} rounded-sm pointer-events-none`}
      style={{ width: size, height: size }}
    />
  );
}

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  delay: i * 0.06,
  x: (Math.random() - 0.5) * 400,
  color: ["bg-yellow-400","bg-green-400","bg-blue-400","bg-pink-400","bg-purple-400","bg-orange-400","bg-red-400","bg-teal-400"][i % 8],
  size: Math.random() * 10 + 5,
}));

type LessonPhase = "learning" | "quiz" | "sentence" | "complete";

export function Lessons() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, updateLessonProgress, addXp } = useAuthStore();
  const { toggleSaveWord, isWordSaved, fetchSavedWords, handleFailedWord } = useWordStore();

  const [phase, setPhase] = useState<LessonPhase>("learning");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [shakeKey, setShakeKey] = useState(0); // triggers shake animation
  
  // Sentence building state
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sentenceStatus, setSentenceStatus] = useState<"idle" | "success" | "checking">("idle");
  const [sentenceScore, setSentenceScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const speechSupported = "speechSynthesis" in window;

  // Reset state when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setPhase("learning");
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizScore(0);
    setShakeKey(0);
    setAvailableWords([]);
    setSelectedWords([]);
    setSentenceStatus("idle");
    setSentenceScore(0);
    setShowHint(false);
  }, [id]);

  const lesson = MOCK_LESSONS.find((l) => l.id === id) || MOCK_LESSONS[0];
  const allWords = MOCK_WORDS.filter((w) => w.category === lesson.categoryId);
  const wordsPerLesson = 6;
  const startIdx = (lesson.order - 1) * wordsPerLesson;
  let words = allWords.slice(startIdx, startIdx + wordsPerLesson);
  if (words.length === 0 && allWords.length > 0) {
    words = allWords.slice(0, wordsPerLesson);
  }
  const currentWord = words[currentStep] || words[0];

  const allSentences = MOCK_SENTENCES.filter((s) => s.category === lesson.categoryId || s.category === "daily");
  const sentences = allSentences.length > 0 ? allSentences.slice(0, 2) : MOCK_SENTENCES.slice(0, 2);
  const currentSentence = sentences[currentStep] || sentences[0];

  const totalSteps = words.length * 2 + sentences.length;
  const currentProgress =
    phase === "learning"
      ? (currentStep / totalSteps) * 100
      : phase === "quiz"
      ? ((words.length + currentStep) / totalSteps) * 100
      : ((words.length * 2 + currentStep) / totalSteps) * 100;

  useEffect(() => {
    if (profile?.uid) fetchSavedWords(profile.uid);
  }, [profile?.uid, fetchSavedWords]);

  // Setup sentence builder for the current sentence
  useEffect(() => {
    if (phase === "sentence" && currentSentence) {
      const kurdishWords = currentSentence.kurdish.split(" ");
      setAvailableWords([...kurdishWords].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setSentenceStatus("idle");
      setShowHint(false);
    }
  }, [phase, currentStep, currentSentence]);

  React.useEffect(() => {
    if (id && profile) {
      const currentStatus = profile.lessonProgress?.[id]?.status;
      if (!currentStatus || currentStatus === "started") {
        updateLessonProgress(id, "in-progress", currentProgress);
      }
    }
  }, [id, profile, updateLessonProgress, currentProgress]);

  const handleNext = async () => {
    if (phase === "learning" || phase === "quiz") {
      if (currentStep < words.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        if (phase === "learning") {
          setPhase("quiz");
          setCurrentStep(0);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          setPhase("sentence");
          setCurrentStep(0);
        }
      }
    } else if (phase === "sentence") {
      if (currentStep < sentences.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleFinishLesson();
      }
    }
  };

  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  const handleQuizAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return;
    const correct = answer === currentWord.translation;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) {
      playCorrectSound();
      setQuizScore((prev) => prev + 1);
      setWrongAnswersCount(0); // Reset on correct answer
    } else {
      playWrongSound();
      setShakeKey((k) => k + 1); // trigger shake
      
      const newWrongCount = wrongAnswersCount + 1;
      setWrongAnswersCount(newWrongCount);
      if (newWrongCount >= 2) {
        window.dispatchEvent(new CustomEvent('owl-reaction', { detail: 'cry' }));
      }

      if (profile) {
        handleFailedWord(profile.uid, currentWord);
        toast.info("تمت إضافة الكلمة للمراجعة الذكية", {
          icon: <Brain className="w-5 h-5 text-brand-blue" />,
          style: { fontFamily: 'inherit' }
        });
      }
    }
  };

  const handleFinishLesson = async () => {
    if (!profile) return;
    if (id) await updateLessonProgress(id, "completed", 100);
    await addXp(lesson.xpReward + quizScore * 5 + sentenceScore * 10);
    playFinishSound();
    setPhase("complete");
  };

  const handleSentenceWordClick = (word: string, fromAvailable: boolean) => {
    if (sentenceStatus !== "idle") return;
    if (fromAvailable) {
      setAvailableWords((prev) => prev.filter((w) => w !== word));
      setSelectedWords((prev) => [...prev, word]);
    } else {
      setSelectedWords((prev) => prev.filter((w) => w !== word));
      setAvailableWords((prev) => [...prev, word]);
    }
  };

  const handleCheckSentence = () => {
    const kurdishWords = currentSentence.kurdish.split(" ");
    if (selectedWords.length !== kurdishWords.length) return;
    setSentenceStatus("checking");
    const correct = selectedWords.join(" ") === kurdishWords.join(" ");

    setTimeout(() => {
      if (correct) {
        setSentenceStatus("success");
        setSentenceScore((prev) => prev + 1);
        playCorrectSound();
      } else {
        setSentenceStatus("idle");
        setAvailableWords([...kurdishWords].sort(() => Math.random() - 0.5));
        setSelectedWords([]);
        setShakeKey((k) => k + 1);
        playWrongSound();
      }
    }, 800);
  };

  const motivationalMsg = useMemo(() => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)], []);

  const options = useMemo(() => {
    if (phase !== "quiz" || !currentWord) return [];
    const wrongOnes = MOCK_WORDS.filter((w) => w.translation !== currentWord.translation).map((w) => w.translation);
    const shuffled = [...wrongOnes].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffled, currentWord.translation].sort(() => 0.5 - Math.random());
  }, [currentWord, phase]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      
      if (e.key === "Enter") {
        e.preventDefault();
        if (phase === "learning") {
          handleNext();
        } else if (phase === "quiz" && selectedAnswer !== null) {
          handleNext();
        } else if (phase === "sentence") {
          if (sentenceStatus === "success") {
            handleNext();
          } else if (
            sentenceStatus === "idle" &&
            currentSentence &&
            selectedWords.length === currentSentence.kurdish.split(" ").length
          ) {
            handleCheckSentence();
          }
        } else if (phase === "complete") {
          // You could also handle finish next here, but we will leave this logic to the button for now
        }
      } else if (e.code === "Space") {
        e.preventDefault();
        // Keyboard audio trigger removed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, selectedAnswer, sentenceStatus, selectedWords, currentWord, currentSentence, handleNext, handleCheckSentence]);

  if (phase === "complete") {
    const currentIndex = MOCK_LESSONS.findIndex((l) => l.id === id);
    const nextLesson = currentIndex !== -1 && currentIndex < MOCK_LESSONS.length - 1 ? MOCK_LESSONS[currentIndex + 1] : null;
    const totalXP = lesson.xpReward + quizScore * 5 + sentenceScore * 10;
    const scorePercent = Math.round(((quizScore + sentenceScore) / (words.length + sentences.length)) * 100);

    return (
      <div key={id} className="fixed inset-0 bg-bg-main z-[100] flex flex-col font-arabic overflow-y-auto pb-32" dir="rtl">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-200/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full" />
        </div>

        <div className="absolute inset-0 pointer-events-none">{CONFETTI.map((c, i) => <ConfettiDot key={i} {...c} />)}</div>
        
        <div className="max-w-md mx-auto px-6 py-16 space-y-10 text-center relative z-10 w-full">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-36 h-36 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-[3rem] flex items-center justify-center shadow-deep border-4 border-card-bg rotate-3"
          >
            <Trophy className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>

          <div className="space-y-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-black text-text-main tracking-tight"
            >
              اكتمل الدرس! 🎉
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-brand-green text-2xl font-black"
            >
              {motivationalMsg.msg}
            </motion.p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "نقطة", value: `+${totalXP}`, color: "text-amber-600", border: "border-amber-200/50" },
              { icon: Brain, label: "إجابات", value: `${quizScore}/${words.length}`, color: "text-brand-blue", border: "border-blue-200/50" },
              { icon: Star, label: "دقة", value: `${scorePercent}%`, color: "text-brand-green", border: "border-green-200/50" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={cn("bg-card-bg border rounded-[2rem] p-5 shadow-soft", stat.border)}
              >
                <stat.icon className={cn("w-7 h-7 mx-auto mb-3", stat.color)} />
                <div className={cn("text-2xl font-black", stat.color)} dir="ltr">{stat.value}</div>
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 pt-6">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (nextLesson) {
                  navigate(`/lessons/${nextLesson.id}`);
                } else {
                  navigate("/lessons");
                }
              }} 
              className="w-full h-18 bg-brand-green text-white rounded-3xl font-black text-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-4 hover:shadow-green-500/50 transition-all"
            >
              <span>{nextLesson ? "الدرس التالي" : "العودة للدروس"}</span>
              <ArrowRight className="w-7 h-7 rotate-180" />
            </motion.button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full h-16 bg-card-bg border-2 border-border-main rounded-3xl font-black text-text-secondary hover:bg-bg-main transition-all shadow-soft"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={id} className="fixed inset-0 bg-bg-main z-[100] flex flex-col font-arabic overflow-hidden" dir="rtl">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-orange-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-brand-green/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="shrink-0 flex items-center gap-4 px-6 pt-safe border-b border-border-main/50 bg-card-bg/90 backdrop-blur-md sticky top-0 z-10 pb-4 mt-2">
        <button 
          onClick={() => navigate("/lessons")} 
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:gap-2 bg-white dark:bg-zinc-800 rounded-2xl border-2 border-border-main shadow-sm text-text-main hover:text-brand-red hover:border-brand-red/50 transition-all font-bold"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">خروج</span>
        </button>
        <div className="flex-1 h-3 bg-white dark:bg-zinc-800 rounded-full border-2 border-border-main shadow-inner overflow-hidden p-0.5">
          <motion.div 
            className="h-full bg-brand-green rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
            initial={{ width: 0 }} 
            animate={{ width: `${currentProgress}%` }} 
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl border-2 border-border-main shadow-sm text-sm font-black min-w-[4.5rem]">
          <span className="text-brand-green">{currentStep + 1}</span>
          <span className="text-text-muted opacity-50">/</span>
          <span className="text-text-main">{phase === "sentence" ? sentences.length : words.length}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 pt-2 sm:pt-6 pb-12 sm:pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={phase + currentStep} 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 1.05, y: -20 }} 
            className="w-full max-w-lg space-y-4 sm:space-y-6"
          >
            
            {/* Phase Info */}
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.div 
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className={cn(
                  "inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border-main bg-card-bg shadow-sm",
                  phase === "learning" ? "text-brand-blue" : phase === "quiz" ? "text-brand-gold" : "text-brand-green"
                )}
              >
                {phase === "learning" ? <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : phase === "quiz" ? <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Baseline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                  {phase === "learning" ? "مرحلة التعلم" : phase === "quiz" ? "مرحلة الاختبار" : "تطبيق عملي"}
                </span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight px-4 pb-1">
                {phase === "learning" ? "احفظ هذه الكلمة" : phase === "quiz" ? "ما هي الترجمة الصحيحة؟" : "رتب الكلمات لتكوين الجملة"}
              </h1>
            </div>

            {/* Word Card */}
            {(phase === "learning" || phase === "quiz") && (
              <div className="bg-card-bg rounded-[2rem] sm:rounded-[2.5rem] border border-border-main shadow-deep overflow-hidden text-center p-2 sm:p-3">
                {phase === "learning" && (
                  <div className="bg-bg-main rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative group">
                    <WordImage 
                      src={currentWord.imageUrl} 
                      emoji={currentWord.emoji} 
                      alt="" 
                      className="w-full transition-all duration-700 h-32 sm:h-64 object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 relative">
                  {phase === "learning" && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => profile && toggleSaveWord(profile.uid, currentWord)} 
                      className={cn(
                        "absolute top-0 right-0 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-2xl border transition-all shadow-sm z-10", 
                        isWordSaved(currentWord.id) ? "bg-brand-gold text-white border-transparent shadow-brand-gold/20" : "bg-card-bg border-border-main text-text-muted"
                      )}
                    >
                      <Bookmark className={cn("w-5 h-5 sm:w-6 sm:h-6", isWordSaved(currentWord.id) && "fill-current")} />
                    </motion.button>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-0">
                    <div className="flex flex-col items-center justify-center gap-3 sm:gap-6">
                      <h2 className={cn("font-black tracking-tight text-text-main drop-shadow-sm", phase === "learning" ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl")} dir="rtl">
                        {convertLatinToSorani(currentWord.kurdish)}
                      </h2>
                      {/* Audio Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playKurdishAudio(currentWord.kurdish)}
                        className="relative flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-6 sm:px-8 py-2 sm:py-3 rounded-2xl bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors border-2 border-brand-blue/20 hover:border-brand-blue/50 dark:bg-brand-blue/20 dark:text-brand-blue dark:border-brand-blue/30 shadow-sm"
                        title="استمع للنطق"
                      >
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span className="font-bold text-sm sm:text-base">استمع للنطق</span>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {phase === "learning" && (
                    <div className="pt-4 sm:pt-8 border-t border-border-main/50 sm:mt-6 mt-4">
                      <div className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-widest mb-1.5 sm:mb-3">الترجمة بالعربية</div>
                      <p className="text-2xl sm:text-4xl font-black text-text-main">{currentWord.translation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Options (Only in Quiz) - stylized grid with shake on wrong */}
            {phase === "quiz" && (
              <motion.div
                key={shakeKey}
                animate={shakeKey > 0 ? { x: [0, -10, 10, -8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 gap-3"
              >
                {options.map((option, i) => (
                  <motion.button 
                    key={option} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    disabled={selectedAnswer !== null} 
                    onClick={() => handleQuizAnswer(option)} 
                    className={cn(
                      "w-full p-4 sm:p-6 rounded-2xl sm:rounded-[1.8rem] border-2 font-black text-lg sm:text-xl transition-all text-right flex items-center justify-between group shadow-soft", 
                      selectedAnswer === option 
                        ? (isCorrect ? "border-brand-green bg-green-500 text-white shadow-lg shadow-green-500/20" : "border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/20") 
                        : (selectedAnswer !== null && option === currentWord.translation 
                            ? "border-brand-green/50 bg-card-bg opacity-50" 
                            : "border-border-main bg-card-bg hover:border-brand-green/30 hover:bg-bg-main")
                    )}
                  >
                    <span className="group-active:scale-95 transition-transform">{option}</span>
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shadow-inner",
                      selectedAnswer === option 
                        ? "bg-white/20 text-white" 
                        : "bg-bg-main text-text-muted"
                    )}>
                      {selectedAnswer === option ? (isCorrect ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <X className="w-5 h-5 sm:w-6 sm:h-6" />) : <div className="w-2.5 h-2.5 bg-border-main rounded-full" />}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Sentence Builder Phase */}
            {phase === "sentence" && (
              <div className="bg-card-bg rounded-[2rem] sm:rounded-[2.5rem] border border-border-main shadow-deep p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div className="text-center space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main leading-tight">
                    {currentSentence.arabic}
                  </h2>
                  <div className="flex flex-col items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowHint(true)}
                      disabled={showHint || sentenceStatus !== "idle"}
                      className={cn("px-4 sm:px-6 py-2 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm sm:text-base", 
                        showHint ? "bg-brand-gold/10 text-brand-gold opacity-50 cursor-not-allowed" : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"
                      )}
                    >
                      <Lightbulb className="w-5 h-5" />
                      <span>هل تحتاج مساعدة؟</span>
                    </motion.button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-brand-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black shadow-lg shadow-brand-gold/30 text-xl sm:text-2xl"
                        >
                          {currentSentence.kurdish}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="min-h-[120px] sm:min-h-[160px] bg-bg-main border-2 border-dashed border-border-main rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-wrap gap-2 sm:gap-4 items-center justify-center relative">
                  {selectedWords.length === 0 && <span className="text-text-muted font-bold text-sm sm:text-lg text-center opacity-60">رتب الكلمات هنا لتكوين الجملة...</span>}
                  <AnimatePresence mode="popLayout">
                    {selectedWords.map((word, idx) => (
                      <motion.button 
                        key={`sel-${word}-${idx}`} 
                        layoutId={`word-${word}`} 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.8, opacity: 0 }} 
                        onClick={() => handleSentenceWordClick(word, false)}
                        className={cn("text-lg sm:text-xl font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-[1.2rem] border-2 transition-all shadow-soft font-sans", 
                          sentenceStatus === "success" ? "bg-brand-green text-white border-transparent" : 
                          sentenceStatus === "checking" ? "bg-bg-main text-text-muted border-border-main" : 
                          "bg-card-bg border-border-main text-text-main")}
                        disabled={sentenceStatus !== "idle"}
                      >
                        {word}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center pt-2 sm:pt-4">
                  <AnimatePresence mode="popLayout">
                    {availableWords.map((word, idx) => (
                      <motion.button 
                        key={`av-${word}-${idx}`} 
                        layout 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ scale: 0.8, opacity: 0 }} 
                        onClick={() => handleSentenceWordClick(word, true)}
                        className="bg-card-bg border-2 border-border-main text-text-main text-lg sm:text-xl font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-[1.2rem] shadow-soft hover:border-brand-blue hover:text-brand-blue transition-all font-sans"
                        disabled={sentenceStatus !== "idle"}
                      >
                        {word}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls - Sticky at bottom */}
      <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-border-main/50 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] relative z-50">
        <div className="w-full max-w-lg mx-auto space-y-3 sm:space-y-4">
          {/* Correct/Wrong Message - Modern style */}
          <AnimatePresence>
            {phase === "quiz" && selectedAnswer !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }}
                className={cn(
                  "p-4 rounded-2xl border flex items-center gap-4 shadow-sm mb-4", 
                  isCorrect ? "bg-green-50/80 border-green-200 text-green-700" : "bg-red-50/80 border-red-200 text-red-700"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  isCorrect ? "bg-green-500 text-white" : "bg-brand-red text-white"
                )}>
                  {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg font-black">{isCorrect ? "مذهل! إجابة صحيحة 🎉" : "أوه، الإجابة خاطئة"}</div>
                  {!isCorrect && <div className="text-sm font-bold opacity-80">الصحيح هو: {currentWord.translation}</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button - High-end CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={phase === "sentence" && sentenceStatus === "idle" && selectedWords.length === currentSentence.kurdish.split(" ").length ? handleCheckSentence : handleNext}
            disabled={(phase === "quiz" && selectedAnswer === null) || (phase === "sentence" && sentenceStatus === "idle" && selectedWords.length !== currentSentence.kurdish.split(" ").length) || sentenceStatus === "checking"}
            className={cn(
              "w-full h-16 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden",
              ((phase === "quiz" && selectedAnswer === null) || (phase === "sentence" && sentenceStatus === "idle" && selectedWords.length !== currentSentence.kurdish.split(" ").length) || sentenceStatus === "checking")
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                : "bg-brand-green text-white shadow-[0_8px_0_0_#15803d] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none"
            )}
          >
            <span>
              {phase === "learning" 
                ? (currentStep === words.length - 1 ? "بدء الاختبار السريع" : "الكلمة التالية") 
                : phase === "quiz"
                ? (currentStep === words.length - 1 ? "تطبيق عملي" : "السؤال التالي")
                : phase === "sentence" && sentenceStatus === "idle"
                ? "تحقق من الإجابة"
                : phase === "sentence" && sentenceStatus === "success"
                ? (currentStep === sentences.length - 1 ? "مشاهدة النتائج" : "الجملة التالية")
                : "متابعة"
              }
            </span>
            {!(phase === "sentence" && sentenceStatus === "idle") && <ChevronRight className="w-6 h-6 rotate-180" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
