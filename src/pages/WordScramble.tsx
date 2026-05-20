import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap, Trophy, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { MOCK_WORDS } from "../data/mockLessons";
import { convertLatinToSorani } from "../lib/kurdishTransliterator";
import { playCorrectSound, playWrongSound, playFinishSound } from "../lib/audio";

export function WordScramble() {
  const { addXp } = useAuthStore();
  
  const [words, setWords] = useState<typeof MOCK_WORDS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{char: string, origIdx: number}[]>([]);
  
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState<"idle"|"correct"|"wrong">("idle");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameWords = [...MOCK_WORDS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setWords(gameWords);
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
    setupWord(gameWords[0]);
  };

  const setupWord = (wordObj: typeof MOCK_WORDS[0]) => {
    const kurdishStr = convertLatinToSorani(wordObj.kurdish).replace(/\s+/g, '');
    let chars = kurdishStr.split('');
    // Scramble logic
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setScrambledLetters(chars);
    setSelectedLetters([]);
    setStatus("idle");
  };

  const handleLetterClick = (char: string, idx: number) => {
    if (status !== "idle") return;
    
    // Remove from scrambled
    const newScrambled = [...scrambledLetters];
    newScrambled[idx] = ""; 
    setScrambledLetters(newScrambled);
    
    // Add to selected
    setSelectedLetters(prev => [...prev, {char, origIdx: idx}]);
  };

  const handleRemoveLetter = (item: {char: string, origIdx: number}, currentIdx: number) => {
     if (status !== "idle") return;
     
     // Remove from selected
     const newSel = [...selectedLetters];
     newSel.splice(currentIdx, 1);
     setSelectedLetters(newSel);

     // Put back to scrambled
     const newScrambled = [...scrambledLetters];
     newScrambled[item.origIdx] = item.char;
     setScrambledLetters(newScrambled);
  };

  const checkAnswer = () => {
    const targetWord = convertLatinToSorani(words[currentIndex].kurdish).replace(/\s+/g, '');
    const currentAttempt = selectedLetters.map(l => l.char).join('');
    
    if (currentAttempt === targetWord) {
       setStatus("correct");
       playCorrectSound();
       setScore(prev => prev + 15);
       
       setTimeout(() => {
         if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setupWord(words[currentIndex + 1]);
         } else {
            handleGameOver();
         }
       }, 1000);
    } else {
       setStatus("wrong");
       playWrongSound();
       setShake(s => s + 1);
       
       setTimeout(() => {
         // Reset for retry
         const targetWordObj = words[currentIndex];
         setupWord(targetWordObj);
       }, 1000);
    }
  };

  const handleGameOver = async () => {
    setIsGameOver(true);
    playFinishSound();
    await addXp(score + 15);
  };


  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-8 animate-in fade-in">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }} 
          transition={{ type: "spring", damping: 10 }}
          className="mx-auto w-32 h-32 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-2xl"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">أحسنت!</h2>
          <p className="text-brand-green font-black text-xl">لقد أكملت جميع الكلمات بنجاح</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-4 border-gray-50 text-center">
             <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">النقاط المكتسبة</div>
             <div className="text-4xl font-black text-brand-blue">{score + 15} XP</div>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={initializeGame}
            className="w-full h-16 bg-brand-green text-white rounded-2xl font-black text-xl shadow-[0_8px_0_0_#15803d] flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          >
            <RefreshCw className="w-6 h-6" />
            العب مرة أخرى
          </button>
          <Link to="/games">
            <button className="w-full h-14 bg-white border-2 border-gray-100 text-slate-500 rounded-2xl font-black hover:bg-gray-50 transition-colors shadow-sm">
              العودة للألعاب
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 font-arabic animate-in fade-in">
       {/* Header */}
       <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border-2 border-gray-50 shadow-sm">
        <Link to="/games" className="text-slate-400 hover:text-brand-red transition-colors">
           <ArrowRight className="w-6 h-6" />
        </Link>
        <div className="text-sm font-black text-slate-400 bg-gray-100 px-3 py-1 rounded-xl">
           {currentIndex + 1} / {words.length}
        </div>
        <div className="flex items-center gap-2 font-black text-brand-gold text-xl">
           <Zap className="w-5 h-5 fill-current" />
           {score}
        </div>
      </div>

      {currentWord && (
        <div className="bg-white rounded-[3rem] border-4 border-gray-50 p-6 sm:p-10 text-center shadow-xl shadow-gray-200/40 relative overflow-hidden">
           
           <div className="text-sm font-black text-brand-blue uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
             <AlertCircle className="w-4 h-4" />
             ما هي هذه الكلمة؟
           </div>
           
           <h2 className="text-3xl font-black text-slate-800 mb-8">{currentWord.translation}</h2>

           {/* Selected Slots */}
           <motion.div 
             key={shake}
             animate={shake > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
             transition={{ duration: 0.4 }}
             className={cn(
               "flex flex-row-reverse justify-center gap-2 mb-12 min-h-[4rem] p-4 rounded-3xl border-2 transition-colors",
               status === "correct" ? "bg-green-50 border-brand-green" : 
               status === "wrong" ? "bg-red-50 border-brand-red" : 
               "bg-gray-50 border-dashed border-gray-200"
             )}
             dir="ltr" // because Kurdish is RTL, but rendering tiles left-to-right is easier using row-reverse
           >
             <AnimatePresence>
               {selectedLetters.map((item, idx) => (
                 <motion.button
                   key={`sel-${idx}`}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   layout
                   onClick={() => handleRemoveLetter(item, idx)}
                   className={cn(
                     "w-12 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-sm font-sans transition-colors",
                     status === "correct" ? "bg-brand-green text-white shadow-green-200" :
                     status === "wrong" ? "bg-brand-red text-white shadow-red-200" :
                     "bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-blue"
                   )}
                 >
                   {item.char}
                 </motion.button>
               ))}
               
               {/* Empty slots placeholders */}
               {Array.from({ length: scrambledLetters.length - selectedLetters.length }).map((_, i) => (
                 <div key={`empty-${i}`} className="w-12 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-dashed border-slate-300 opacity-50" />
               ))}
             </AnimatePresence>
           </motion.div>

           {/* Scrambled Pool */}
           <div className="flex flex-row-reverse flex-wrap justify-center gap-3">
             {scrambledLetters.map((char, idx) => (
                <motion.div key={`scr-${idx}`} className="w-12 h-14 sm:w-16 sm:h-16">
                  {char && (
                    <motion.button
                      layoutId={`char-${char}-${idx}`}
                      onClick={() => handleLetterClick(char, idx)}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full h-full rounded-2xl bg-white border-4 border-slate-100 flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-700 shadow-md hover:border-brand-blue font-sans transition-colors"
                    >
                      {char}
                    </motion.button>
                  )}
                </motion.div>
             ))}
           </div>

           {/* Action Buttons */}
           <div className="mt-12 flex items-center justify-center gap-4">
              <button 
                onClick={checkAnswer}
                disabled={selectedLetters.length !== convertLatinToSorani(currentWord.kurdish).replace(/\s+/g, '').length || status !== "idle"}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-lg transition-all",
                  selectedLetters.length === convertLatinToSorani(currentWord.kurdish).replace(/\s+/g, '').length && status === "idle"
                    ? "bg-brand-blue text-white shadow-[0_4px_0_0_#1e40af] hover:-translate-y-1"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                تحقق
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
