import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, X, Heart, Battery, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useOutfitStore } from '../store/useOutfitStore';
import { useOwlCareStore } from '../store/useOwlCareStore';
import { cn } from '../lib/utils';
import { playCuteSound } from '../lib/audio';

const MESSAGES = [
  "بژی! (أحسنت!) استمر في التعلم.",
  "هل تعلم؟ اللغة الكردية تكتب بحروف عربية أو لاتينية.",
  "هل قرأت قصة اليوم؟",
  "لا تنسَ مراجعة كلماتك المحفوظة!",
  "رێبەر هنا لمساعدتك! جرب محادثتي.",
  "الاستمرارية هي سر النجاح في تعلم اللغات.",
  "زۆر باشە! (جيد جداً!)",
  "أنا فخور بتقدمك!",
  "بەیانی باش! (صباح الخير) إذا كان الصباح 🌞",
  "ما رأيك في لعب لعبة سريعة لإنعاش ذاكرتك؟",
  "يمكنك سحبي ووضعي في أي مكان أو على حدود الشاشة حتى لا أزعجك! 😉",
  "اللغة الكردية تنتمي إلى عائلة اللغات الهندو-أوروبية.",
  "هل تعلم؟ اللهجتان الرئيسيتان في الكردية هما السورانية والكرمانجية.",
  "في اللهجة السورانية، نستخدم أبجدية معدلة من الحروف العربية."
];

const ROUTE_MESSAGES: Record<string, string> = {
  '/': "مرحباً بك في الرئيسية! جاهز لدرس جديد؟",
  '/lessons': "الدروس هنا! اختر الوحدة لنبدأ.",
  '/games': "وقت المرح! الألعاب تساعد على الحفظ.",
  '/stories': "القصص الكردية رائعة... استمع وتعلم.",
  '/profile': "هذا حسابك. انظر لتقدمك المذهل!",
  '/saved': "هنا نجمع كنز كلماتك.",
  '/ai-chat': "أهلاً بك في فصلي! اسألني عن أي شيء."
};

