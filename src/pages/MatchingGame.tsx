import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Trophy, ArrowRight, Zap, RefreshCw, X, Check } from "lucide-react";
import { MOCK_WORDS } from "../data/mockLessons";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { playCorrectSound, playWrongSound, playFinishSound } from "../lib/audio";
import { convertLatinToSorani } from "../lib/kurdishTransliterator";

type Card = {
  id: string;
  text: string;
  matchId: string;
  type: "kurdish" | "arabic";
  isMatched: boolean;
};

export function MatchingGame() {
  const { addXp } = useAuthStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Pick 6 random words
    const shuffledWords = [...MOCK_WORDS].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    let gameCards: Card[] = [];
    shuffledWords.forEach(word => {
      gameCards.push({
        id: `k-${word.id}`,
        text: convertLatinToSorani(word.kurdish),
        matchId: word.id,
        type: "kurdish",
        isMatched: false
      });
      gameCards.push({
        id: `a-${word.id}`,
        text: word.translation,
        matchId: word.id,
        type: "arabic",
        isMatched: false
      });
    });

    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    setScore(0);
    setMistakes(0);
    setIsGameOver(false);
  };

  const handleCardClick = (card: Card) => {
    if (card.isMatched || selectedCards.find(c => c.id === card.id) || selectedCards.length === 2) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].matchId === newSelected[1].matchId && newSelected[0].type !== newSelected[1].type) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.matchId === newSelected[0].matchId ? { ...c, isMatched: true } : c
          ));
          setSelectedCards([]);
          setScore(s => s + 10);
          playCorrectSound();
          
          // Check game over
          if (cards.filter(c => c.isMatched).length === cards.length - 2) {
             handleGameOver();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setSelectedCards([]);
          setMistakes(m => m + 1);
          playWrongSound();
        }, 800);
      }
    }
  };

  const handleGameOver = async () => {
    setIsGameOver(true);
    playFinishSound();
    const finalScore = score + 10;
    const bonus = Math.max(0, 30 - mistakes * 5); // perfect game gets +30
    await addXp(finalScore + bonus);
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
          <h2 className="text-3xl font-black text-slate-800 mb-2">لعبة رائعة!</h2>
          <p className="text-brand-green font-black text-xl">لقد أنهيت المطابقة بنجاح</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-4 border-gray-50 flex justify-around">
           <div className="text-center">
             <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">النقاط</div>
             <div className="text-3xl font-black text-brand-blue">{score + 10}</div>
           </div>
           <div className="w-1 bg-gray-100 rounded-full" />
           <div className="text-center">
             <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">الأخطاء</div>
             <div className={cn("text-3xl font-black", mistakes === 0 ? "text-brand-green" : "text-brand-red")}>{mistakes}</div>
           </div>
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

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 font-arabic animate-in fade-in">
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border-2 border-gray-50 shadow-sm">
        <Link to="/games" className="text-slate-400 hover:text-brand-blue transition-colors">
           <ArrowRight className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-2 font-black text-brand-blue text-xl">
           <Zap className="w-5 h-5 fill-current" />
           {score}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        <AnimatePresence>
          {cards.map((card, idx) => {
             const isSelected = selectedCards.find(c => c.id === card.id);
             return (
               <motion.button
                 key={card.id}
                 layout
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 whileHover={!card.isMatched && !isSelected ? { y: -5 } : {}}
                 whileTap={!card.isMatched ? { scale: 0.95 } : {}}
                 onClick={() => handleCardClick(card)}
                 disabled={card.isMatched || isSelected !== undefined}
                 className={cn(
                   "aspect-[4/3] rounded-3xl border-4 flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden",
                   card.isMatched ? "bg-gray-50 border-gray-100 opacity-50 shadow-inner" :
                   isSelected ? "bg-brand-blue/10 border-brand-blue text-brand-blue shadow-lg shadow-blue-100" :
                   "bg-white border-white shadow-md hover:shadow-xl hover:border-gray-50 text-slate-700 font-sans"
                 )}
               >
                 {/* Match overlay */}
                 {card.isMatched && (
                   <motion.div 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="absolute inset-0 bg-brand-green/20 flex items-center justify-center p-2"
                   >
                     <Check className="w-10 h-10 text-brand-green opacity-50" />
                   </motion.div>
                 )}

                 <span className={cn(
                   "font-black text-center break-words w-full",
                   card.type === "kurdish" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                 )} dir={card.type === "kurdish" ? "rtl" : "rtl"}>
                   {card.text}
                 </span>
               </motion.button>
             );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
