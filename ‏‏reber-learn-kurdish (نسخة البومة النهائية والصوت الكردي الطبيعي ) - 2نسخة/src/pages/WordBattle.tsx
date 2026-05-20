import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useOutfitStore } from "../store/useOutfitStore";
import { AnimatedOwlAsset } from "../components/InteractiveOwl";
import { MOCK_WORDS } from "../data/mockLessons";
import { Word } from "../types";
import { Trophy, Zap, Flame, Shield, Skull, Info, Play, Swords } from "lucide-react";
import { toast } from "sonner";

type GameState = "intro" | "matchmaking" | "playing" | "gameover";

const MAX_HP = 100;

function getRandomWords(count: number) {
  const shuffled = [...MOCK_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function WordBattle() {
  const { profile, updateProfile } = useAuthStore();
  const { equippedOutfit, equippedStyle } = useOutfitStore();

  const [gameState, setGameState] = useState<GameState>("intro");
  const [playerHp, setPlayerHp] = useState(MAX_HP);
  const [botHp, setBotHp] = useState(MAX_HP);
  const [botProfile, setBotProfile] = useState({
    name: "المنافس",
    styleId: "default",
    outfit: "default",
  });

  const [currentWord, setCurrentWord] = useState<Word>(MOCK_WORDS[0]);
  const [options, setOptions] = useState<Word[]>([]);

  const [playerStatus, setPlayerStatus] = useState<
    "idle" | "attacking" | "hit" | "dizzy" | "dead"
  >("idle");
  const [botStatus, setBotStatus] = useState<
    "idle" | "attacking" | "hit" | "dizzy" | "dead"
  >("idle");

  const [spellAnim, setSpellAnim] = useState<{
    id: number;
    from: "player" | "bot";
    type: "magic" | "fire";
  } | null>(null);

  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; text: string; side: "player" | "bot"; color: string }[]
  >([]);

  const spellIdRef = useRef(0);
  const floatIdRef = useRef(0);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addFloatingText = (text: string, side: "player" | "bot", isDamage: boolean) => {
    floatIdRef.current++;
    const id = floatIdRef.current;
    setFloatingTexts((prev) => [
      ...prev,
      {
        id,
        text,
        side,
        color: isDamage ? "text-brand-red" : "text-brand-blue",
      },
    ]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1000);
  };


  // Game Setup
  useEffect(() => {
    if (gameState === "matchmaking") {
      // Setup random bot
      const styles = ["default", "style_pink", "style_dark", "style_gold"];
      const outfits = ["default", "klaw", "jamadani", "bowtie", "glasses"];
      const names = ["آزاد", "شيركو", "نارين", "آلان", "كوردستان"];

      setBotProfile({
        name: names[Math.floor(Math.random() * names.length)],
        styleId: styles[Math.floor(Math.random() * styles.length)],
        outfit: outfits[Math.floor(Math.random() * outfits.length)],
      });

      const t = setTimeout(() => {
        setGameState("playing");
        nextRound(MAX_HP, MAX_HP);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  const nextRound = (currentP: number, currentB: number) => {
    if (currentP <= 0 || currentB <= 0) return;

    const words = getRandomWords(4);
    const target = words[Math.floor(Math.random() * 4)];
    setCurrentWord(target);
    setOptions(words);

    // Bot tries to answer after random time
    const botThinkingTime = Math.random() * 3000 + 4000; // 4 to 7 seconds
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      // Bot answers!
      // Bot accuracy: 80% correct
      const isCorrect = Math.random() > 0.2;
      handleAnswer("bot", isCorrect ? target.id : "wrong");
    }, botThinkingTime);
  };

  const handleAnswer = (actor: "player" | "bot", selectedId: string) => {
    if (gameState !== "playing") return;
    const isCorrect = selectedId === currentWord.id;

    if (actor === "player") {
      if (isCorrect) {
        castSpell("player");
      } else {
        // Player missed, maybe dizzy them
        setPlayerStatus("dizzy");
        setTimeout(() => setPlayerStatus("idle"), 1000);
      }
    } else {
      // Bot answer
      if (isCorrect) {
        castSpell("bot");
      }
    }
  };

  const castSpell = (attacker: "player" | "bot") => {
    if (gameState !== "playing") return;
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const dmg = Math.floor(Math.random() * 10) + 15; // 15-25 dmg
    spellIdRef.current++;

    setSpellAnim({ id: spellIdRef.current, from: attacker, type: "magic" });

    if (attacker === "player") {
      setPlayerStatus("attacking");
      setTimeout(() => {
        setBotStatus("hit");
        const newHp = Math.max(0, botHp - dmg);
        setBotHp(newHp);
        addFloatingText(`-${dmg}`, "bot", true);
        checkGameOver(playerHp, newHp);

        setTimeout(() => {
          setPlayerStatus("idle");
          if (newHp > 0) setBotStatus("idle");
        }, 800);
      }, 400); // sync with animation
    } else {
      setBotStatus("attacking");
      setTimeout(() => {
        setPlayerStatus("hit");
        const newHp = Math.max(0, playerHp - dmg);
        setPlayerHp(newHp);
        addFloatingText(`-${dmg}`, "player", true);
        checkGameOver(newHp, botHp);

        setTimeout(() => {
          setBotStatus("idle");
          if (newHp > 0) setPlayerStatus("idle");
        }, 800);
      }, 400);
    }
  };

  const checkGameOver = (p: number, b: number) => {
    if (p <= 0 || b <= 0) {
      setGameState("gameover");
      if (p <= 0) setPlayerStatus("dead");
      if (b <= 0) {
        setBotStatus("dead");
        // Player wins
        triggerWin();
      }
    } else {
      nextRound(p, b);
    }
  };

  const triggerWin = () => {
    const rewardXp = 50;
    toast.success(`لقد فزت! +${rewardXp} نقطة`);
    if (updateProfile && profile) {
      updateProfile({
        xp: profile.xp + rewardXp,
      });
    }
  };

  if (gameState === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] lg:min-h-[100dvh] p-4 text-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-center w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full mx-auto mb-6">
            <Swords className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mb-2">
            معارك الكلمات الحية
          </h2>
          <p className="text-zinc-500 font-medium mb-8">
            تحدَّ لاعبين آخرين وأثبت مهارتك في اللغة الكردية!
          </p>

          <div className="space-y-4 mb-8 text-right">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-700 dark:text-zinc-200">السرعة هي المفتاح</h4>
                <p className="text-sm text-zinc-500">أجب عن الكلمات أسرع من خصمك لتوجيه ضربات سحرية له.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-700 dark:text-zinc-200">احذر من الإجابات الخاطئة</h4>
                <p className="text-sm text-zinc-500">الإجابة الخاطئة ستفقدك تركيزك وتتيح الفرصة لخصمك.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-700 dark:text-zinc-200">اجمع النقاط</h4>
                <p className="text-sm text-zinc-500">اربح المعارك لتحصل على نقاط خبرة وتتصدر الترتيب.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setGameState("matchmaking")}
            className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_0_0_#14b8a6] hover:translate-y-1 hover:shadow-none transition-all outline-none"
          >
            <Play className="w-5 h-5 fill-current" />
            ابحث عن خصم
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === "matchmaking") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8"
        >
          <Shield className="w-20 h-20 text-brand-blue opacity-50" />
        </motion.div>
        <h2 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mb-4 tracking-tight">
          جاري البحث عن خصم...
        </h2>
        <p className="text-zinc-500 font-medium">استعد للمعركة الحية!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] lg:h-[100dvh] bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-50 to-zinc-50 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand-gold" />
          <h1 className="text-xl font-black text-zinc-800 dark:text-zinc-100">
            الحلبة الجليدية
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-brand-green/10 px-4 py-2 rounded-full">
          <div className="w-3 h-3 bg-brand-green rounded-full animate-pulse" />
          <span className="text-sm font-bold text-brand-green">
            مباشر (LIVE)
          </span>
        </div>
      </div>

      {/* Battle Arena View */}
      <div className="flex-1 flex flex-col justify-between p-4 md:p-8 relative max-h-[800px] mx-auto w-full max-w-4xl">
        {/* Spell Animation Layer */}
        <AnimatePresence>
          {spellAnim && (
            <motion.div
              key={spellAnim.id}
              initial={{
                x: spellAnim.from === "player" ? "15vw" : "-15vw",
                y: "5vh",
                scale: 0.5,
                opacity: 0,
                rotate: spellAnim.from === "player" ? -45 : 45
              }}
              animate={{
                x: spellAnim.from === "player" ? "-25vw" : "25vw",
                y: "-5vh",
                scale: [0.5, 2.5, 3],
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0, scale: 4 }}
              transition={{ duration: 0.4, ease: "easeIn" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            >
              <Zap
                className={cn(
                  "w-20 h-20 fill-current",
                  spellAnim.from === "player"
                    ? "text-brand-blue"
                    : "text-brand-red",
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Players Area */}
        <div className="flex justify-between items-center w-full mt-4 md:mt-10 relative">
          
          <AnimatePresence>
            {floatingTexts.map(f => (
              <motion.div
                 key={f.id}
                 initial={{ opacity: 0, y: 0, x: f.side === "player" ? "25vw" : "-25vw", scale: 0.5 }}
                 animate={{ opacity: 1, y: -50, scale: 1.2 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.7, ease: "easeOut" }}
                 className={cn("absolute text-4xl mx-auto font-black italic z-50 left-1/2 top-1/4 -translate-x-1/2 pointer-events-none drop-shadow-xl stroke-white stroke-2", f.color)}
              >
                 {f.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Opponent (Left) */}
          <div className="flex flex-col items-center gap-4 w-[40%]">
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-4 relative overflow-hidden border-2 border-zinc-300 dark:border-zinc-700">
              <motion.div
                className="absolute top-0 bottom-0 right-0 bg-brand-red"
                initial={{ width: "100%" }}
                animate={{ width: `${botHp}%` }}
                transition={{ type: "spring", bounce: 0 }}
              />
            </div>
            <div className={cn("bg-white dark:bg-zinc-900 border-4 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-2 relative transition-all", botStatus === 'attacking' ? 'border-brand-red shadow-[0_0_30px_rgba(239,68,68,0.3)]' : botStatus === 'hit' ? 'border-brand-red bg-brand-red/10' : 'border-zinc-200 dark:border-zinc-800')}>
              <motion.div
                animate={
                  botStatus === "attacking"
                    ? { x: [0, 60, -10, 0], scale: [1, 1.2, 1], rotate: [0, -15, 0] }
                    : botStatus === "hit"
                      ? { x: [0, -30, 20, -10, 10, 0], opacity: [1, 0.7, 1], rotate: [0, -10, 10, -5, 5, 0] }
                      : botStatus === "dead"
                        ? { rotate: 90, opacity: 0.5, y: 30 }
                        : { y: [0, -8, 0] }
                }
                transition={{
                  duration: botStatus === "idle" ? 2.5 : botStatus === "dead" ? 0.5 : 0.4,
                  repeat: botStatus === "idle" ? Infinity : 0,
                  ease: botStatus === "idle" ? "easeInOut" : "easeOut"
                }}
              >
                <AnimatedOwlAsset
                  className="w-24 h-24 md:w-32 md:h-32 transform -scale-x-100"
                  outfit={botProfile.outfit}
                  styleId={botProfile.styleId}
                  isDizzy={botStatus === "hit" || botStatus === "dead"}
                  funAction={botStatus === "attacking" ? "jump" : null}
                />
              </motion.div>
              <span className="font-bold text-zinc-600 dark:text-zinc-400">
                {botProfile.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center text-4xl font-black text-zinc-300 dark:text-zinc-700 italic px-4">
            VS
          </div>

          {/* Player (Right) */}
          <div className="flex flex-col items-center gap-4 w-[40%]">
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-4 relative overflow-hidden border-2 border-zinc-300 dark:border-zinc-700">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-brand-green"
                initial={{ width: "100%" }}
                animate={{ width: `${playerHp}%` }}
                transition={{ type: "spring", bounce: 0 }}
              />
            </div>
            <div className={cn("bg-white dark:bg-zinc-900 border-4 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-2 relative transition-all", playerStatus === 'attacking' ? 'border-brand-blue shadow-[0_0_30px_rgba(59,130,246,0.3)]' : playerStatus === 'hit' ? 'border-brand-red bg-brand-red/10' : 'border-brand-green/50 dark:border-brand-green/20')}>
              <motion.div
                animate={
                  playerStatus === "attacking"
                    ? { x: [0, -60, 10, 0], scale: [1, 1.2, 1], rotate: [0, 15, 0] }
                    : playerStatus === "hit"
                      ? { x: [0, 30, -20, 10, -10, 0], opacity: [1, 0.7, 1], rotate: [0, 10, -10, 5, -5, 0] }
                      : playerStatus === "dizzy"
                        ? { rotate: [0, -15, 15, -10, 10, 0] }
                        : playerStatus === "dead"
                          ? { rotate: -90, opacity: 0.5, y: 30 }
                          : { y: [0, -8, 0] }
                }
                transition={{
                  duration: playerStatus === "idle" ? 2.5 : playerStatus === "dead" ? 0.5 : 0.4,
                  repeat: playerStatus === "idle" ? Infinity : 0,
                  ease: playerStatus === "idle" ? "easeInOut" : "easeOut"
                }}
              >
                <AnimatedOwlAsset
                  className="w-24 h-24 md:w-32 md:h-32"
                  outfit={equippedOutfit}
                  styleId={equippedStyle}
                  isDizzy={
                    playerStatus === "hit" ||
                    playerStatus === "dizzy" ||
                    playerStatus === "dead"
                  }
                  funAction={playerStatus === "attacking" ? "jump" : null}
                />
              </motion.div>
              <span className="font-bold text-brand-green">
                {profile?.username || "أنت"}
              </span>
            </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="mt-auto mb-4 md:mb-8">
          {gameState === "playing" && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={currentWord.id}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-2xl border-4 border-zinc-100 dark:border-zinc-800 max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                  <Flame className="w-4 h-4" />
                  أسرع!
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-zinc-800 dark:text-zinc-100">
                  {currentWord.translation}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer("player", opt.id)}
                    className="relative group bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 text-center font-bold text-xl md:text-2xl text-zinc-700 dark:text-zinc-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-all outline-none"
                  >
                    {opt.pronunciation || opt.kurdish}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-2xl border-4 border-zinc-100 dark:border-zinc-800 max-w-md mx-auto text-center"
            >
              {playerHp > 0 ? (
                <>
                  <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-brand-green" />
                  </div>
                  <h2 className="text-3xl font-black text-brand-green mb-2 tracking-tight">
                    انتصار ساحق!
                  </h2>
                  <p className="text-zinc-500 font-medium mb-6">
                    لقد هزمت خصمك بجدارة.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Skull className="w-10 h-10 text-brand-red" />
                  </div>
                  <h2 className="text-3xl font-black text-brand-red mb-2 tracking-tight">
                    حظاً أوفر
                  </h2>
                  <p className="text-zinc-500 font-medium mb-6">
                    لقد تغلب عليك الخصم بسبب سرعتهم.
                  </p>
                </>
              )}

              <button
                onClick={() => {
                  setPlayerHp(MAX_HP);
                  setBotHp(MAX_HP);
                  setPlayerStatus("idle");
                  setBotStatus("idle");
                  setGameState("intro");
                }}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_0_0_#1d4ed8] hover:translate-y-1 hover:shadow-none transition-all outline-none"
              >
                العب مرة أخرى
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
