import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star } from "lucide-react";
import { useXPAnimationStore } from "../store/useXPAnimationStore";

export function XPAnimationManager() {
  const { xpToAnimate, levelUp, triggerId, clearAnimation } =
    useXPAnimationStore();

  useEffect(() => {
    if (xpToAnimate !== null) {
      const timer = setTimeout(() => {
        clearAnimation();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [triggerId, xpToAnimate, clearAnimation]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {xpToAnimate !== null && (
          <motion.div
            key={`xp-${triggerId}`}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center pointer-events-auto"
          >
            <div className="bg-brand-blue border-4 border-whtie shadow-[0_8px_0_0_#1899D6] text-white px-8 py-4 rounded-full text-3xl font-black mb-4 flex items-center gap-3">
              <Star className="w-8 h-8 fill-yellow-400 stroke-yellow-500" />
              <span>+{xpToAnimate} خبرة</span>
            </div>

            {levelUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className="bg-brand-green border-4 border-white shadow-[0_8px_0_0_#1E8449] text-white px-10 py-6 rounded-3xl text-center space-y-2 mt-4"
              >
                <div className="flex justify-center mb-2">
                  <div className="bg-white/20 p-4 rounded-full inline-block">
                    <Trophy className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                  </div>
                </div>
                <h2 className="text-2xl opacity-90 font-bold uppercase tracking-widest">
                  مستوى جديد!
                </h2>
                <div className="text-6xl font-black">المستوى {levelUp}</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
