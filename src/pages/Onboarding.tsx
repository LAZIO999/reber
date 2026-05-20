import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { firestoreService } from "../services/firestoreService";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { Dialect, Language } from "../types";

import { Logo } from "../components/ui/Logo";

export function Onboarding() {
  const { user, profile, initialize } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selections, setSelections] = useState({
    dialect: "Sorani" as Dialect,
    language: "Arabic" as Language,
  });

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    const newProfile = {
      uid: user.uid,
      username: user.displayName || "Learner",
      email: user.email || "",
      photoURL: user.photoURL || "",
      xp: 0,
      streak: 0,
      level: 1,
      selectedDialect: selections.dialect,
      learningLanguage: selections.language,
      lastActive: new Date().toISOString(),
      completedLessons: [],
    };

    await firestoreService.createUserProfile(newProfile);
    initialize(); // Refresh store
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-bg-main dark:bg-zinc-950 flex items-center justify-center p-6 font-arabic"
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-12">
        <div className="flex justify-center">
          <Logo size="md" showText />
        </div>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-text-secondary">
                  اختر اللهجة
                </h2>
                <p className="text-text-muted">
                  اختر نسخة اللغة الكردية التي تريد تعلمها أولاً.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    id: "Sorani",
                    name: "صورانية",
                    desc: "الكردية الوسطى، تركيز الدورة الأساسي",
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() =>
                      setSelections({ ...selections, dialect: d.id as Dialect })
                    }
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all text-right group brutal-button shadow-sm bg-white dark:bg-zinc-900",
                      selections.dialect === d.id
                        ? "border-brand-blue shadow-[0_4px_0_0_#1899D6]"
                        : "border-border-main hover:border-zinc-300",
                    )}
                  >
                    <div className="space-y-1">
                      <p className="font-black text-lg text-text-secondary">
                        {d.name}
                      </p>
                      <p className="text-xs text-text-muted font-medium">
                        {d.desc}
                      </p>
                    </div>
                    {selections.dialect === d.id && (
                      <Check className="text-brand-blue w-6 h-6" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full h-16 bg-brand-green hover:bg-brand-green-dark text-white rounded-2xl font-black text-lg shadow-[0_6px_0_0_#1E8449] active:shadow-none active:translate-y-1.5 transition-all flex items-center justify-center space-x-reverse space-x-2 brutal-button"
              >
                <span>التالي</span>
                <ChevronRight className="w-5 h-5 transform rotate-180" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-text-secondary">
                  لغتك الأم؟
                </h2>
                <p className="text-text-muted">
                  سنستخدم هذه اللغة للترجمات والتعليمات.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { id: "Arabic", name: "العربية" },
                  { id: "English", name: "الإنجليزية" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      setSelections({
                        ...selections,
                        language: l.id as Language,
                      })
                    }
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all text-right group brutal-button shadow-sm bg-white dark:bg-zinc-900",
                      selections.language === l.id
                        ? "border-brand-blue shadow-[0_4px_0_0_#1899D6]"
                        : "border-border-main hover:border-zinc-300",
                    )}
                  >
                    <p className="font-black text-lg text-text-secondary">
                      {l.name}
                    </p>
                    {selections.language === l.id && (
                      <Check className="text-brand-blue w-6 h-6" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex space-x-reverse space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-black text-lg transition-all"
                >
                  رجوع
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-[2] h-14 bg-brand-green hover:bg-brand-green-dark text-white rounded-2xl font-black text-lg shadow-[0_4px_0_0_#46A302] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center space-x-reverse space-x-2 disabled:opacity-50 brutal-button"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>ابدأ التعلم</span>
                      <ChevronRight className="w-5 h-5 transform rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
