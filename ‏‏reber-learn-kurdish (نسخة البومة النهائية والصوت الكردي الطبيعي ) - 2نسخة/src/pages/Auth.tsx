import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  X, 
  ArrowLeft,
  BookOpen,
  Star,
  Circle,
  Gem
} from "lucide-react";
import { cn } from "../lib/utils";
import { Logo } from "../components/ui/Logo";

export function Auth() {
  const { signInWithGoogle, signInWithEmail, signInAsGuest, loading } = useAuthStore();
  
  const [step, setStep] = React.useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmail(email, password, isSignUp);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("المستخدم غير موجود.");
      else if (err.code === "auth/wrong-password") setError("كلمة المرور خاطئة.");
      else if (err.code === "auth/email-already-in-use") setError("البريد الإلكتروني مستخدم بالفعل.");
      else setError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFCF6] font-arabic relative overflow-hidden text-right"
      dir="rtl"
    >
      {/* 
          ANIMATED MESH BACKGROUND 
          Uses layered blurs and movement to create a high-end, "beautiful" atmosphere
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#E8F5E9] rounded-full blur-[140px] opacity-60" 
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[90%] h-[90%] bg-[#FFF9E6] rounded-full blur-[140px] opacity-70" 
        />
        <div 
          className="absolute top-1/3 left-1/4 w-[40%] h-[40%] bg-[#E3F2FD] rounded-full blur-[100px]" 
        />

        {/* Floating Semantic Particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
              animate={{ 
                y: [0, -40, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 10 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5 
              }}
              className="absolute"
            >
              {i % 2 === 0 ? (
                 <Star className="w-8 h-8 text-brand-gold fill-brand-gold opacity-10" />
              ) : (
                <Circle className="w-6 h-6 text-brand-green fill-brand-green opacity-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-[480px] w-full flex flex-col relative z-20">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 80 }}
          >
            <Logo size="lg" showText vertical />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center space-y-12"
            >
              {/* Premium Illustration with Layered Motion */}
              <div className="relative group">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotateY: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 h-72 bg-white/40 backdrop-blur-2xl rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(34,197,94,0.15)] flex items-center justify-center relative border-4 border-white/80 overflow-visible"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <BookOpen className="w-28 h-28 text-brand-green stroke-[1.2]" />
                  </motion.div>
                  
                  {/* Floating elements attached to the card */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      x: [0, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-6 -right-6 w-20 h-20 bg-brand-gold rounded-[2rem] shadow-2xl flex items-center justify-center border-4 border-white"
                  >
                    <Sparkles className="w-10 h-10 text-white fill-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, 10, 0],
                      x: [0, -8, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-8 -left-8 w-16 h-16 bg-brand-blue rounded-[1.5rem] shadow-2xl flex items-center justify-center border-4 border-white"
                  >
                    <Globe className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                     className="absolute top-1/4 -left-12 w-10 h-10 bg-brand-green/10 rounded-full blur-sm"
                  />
                </motion.div>
                
                {/* Visual shadow/reflex */}
                <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-[60%] h-4 bg-zinc-900/5 blur-lg rounded-full" />
              </div>

              <div className="space-y-4 px-4">
                <h2 className="text-4xl font-black text-zinc-900 leading-tight">
                  مرحباً بك في <span className="text-brand-green">رێبەر</span>: بوابتك لإتقان اللغة الكردية
                </h2>
                <p className="text-xl font-bold text-zinc-500 leading-relaxed max-w-[360px] mx-auto">
                  اكتشف متعة التعلم من خلال منهج أكاديمي مبسط وتفاعلي مصمم خصيصاً لمساعدتك على التقدم بسرعة.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34,197,94,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="group relative w-24 h-24 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-brand-green rounded-full shadow-[0_12px_30px_-5px_rgba(34,197,94,0.5)] transition-all group-hover:rotate-12" />
                <ArrowLeft className="w-12 h-12 text-white relative z-10 group-hover:-translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -100 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-zinc-900 italic">لماذا رێبەر؟</h2>
                <p className="text-zinc-500 font-bold text-lg">نجمع بين دقة المنهج وسهولة التفاعل</p>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    icon: Globe,
                    title: "نطق سليم وأصيل",
                    desc: "استمع إلى مخارج الحروف الصحيحة من متحدثين أصليين لتتقن السورانية بوضوح.",
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Sparkles,
                    title: "تعلم بذكاء",
                    desc: "دروس تفاعلية تغطي القواعد والمفردات بأسلوب عصري يحاكي احتياجاتك اليومية.",
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                  },
                  {
                    icon: Gem,
                    title: "تقدم ملموس",
                    desc: "تابع رحلتك التعليمية من خلال تقييمات ذكية تساعدك على التطور والوصول لأهدافك.",
                    color: "text-emerald-500",
                    bg: "bg-emerald-50",
                  },
                ].map((item, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx + 0.3 }}
                    key={idx}
                    className="flex items-center space-x-reverse space-x-6 bg-white/60 backdrop-blur-xl p-5 rounded-[2.5rem] border-2 border-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:scale-[1.02] transition-all group"
                  >
                    <div className={cn("p-5 rounded-[1.8rem] shrink-0 shadow-inner group-hover:rotate-6 transition-transform", item.bg, item.color)}>
                      <item.icon className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1 text-right flex-1">
                      <h4 className="text-xl font-black text-zinc-900 tracking-tight">{item.title}</h4>
                      <p className="text-sm font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center space-x-reverse space-x-5 px-2">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevStep}
                  className="w-16 h-16 bg-white/40 backdrop-blur-md text-zinc-400 rounded-3xl flex items-center justify-center border-2 border-white shadow-xl"
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="flex-1 h-16 bg-brand-green hover:bg-brand-green-dark text-white rounded-3xl font-black text-xl shadow-[0_12px_25px_rgba(34,197,94,0.3)] flex items-center justify-center space-x-reverse space-x-4"
                >
                  <span>تعرف على المنهج</span>
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-zinc-900">ابدأ رحلتك التعليمية</h2>
                <p className="text-zinc-500 font-bold text-lg">سجل الآن للوصول إلى كافة الدروس والموارد الأكاديمية</p>
              </div>

              <div className="space-y-5">
                {[
                  { 
                    label: "المتابعة باستخدام جوجل", 
                    icon: "https://www.google.com/favicon.ico", 
                    onClick: signInWithGoogle,
                    className: "bg-white text-zinc-800 border-2 border-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                  },
                  { 
                    label: "المتابعة عبر البريد", 
                    lucide: Mail, 
                    onClick: () => setStep(3),
                    className: "bg-brand-blue text-white shadow-[0_10px_25px_rgba(59,130,246,0.25)]"
                  },
                  { 
                    label: "تسجيل الدخول كزائر", 
                    lucide: Sparkles, 
                    onClick: signInAsGuest,
                    className: "bg-brand-gold text-white shadow-[0_10px_25px_rgba(217,119,6,0.25)]"
                  }
                ].map((btn, i) => (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={i}
                    disabled={loading}
                    onClick={btn.onClick}
                    className={cn(
                      "w-full h-16 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-reverse space-x-5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50",
                      btn.className
                    )}
                  >
                    {btn.icon ? (
                      <img src={btn.icon} className="w-7 h-7" alt="" />
                    ) : (
                      btn.lucide && <btn.lucide className="w-7 h-7" />
                    )}
                    <span>{btn.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={prevStep}
                  className="text-zinc-400 font-black hover:text-brand-green transition-colors flex items-center justify-center space-x-reverse space-x-2 mx-auto"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>العودة للمميزات</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-white/70 backdrop-blur-2xl rounded-[3.5rem] p-10 space-y-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] border-4 border-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-zinc-900 italic">
                    {isSignUp ? "إنشاء حساب تعليمي" : "تسجيل الدخول"}
                  </h2>
                  <p className="text-zinc-500 font-bold text-sm">أدخل بياناتك للمتابعة</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStep(2)}
                  className="p-4 bg-zinc-50 border-2 border-zinc-100 rounded-3xl text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <ArrowRight className="w-7 h-7" />
                </motion.button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-zinc-400 mr-4">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-white border-2 border-zinc-100 rounded-[1.5rem] px-6 font-bold focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-right"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-zinc-400 mr-4">كلمة المرور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white border-2 border-zinc-100 rounded-[1.5rem] px-6 font-bold focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-right"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-red-50 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-brand-blue text-white rounded-[1.8rem] font-black text-xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] disabled:opacity-50 mt-4 flex items-center justify-center"
                >
                   {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSignUp ? "إنشاء الحساب" : "دخول"}</span>
                  )}
                </motion.button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-brand-blue font-black hover:underline underline-offset-8"
                >
                  {isSignUp ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ أنشئ واحداً الآن"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-16 space-y-8">
          {step < 2 && (
            <div className="flex justify-center space-x-reverse space-x-3">
              {[0, 1].map((i) => (
                <motion.div 
                  key={i} 
                  animate={{ 
                    width: step === i ? 40 : 12,
                    backgroundColor: step === i ? "#22C55E" : "#E2E8F0"
                  }}
                  className="h-3 rounded-full shadow-sm" 
                />
              ))}
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-xs font-bold text-zinc-400 leading-relaxed max-w-[300px] mx-auto">
              باستخدامك لمنصة رێبەر، فإنك توافق على{" "}
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-brand-green font-black hover:underline"
              >
                سياسة الخصوصية وشروط الاستخدام
              </button>
            </p>
            <p className="text-[10px] font-black tracking-[0.3em] text-zinc-300 uppercase">
              REBER • ACADEMIC EXCELLENCE IN KURDISH LEARNING
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white/90 backdrop-blur-3xl w-full max-w-2xl max-h-[80vh] rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border-4 border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-zinc-900 italic">سياسة الخصوصية</h2>
                  <p className="text-zinc-400 font-bold text-sm">التزامنا بحماية معلوماتك الأكاديمية والشخصية</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-4 hover:bg-zinc-100 rounded-[2rem] transition-colors"
                >
                  <X className="w-8 h-8 text-zinc-400" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-10">
                <section className="space-y-4">
                  <h3 className="text-2xl font-black text-brand-blue italic underline decoration-brand-blue/20 underline-offset-8">المقدمة | پێشەکی</h3>
                  <p className="font-bold text-zinc-600 leading-loose text-lg">
                    تلتزم منصة رێبەر بتوفير بيئة تعليمية احترافية تحترم خصوصية المستخدم وتضمن أمن بياناته وفق المعايير التقنية العالمية.
                  </p>
                </section>
                
                <section className="space-y-4">
                  <h3 className="text-2xl font-black text-brand-green italic underline decoration-brand-green/20 underline-offset-8">حماية البيانات</h3>
                  <p className="font-bold text-zinc-600 leading-loose text-lg">
                    يتم استخدام بيانات التعلم فقط لتطوير المسار الأكاديمي وتحسين جودة المحتوى التعليمي. تضمن المنصة عدم مشاركة أي معلومات شخصية مع جهات خارجية لأغراض تجارية.
                  </p>
                </section>

                <div className="p-8 bg-zinc-50 rounded-[3rem] text-center italic font-bold text-zinc-400 border border-zinc-100">
                  تم تحديث السياسة لتتواكب مع معايير الأمان والجودة الأكاديمية في مايو 2024.
                </div>
              </div>

              <div className="p-10 bg-zinc-50/50 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-14 py-4 bg-brand-green text-white rounded-full font-black text-xl shadow-[0_15px_30px_rgba(34,197,94,0.3)]"
                >
                  استمرار
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