export const AnimatedOwlAsset: React.FC<{
  level?: number;
  outfit?: string;
  styleId?: string;
  isSleeping?: boolean;
  isCrying?: boolean;
  isEating?: boolean;
  isDizzy?: boolean;
  isWaving?: boolean;
  funAction?: 'flip' | 'jump' | 'wiggle' | null;
  className?: string;
}> = ({ level = 1, outfit = 'default', styleId = 'default', isSleeping = false, isCrying = false, isEating = false, isDizzy = false, isWaving = false, funAction = null, className }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // mousemove لا يعمل على الهاتف (touch) — نتجنب الـ listener تماماً
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute colors based on styleId, fallback to level-based for default
  let bodyColors = { stop1: "#2DD4BF", stop2: "#0D9488", stop3: "#0F766E" };
  let wingColors = { stop1: "#14B8A6", stop2: "#0F766E" };

  if (styleId === 'style_pink') {
    bodyColors = { stop1: "#F9A8D4", stop2: "#DB2777", stop3: "#9D174D" };
    wingColors = { stop1: "#F472B6", stop2: "#BE185D" };
  } else if (styleId === 'style_dark') {
    bodyColors = { stop1: "#64748B", stop2: "#334155", stop3: "#0F172A" };
    wingColors = { stop1: "#475569", stop2: "#1E293B" };
  } else if (styleId === 'style_gold') {
    bodyColors = { stop1: "#FDE047", stop2: "#EAB308", stop3: "#A16207" };
    wingColors = { stop1: "#FACC15", stop2: "#CA8A04" };
  } else {
    // Default style uses level-based colors
    if (level >= 20) {
      bodyColors = { stop1: "#A78BFA", stop2: "#7C3AED", stop3: "#4C1D95" };
      wingColors = { stop1: "#8B5CF6", stop2: "#5B21B6" };
    } else if (level >= 10) {
      bodyColors = { stop1: "#60A5FA", stop2: "#2563EB", stop3: "#1E3A8A" };
      wingColors = { stop1: "#3B82F6", stop2: "#1D4ED8" };
    }
  }

  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className || "w-20 h-20 sm:w-24 sm:h-24")}
      animate={
        funAction === 'jump' ? { y: [0, -30, 0, -15, 0] } :
          funAction === 'flip' ? { rotateY: [0, 360] } :
            funAction === 'wiggle' ? { rotate: [0, 20, -20, 15, -15, 0], scale: [1, 1.1, 1] } :
              {}
      }
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Sleep Zzzs */}
      <AnimatePresence>
        {isSleeping && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-6 right-0 text-xl text-brand-blue font-bold z-20"
          >
            Zzz
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg overflow-visible"
        style={{ willChange: 'transform' }}
        animate={
          isDizzy ? { rotate: [0, 360], scale: [1, 0.9, 1] } :
            isEating ? { scale: [1, 1.1, 1], rotate: [-5, 5, -5, 0] } :
              isCrying ? { y: [0, -2, 0, -2, 0], scale: [1, 0.95, 1] } :
                // Base breathing animation
                { scaleY: [1, 0.98, 1], y: [0, 2, 0] }
        }
        transition={
          isDizzy ? { duration: 0.5, repeat: 4 } :
            isEating ? { duration: 0.4, repeat: 2 } :
              isCrying ? { duration: 0.8, repeat: Infinity } :
                { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <defs>
          <radialGradient id="bodyGrad3D" cx="30%" cy="30%" r="70%">
            {/* 3D body gradient */}
            <stop offset="0%" stopColor={bodyColors.stop1} />
            <stop offset="50%" stopColor={bodyColors.stop2} />
            <stop offset="100%" stopColor={bodyColors.stop3} />
          </radialGradient>
          <radialGradient id="bellyGrad3D" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>
          <radialGradient id="wingGrad3D" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={wingColors.stop1} />
            <stop offset="100%" stopColor={wingColors.stop2} />
          </radialGradient>
          <radialGradient id="eyeGrad3D" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </radialGradient>
          <radialGradient id="beakGrad3D" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
          <filter id="innerGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor={"white"} floodOpacity="0.4" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
          <filter id="blurShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Shadow under the owl */}
        <ellipse cx="50" cy="92" rx="25" ry="6" fill="#000000" opacity="0.15" filter="url(#blurShadow)" />

        {/* Level Accessories (Behind) */}
        {level >= 20 && ( // Majestic cape or aura
          <motion.circle cx="50" cy="50" r="45" fill="#C4B5FD" opacity="0.4" filter="blur(4px)" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        )}

        {/* Feet */}
        <path d="M38 85 Q 32 95 28 93 L 40 93 Q 42 90 42 85 Z" fill="url(#beakGrad3D)" filter="url(#dropShadow)" />
        <path d="M62 85 Q 68 95 72 93 L 60 93 Q 58 90 58 85 Z" fill="url(#beakGrad3D)" filter="url(#dropShadow)" />

        {/* Left Wing */}
        <motion.g
          style={{ originX: "30px", originY: "45px" }}
          animate={
            isWaving ? { rotate: [0, 40, -10, 40, 0] } :
              isCrying ? { rotate: [-20, -20] } :
                { rotate: [0, -5, 0] }
          }
          transition={isWaving ? { duration: 0.6 } : { duration: 3, repeat: Infinity }}
        >
          <path d="M25 45 C 10 50, -5 70, 15 80 C 22 75, 25 65, 30 55 Z" fill="url(#wingGrad3D)" filter="url(#dropShadow) url(#innerGlow)" />
        </motion.g>

        {/* Right Wing */}
        <motion.g
          style={{ originX: "70px", originY: "45px" }}
          animate={
            isCrying ? { rotate: [20, 20] } :
              { rotate: [0, 5, 0] }
          }
          transition={{ duration: 3, repeat: Infinity }}
        >
          <path d="M75 45 C 90 50, 105 70, 85 80 C 78 75, 75 65, 70 55 Z" fill="url(#wingGrad3D)" filter="url(#dropShadow) url(#innerGlow)" />
        </motion.g>

        {/* Ears */}
        <path d="M25 35 Q 15 15 35 25 Z" fill="url(#wingGrad3D)" filter="url(#innerGlow)" />
        <path d="M75 35 Q 85 15 65 25 Z" fill="url(#wingGrad3D)" filter="url(#innerGlow)" />

        {/* Main Body */}
        <path d="M20 45 C 20 15, 80 15, 80 45 C 85 70, 75 88, 50 88 C 25 88, 15 70, 20 45 Z" fill="url(#bodyGrad3D)" filter="url(#dropShadow) url(#innerGlow)" />

        {/* Belly */}
        <path d="M30 55 C 30 40, 70 40, 70 55 C 70 75, 60 85, 50 85 C 40 85, 30 75, 30 55 Z" fill="url(#bellyGrad3D)" filter="url(#innerGlow)" />

        {/* Belly feathers/dots */}
        <path d="M45 65 Q 50 68 55 65" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M40 72 Q 45 75 50 72" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M50 72 Q 55 75 60 72" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Eyes section */}
        <g filter="url(#dropShadow)">
          {/* Eye Whites with 3D gradient */}
          <circle cx="36" cy="40" r="14" fill="url(#eyeGrad3D)" />
          <circle cx="64" cy="40" r="14" fill="url(#eyeGrad3D)" />

          {/* Pupils logic */}
          {isSleeping ? (
            <>
              {/* Closed eyes, shaped like 'U's but shallow */}
              <path d="M28 42 Q 36 48 44 42" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M56 42 Q 64 48 72 42" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : isCrying ? (
            <>
              {/* Sad eyes - slanting downwards */}
              <path d="M28 35 Q 36 32 44 40" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M56 40 Q 64 32 72 35" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="36" cy="45" r="4" fill={level >= 20 ? "#5B21B6" : level >= 10 ? "#1D4ED8" : "#0F766E"} />
              <circle cx="64" cy="45" r="4" fill={level >= 20 ? "#5B21B6" : level >= 10 ? "#1D4ED8" : "#0F766E"} />
              {/* Tears */}
              <motion.path
                d="M36 52 Q 36 58 36 60 Q 36 62 38 62 Q 40 62 40 60 Q 40 58 36 52"
                fill="#38BDF8"
                animate={{ y: [0, 5, 10], opacity: [1, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.path
                d="M64 52 Q 64 58 64 60 Q 64 62 66 62 Q 68 62 68 60 Q 68 58 64 52"
                fill="#38BDF8"
                animate={{ y: [0, 5, 10], opacity: [1, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
            </>
          ) : isDizzy ? (
            <>
              {/* Spiral eyes */}
              <motion.path
                d="M36 40 L36 38 A2 2 0 0 1 38 40 A4 4 0 0 0 34 40 A6 6 0 0 1 40 40"
                stroke="#0F766E" strokeWidth="2" fill="none" strokeLinecap="round"
                animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} style={{ originX: "36px", originY: "40px" }}
              />
              <motion.path
                d="M64 40 L64 38 A2 2 0 0 1 66 40 A4 4 0 0 0 62 40 A6 6 0 0 1 68 40"
                stroke="#0F766E" strokeWidth="2" fill="none" strokeLinecap="round"
                animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} style={{ originX: "64px", originY: "40px" }}
              />
            </>
          ) : isEating ? (
            <>
              {/* Happy eyes like ^ ^ */}
              <path d="M28 42 Q 36 35 44 42" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M56 42 Q 64 35 72 42" stroke={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#134E4A"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Normal Pupils */}
              <motion.g animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <circle cx="38" cy="40" r="6" fill={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#0F766E"} />
                <circle cx="40" cy="38" r="2.5" fill="white" />
                <circle cx="36" cy="42" r="1" fill="white" opacity="0.6" />
              </motion.g>

              <motion.g animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <circle cx="62" cy="40" r="6" fill={level >= 20 ? "#4C1D95" : level >= 10 ? "#1E3A8A" : "#0F766E"} />
                <circle cx="64" cy="38" r="2.5" fill="white" />
                <circle cx="60" cy="42" r="1" fill="white" opacity="0.6" />
              </motion.g>
            </>
          )}
        </g>

        {/* Beak */}
        <motion.path
          d="M45 47 L55 47 L50 56 Z"
          fill="url(#beakGrad3D)"
          filter="url(#dropShadow)"
          animate={isEating ? { scaleY: [1, 1.2, 1], y: [0, 1, 0] } : {}}
          transition={{ duration: 0.2, repeat: Infinity }}
          style={{ originY: "48px" }}
        />
        {/* Mouth line for beak */}
        {!isEating && <path d="M47 50 Q 50 52 53 50" stroke="#92400E" strokeWidth="1.5" fill="none" />}

        {/* Accessories (Outfit/Level) */}
        {outfit === 'jamadani' ? (
          <g transform="translate(15, -2)" filter="url(#dropShadow)">
            <path d="M10 25 Q35 5 60 25 L65 35 Q35 20 5 35 Z" fill="#B91C1C" />
            <path d="M5 35 Q35 20 65 35 Q35 45 5 35 Z" fill="#991B1B" />
            <path d="M20 15 Q30 30 40 15 M30 10 Q40 25 50 10 M15 30 Q35 20 55 30 M25 35 Q40 25 55 35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" fill="none" opacity="0.8" />
          </g>
        ) : outfit === 'klaw' ? (
          <g transform="translate(30, -5)" filter="url(#dropShadow)">
            <rect x="10" y="10" width="20" height="20" fill="#F8FAFC" rx="2" />
            <path d="M10 30 Q20 35 30 30" fill="none" stroke="#1E293B" strokeWidth="2" />
            <path d="M12 15 L28 15 M12 20 L28 20 M12 25 L28 25" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M20 10 Q30 0 35 15" fill="none" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="35" cy="15" r="2" fill="#0F172A" />
          </g>
        ) : outfit === 'shal' ? (
          <g>
            <g transform="translate(15, -2)" filter="url(#dropShadow)">
              <path d="M10 25 Q35 5 60 25 L65 35 Q35 20 5 35 Z" fill="#1E293B" />
              <path d="M5 35 Q35 20 65 35 Q35 45 5 35 Z" fill="#0F172A" />
              <path d="M20 15 Q30 30 40 15 M30 10 Q40 25 50 10 M15 30 Q35 20 55 30 M25 35 Q40 25 55 35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" fill="none" opacity="0.8" />
            </g>
            <path d="M25 65 Q50 78 75 65 Q78 72 75 75 Q50 88 25 75 Q22 72 25 65 Z" fill="#1E293B" filter="url(#dropShadow)" />
            <path d="M27 68 Q50 82 73 68 M28 72 Q50 85 72 72" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
          </g>
        ) : outfit === 'bowtie' ? (
          <g transform="translate(50, 65) scale(0.6)">
            <path d="M-15 -10 L0 0 L-15 10 Z" fill="#EF4444" />
            <path d="M15 -10 L0 0 L15 10 Z" fill="#EF4444" />
            <circle cx="0" cy="0" r="5" fill="#B91C1C" />
          </g>
        ) : outfit === 'glasses' ? (
          <g transform="translate(24, 30)" filter="url(#dropShadow)">
            <rect x="0" y="0" width="24" height="20" rx="4" fill="#000000" fillOpacity="0.6" stroke="#000000" strokeWidth="3" />
            <rect x="28" y="0" width="24" height="20" rx="4" fill="#000000" fillOpacity="0.6" stroke="#000000" strokeWidth="3" />
            <line x1="24" y1="10" x2="28" y2="10" stroke="#000000" strokeWidth="3" />
            <circle cx="15" cy="5" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="43" cy="5" r="2" fill="#FFFFFF" opacity="0.6" />
          </g>
        ) : outfit === 'headphones' ? (
          <g transform="translate(15, 10)">
            <path d="M10 30 Q35 -10 60 30" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            <rect x="5" y="25" width="10" height="25" rx="5" fill="#EF4444" />
            <rect x="55" y="25" width="10" height="25" rx="5" fill="#EF4444" />
            <rect x="0" y="30" width="5" height="15" fill="#1E293B" />
            <rect x="65" y="30" width="5" height="15" fill="#1E293B" />
          </g>
        ) : outfit === 'crown' ? (
          <g transform="translate(35, -5) scale(0.6)" filter="url(#dropShadow)">
            <path d="M10 30 L0 0 L25 15 L50 0 L40 30 Z" fill="url(#beakGrad3D)" />
            <path d="M10 30 L0 0 L25 15 L50 0 L40 30 Z" fill="none" stroke="#FEF3C7" strokeWidth="1" />
            <circle cx="0" cy="0" r="4" fill="#EF4444" filter="url(#innerGlow)" />
            <circle cx="25" cy="15" r="4" fill="#3B82F6" filter="url(#innerGlow)" />
            <circle cx="50" cy="0" r="4" fill="#EF4444" filter="url(#innerGlow)" />
          </g>
        ) : outfit === 'graduation_hat' ? (
          <g transform="translate(25, -15) scale(0.7)" filter="url(#dropShadow)">
            <path d="M0 20 L25 5 L50 20 L25 35 Z" fill="#1E293B" />
            <path d="M15 25 L15 40 Q25 45 35 40 L35 25 Z" fill="#0F172A" />
            <circle cx="25" cy="20" r="3" fill="#D97706" />
            <path d="M25 20 L40 30" stroke="#D97706" strokeWidth="2" />
            <rect x="38" y="30" width="4" height="12" fill="#D97706" />
          </g>
        ) : level >= 15 ? ( // Crown
          <g transform="translate(35, -5) scale(0.6)" filter="url(#dropShadow)">
            <path d="M10 30 L0 0 L25 15 L50 0 L40 30 Z" fill="url(#beakGrad3D)" />
            <path d="M10 30 L0 0 L25 15 L50 0 L40 30 Z" fill="none" stroke="#FEF3C7" strokeWidth="1" />
            <circle cx="0" cy="0" r="4" fill="#EF4444" filter="url(#innerGlow)" />
            <circle cx="25" cy="15" r="4" fill="#3B82F6" filter="url(#innerGlow)" />
            <circle cx="50" cy="0" r="4" fill="#EF4444" filter="url(#innerGlow)" />
          </g>
        ) : level >= 10 ? ( // Top Hat
          <g transform="translate(35, 5) scale(0.6)" filter="url(#dropShadow)">
            <rect x="5" y="0" width="40" height="25" fill="#0F172A" />
            <rect x="5" y="0" width="10" height="25" fill="#334155" opacity="0.5" />
            <rect x="0" y="20" width="50" height="5" fill="#1E293B" />
            <rect x="5" y="15" width="40" height="5" fill="#EF4444" />
          </g>
        ) : level >= 5 ? ( // Glasses
          <g transform="translate(24, 30)" filter="url(#dropShadow)">
            <rect x="0" y="0" width="24" height="20" rx="4" fill="#FFFFFF" fillOpacity="0.2" stroke="#172554" strokeWidth="3" />
            <rect x="28" y="0" width="24" height="20" rx="4" fill="#FFFFFF" fillOpacity="0.2" stroke="#172554" strokeWidth="3" />
            <line x1="24" y1="10" x2="28" y2="10" stroke="#172554" strokeWidth="3" />
            {/* Glass reflection */}
            <path d="M 2 2 L 10 18" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 30 2 L 38 18" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.6" />
          </g>
        ) : null}

      </motion.svg>
    </motion.div>
  );
};

const JOKES = [
  "لماذا تقف البومة على الشجرة؟ لأنها لو جلست ستسقط!",
  "كيف تتحدث البومة مع صديقتها؟ عن طريق البووم-ايل (البرید الالكتروني)!",
  "ماذا تقول البومة عندما تنجح؟ هوو هوو!",
];

export const InteractiveOwl: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const { equippedOutfit, equippedStyle } = useOutfitStore();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isWaving, setIsWaving] = useState(false);

  // State for tamagotchi
  const [level, setLevel] = useState(parseInt(localStorage.getItem('owl_level') || '1'));
  const [isEating, setIsEating] = useState(false);
  const [isDizzy, setIsDizzy] = useState(false);
  const [isCrying, setIsCrying] = useState(false);
  const [funAction, setFunAction] = useState<'flip' | 'jump' | 'wiggle' | null>(null);

  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<any>(null);
  const [forceShow, setForceShow] = useState(false);
  const [edge, setEdge] = useState<'left' | 'right'>('right');
  const [isPeeking, setIsPeeking] = useState(true);

  const { energy, addEnergy, updateEnergy } = useOwlCareStore();
  const isSleeping = energy <= 0;
  const isHungry = energy > 0 && energy <= 30;

  const location = useLocation();
  const navigate = useNavigate();

  // Watch for XP gain
  const prevXpRef = useRef(profile?.xp || 0);
  useEffect(() => {
    updateEnergy(); // check if energy decayed first
    if (profile && profile.xp > prevXpRef.current) {
      // they gained XP!
      const diff = profile.xp - prevXpRef.current;
      addEnergy(diff * 2); // 2 energy per XP
      if (energy <= 0) {
        showMessage("لقد استيقظت! العمل الجيد يمدني بالطاقة! ⚡", 4000);
      }
    }
    prevXpRef.current = profile?.xp || 0;
  }, [profile?.xp, energy, addEnergy, updateEnergy]);

  // Periodic energy check & tab resume check
  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy();
    }, 60000); // Check every minute

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateEnergy();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateEnergy]);

  const showMessage = useCallback((text: string, duration = 4000) => {
    setBubbleText(text);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), duration < 1000 ? duration : 1000);

    // Auto hide bubble
    const timer = setTimeout(() => {
      setBubbleText((current) => current === text ? null : current);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // React to route changes
  useEffect(() => {
    if (location.pathname.startsWith('/lessons/')) return;

    const msg = ROUTE_MESSAGES[location.pathname];
    if (msg && !isSleeping && !isDizzy) {
      const timeout = setTimeout(() => showMessage(msg), 1000);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, showMessage, isSleeping, isDizzy]);

  // Periodic random messages if idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!bubbleText && !location.pathname.startsWith('/lessons/') && !isSleeping && Math.random() < 0.2) {
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        showMessage(randomMsg);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [bubbleText, location.pathname, showMessage, isSleeping]);

  // Periodic fun animations if idle
  useEffect(() => {
    const interval = setInterval(() => {
      const funActions: Array<'flip' | 'jump' | 'wiggle'> = ['flip', 'jump', 'wiggle'];
      if (!isSleeping && !isDizzy && !isCrying && !isEating && !funAction) {
        if (Math.random() < 0.3) {
          const action = funActions[Math.floor(Math.random() * funActions.length)];
          setFunAction(action);
          setTimeout(() => setFunAction(null), 1500);
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isSleeping, isDizzy, isCrying, isEating, funAction]);

  // Listen to wrong answers in lessons
  useEffect(() => {
    const handleOwlReaction = (e: any) => {
      if (e.detail === 'cry') {
        setForceShow(true);
        setIsCrying(true);
        showMessage("واااء 😭 حاولت مساعدتك ولكنك أخطأت! ركز من فضلك!", 5000);
        setTimeout(() => {
          setIsCrying(false);
          setForceShow(false);
        }, 5000);
      }
    };
    window.addEventListener('owl-reaction', handleOwlReaction);
    return () => window.removeEventListener('owl-reaction', handleOwlReaction);
  }, [showMessage]);

  const peekTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOwlClick = () => {
    if (isPeeking) {
      setIsPeeking(false);
      if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);
      peekTimeoutRef.current = setTimeout(() => setIsPeeking(true), 10000);
      return;
    }

    // reset peek timeout on interaction
    if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);
    peekTimeoutRef.current = setTimeout(() => setIsPeeking(true), 10000);

    playCuteSound();
    if (isSleeping) {
      showMessage("Zzz... (أنا جائع لتعلم الكردية، لا أستطيع الاستيقاظ إلا بالدراسة أو محادثتي) 💤🦉", 5000);
      return;
    }

    // Tap to joke logic
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsDizzy(true);
        const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        showMessage("أووخ... رأسي يدور 😵‍💫 حسناً نكتة سريعة: " + randomJoke, 6000);
        setTimeout(() => setIsDizzy(false), 4000);
        return 0; // reset
      }
      if (clickTimer) clearTimeout(clickTimer);
      const timer = setTimeout(() => setClickCount(0), 1500); // Must tap 5 times within 1.5 seconds
      setClickTimer(timer);
      return newCount;
    });

    if (clickCount < 4 && !isDizzy) {
      if (isHungry && Math.random() < 0.5) {
        showMessage("أنا جائع جداً ونعسان! أريد بعض العناية... 🥺", 4000);
      } else {
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        showMessage(randomMsg);
      }
    }
  };

  const feedOwl = () => {
    if (!profile) return;
    if (profile.xp >= 15) { // Costs 15 XP to feed
      updateProfile({ xp: profile.xp - 15 });
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem('owl_level', newLevel.toString());
      setIsEating(true);
      addEnergy(50);
      showMessage("يممم! شكراً على الـ 15 XP! طاقة إضافية! أنا أكبر وأقوى الآن! 😋", 4000);
      setTimeout(() => setIsEating(false), 2000);
    } else {
      showMessage("ليس لديك نقاط تعلم (XP) كافية (تحتاج 15 نقطة). تعلم المزيد من الدروس أولاً!", 4000);
    }
  };

  const constraintsRef = useRef<HTMLDivElement>(null);

  // Do not show owl during active lessons UNLESS forced
  if (location.pathname.startsWith('/lessons/') && !forceShow) {
    return null;
  }

  return (
    <>
      <div className="fixed -top-10 -bottom-10 -left-10 -right-10 pointer-events-none z-0" ref={constraintsRef} />
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" dir="rtl">
        <motion.div
          drag
          dragMomentum={false}
          onDragStart={() => setIsPeeking(false)}
          onDragEnd={(e, info) => {
            const x = info.point.x;
            const isRight = x > window.innerWidth / 2;
            setEdge(isRight ? 'right' : 'left');
            setIsPeeking(true);
          }}
          initial={false}
          animate={{
            x: edge === 'right'
              ? (isPeeking ? window.innerWidth - 65 : window.innerWidth - 120)
              : (isPeeking ? -40 : 20),
            y: location.pathname === '/lessons' ? window.innerHeight - 150 : window.innerHeight - 250,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "absolute top-0 left-0 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing",
          )}
        >
          {/* Speech Bubble — يظهر على الجهة المعاكسة للحافة لتجنب الخروج من الشاشة */}
          <AnimatePresence>
            {bubbleText && !isPeeking && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                style={{
                  transformOrigin: edge === 'right' ? 'bottom right' : 'bottom left',
                  // البومة على اليمين → الفقاعة تظهر لليسار (تراجع سالب)
                  // البومة على اليسار → الفقاعة تظهر لليمين
                  [edge === 'right' ? 'right' : 'left']: 0,
                  position: 'absolute',
                  bottom: '100%',
                  marginBottom: '8px',
                }}
                className="bg-white dark:bg-zinc-800 border-2 border-brand-green/30 shadow-2xl rounded-2xl p-4 w-[210px] max-w-[75vw] pointer-events-auto"
              >
                <button
                  onClick={() => setBubbleText(null)}
                  className="absolute top-1 right-1 p-1 text-text-muted hover:text-text-main transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-sm font-bold text-text-main leading-relaxed mt-1">
                  {bubbleText}
                </p>

                {/* Interactions - Only visible when not sleeping/crying/dizzy */}
                {!isSleeping && !isCrying && !isDizzy && !location.pathname.startsWith('/lessons/') && (
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={feedOwl}
                      className="flex-1 flex justify-center items-center gap-1 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors py-1.5 px-2 rounded-lg text-[11px] font-black shadow-sm border border-rose-100 uppercase"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      أطعمني (15 XP)
                    </button>
                  </div>
                )}

                {/* ذيل الفقاعة — يتغير جانبه حسب موضع البومة */}
                {edge === 'right' ? (
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-zinc-800 border-b-2 border-r-2 border-brand-green/30 transform rotate-45" />
                ) : (
                  <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white dark:bg-zinc-800 border-b-2 border-l-2 border-brand-green/30 transform rotate-[315deg]" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Owl */}
          <div className="flex flex-col items-center pointer-events-auto relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOwlClick}
              className="relative flex items-center justify-center cursor-pointer group outline-none"
            >
              <motion.div
                animate={{
                  rotate: isPeeking ? (edge === 'right' ? -90 : 90) : 0,
                  scale: isPeeking ? 0.8 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative"
              >
                {isPeeking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-[55%] w-[86%] left-[7%] flex justify-between z-50 pointer-events-none"
                  >
                    <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm border-[1.5px] border-amber-600" />
                    <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm border-[1.5px] border-amber-600" />
                  </motion.div>
                )}
                <AnimatedOwlAsset
                  level={level}
                  outfit={equippedOutfit}
                  styleId={equippedStyle}
                  isSleeping={isSleeping}
                  isCrying={isCrying}
                  isEating={isEating}
                  isDizzy={isDizzy}
                  isWaving={isWaving}
                  funAction={funAction}
                />
              </motion.div>

              {/* Glow effect on hover */}
              {!isSleeping && !isCrying && (
                <div className="absolute inset-0 rounded-full bg-brand-green/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
              )}

              {/* Sparkles icon */}
              {!isSleeping && !isCrying && !isDizzy && (
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-0 right-0 bg-brand-gold text-white rounded-full p-1 z-20 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              )}
            </motion.button>

            {/* Energy Bar */}
            <div
              className="w-16 bg-white dark:bg-zinc-800 rounded-full p-0.5 mt-1 shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-1"
              style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            >
              <Zap className={cn("w-3 h-3 text-brand-gold", energy > 0 ? "fill-current animate-pulse" : "opacity-30")} />
              <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-500", energy > 50 ? "bg-green-500" : energy > 20 ? "bg-yellow-500" : "bg-red-500")}
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
