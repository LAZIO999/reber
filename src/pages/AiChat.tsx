import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Send,
  Sparkles,
  Languages,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Hash,
  Brain,
  Info,
  Mic
} from "lucide-react";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { aiService, ChatMessage } from "../services/aiService";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedOwlAsset } from "../components/InteractiveOwl";

const SUGGESTION_CATEGORIES = [
  {
    id: "grammar",
    label: "قواعد",
    icon: <BookOpen className="w-3 h-3" />,
    phrases: [
      "اشرح الماضي المستمر", 
      "اشرح حروف الجر", 
      "اشرح ضمائر الملكية", 
      "اشرح أسلوب الشرط", 
      "اشرح زمن المستقبل", 
      "تحدي قواعد",
      "كيف تعمل الإضافة (Izafa)؟",
      "قواعد الجمع في السورانية"
    ]
  },
  {
    id: "conv",
    label: "محادثات",
    icon: <MessageSquare className="w-3 h-3" />,
    phrases: [
      "محادثة في السوق", 
      "محادثة في التاكسي", 
      "محادثة في الفندق", 
      "محادثة تعارف", 
      "محادثة في المستشفى", 
      "كيف أطلب الطعام؟",
      "عبارات الترحيب والوداع",
      "كيف أسأل عن الوقت؟"
    ]
  },
  {
    id: "vocab",
    label: "مفردات",
    icon: <Sparkles className="w-3 h-3" />,
    phrases: [
      "ترجم كلمة دڵتەنگ", 
      "ترجم كلمة ئابووری", 
      "ما معنى چۆنی؟", 
      "ما معنى بەڵام؟", 
      "كيف أقول أنا مريض؟", 
      "كيف أقول شكراً جزيلاً؟", 
      "كيف أقول أحبك؟", 
      "ما هي الألوان الأساسية؟",
      "أسماء أيام الأسبوع",
      "أفراد العائلة بالكردية"
    ]
  },
  {
    id: "numbers",
    label: "أرقام",
    icon: <Hash className="w-3 h-3" />,
    phrases: [
      "كيف أقول الرقم 154؟", 
      "ترجم الرقم 2024", 
      "اختبار في الأرقام", 
      "كيف اقول الرقم 5000", 
      "ترجم الرقم 1000000",
      "الأرقام من 1 إلى 10"
    ]
  },
  {
    id: "practice",
    label: "تدريب",
    icon: <Brain className="w-3 h-3" />,
    phrases: [
      "أعطني تدريباً", 
      "أريد اختباراً", 
      "تصريف فعل يأكل", 
      "تصريف فعل يذهب", 
      "تصريف فعل ينام",
      "ترجم جملة: أنا أدرس الكردية"
    ]
  }
];

// Helper to determine owl's emote based on chat context
const getEmoteFromText = (text: string) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('خطأ') || lowerText.includes('آسف') || lowerText.includes('للأسف')) {
    return { isCrying: true };
  }
  if (lowerText.includes('ممتاز') || lowerText.includes('أحسنت') || lowerText.includes('رائع') || lowerText.includes('صحيح') || lowerText.includes('برافو') || lowerText.includes('عظيم')) {
    return { funAction: 'jump' as const };
  }
  if (lowerText.includes('مرحبا') || lowerText.includes('أهلا') || lowerText.includes('سلاو') || lowerText.includes('بەخێر')) {
    return { isWaving: true };
  }
  if (lowerText.includes('فكر') || lowerText.includes('اممم') || lowerText.includes('ربما')) {
    return { isDizzy: true };
  }
  return {};
};

import { useOutfitStore } from '../store/useOutfitStore';
import { useOwlCareStore } from '../store/useOwlCareStore';

export function AiChat() {
  const { profile } = useAuthStore();
  const { equippedOutfit } = useOutfitStore();
  const { addEnergy } = useOwlCareStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("grammar");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Derive emotion for header from last AI message
  const lastAiMessage = [...messages].reverse().find(m => m.role === 'model')?.text || '';
  const currentGlobalEmote = getEmoteFromText(lastAiMessage);


  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA'; // Default to Arabic for better recognition of the user's base language

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setInput('');
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Microphone error", e);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput !== undefined ? forcedInput : input;
    if (!textToSend.trim() || loading) return;

    const userMessage = textToSend.trim();
    if (forcedInput === undefined) {
      setInput("");
    }
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const responseText = await aiService.askAI(
        userMessage,
        messages,
        profile,
      );
      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
      addEnergy(10); // Gain energy for chatting
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-orange-50/30 font-arabic overflow-hidden relative",
        "fixed inset-x-0 top-[61px] lg:static lg:h-full lg:rounded-[2.5rem] lg:border-2 lg:border-orange-100 shadow-2xl shadow-orange-200/20"
      )}
      style={{ 
        overscrollBehaviorY: 'none',
        bottom: 'calc(65px + env(safe-area-inset-bottom))'
      }}
      dir="rtl"
    >
      {/* Background Mesh Effect - Sunny & Warm */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-200/40 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/30 blur-[100px]" />
      </div>

      {/* Header - Vibrant & Bright */}
      <header className="h-[75px] shrink-0 bg-white/90 backdrop-blur-xl border-b border-orange-100/50 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-13 h-13 bg-white rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100/30 border-2 border-emerald-100"
            >
              <AnimatedOwlAsset outfit={equippedOutfit} className="w-10 h-10" {...(loading ? { isDizzy: true } : currentGlobalEmote)} />
            </motion.div>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 border-3 border-white rounded-full shadow-sm" 
            />
          </div>
          <div>
            <h2 className="font-black text-lg text-slate-800 leading-tight">
              المعلم رێبەر
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <p className="text-[12px] text-emerald-600 font-black tracking-wide uppercase">
                بانتظارك الآن ✨
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-11 h-11 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all active:scale-95 shadow-sm border border-emerald-100/50">
            <Info className="w-5.5 h-5.5 text-emerald-600" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-7 scroll-smooth z-10 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 space-y-10"
            >
              <div className="space-y-5">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-32 h-32 bg-white rounded-[2rem] shadow-2xl shadow-orange-200/50 mx-auto border-2 border-emerald-100 flex items-center justify-center"
                >
                  <AnimatedOwlAsset level={10} outfit={equippedOutfit} className="w-24 h-24" />
                </motion.div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    يوم جديد.. رحلة جديدة! ☀️
                  </h3>
                  <p className="text-base text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                    أنا المعلم رێبەر، جاهز لنبدأ معاً أجمل تجربة لتعلم اللغة الكردية. ماذا نحضر اليوم؟
                  </p>
                </div>
              </div>

              {/* Categorized Prompts - Playful Style */}
              <div className="w-full max-w-3xl space-y-5">
                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                  {SUGGESTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap shadow-lg border-2",
                        activeCategory === cat.id
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 -translate-y-1"
                          : "bg-white text-slate-600 border-white hover:border-emerald-200 hover:text-emerald-600 shadow-orange-100/50"
                      )}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-wrap justify-center gap-3"
                    >
                      {SUGGESTION_CATEGORIES.find(c => c.id === activeCategory)?.phrases.map((phrase, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(phrase)}
                          className="px-5 py-2.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl text-[13px] font-black text-slate-700 shadow-md border-2 border-white hover:border-emerald-200 active:scale-95 transition-all flex items-center gap-2 group"
                        >
                          {phrase}
                          <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rotate-180" />
                        </button>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={cn(
                  "flex w-full mb-2",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] lg:max-w-[75%] p-5 rounded-[1.8rem] shadow-xl relative group",
                    isUser
                      ? "bg-gradient-to-br from-sky-500 to-indigo-500 text-white rounded-tr-none shadow-sky-500/20"
                      : "bg-white text-slate-800 rounded-tl-none border-2 border-white shadow-orange-100/50"
                  )}
                >
                  {!isUser && (
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-emerald-100 rotate-[-12deg]">
                      <AnimatedOwlAsset outfit={equippedOutfit} className="w-8 h-8" {...getEmoteFromText(m.text)} />
                    </div>
                  )}
                  <div className={cn(
                    "prose prose-sm max-w-none font-bold leading-relaxed",
                    isUser ? "text-white prose-invert" : "text-slate-800"
                  )}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                  <div className={cn(
                    "text-[10px] mt-3 font-black flex items-center gap-1",
                    isUser ? "justify-end text-sky-50 opacity-80" : "text-slate-400 opacity-60"
                  )}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border-2 border-white flex items-center gap-4">
              <div className="flex gap-1.5">
                <motion.span animate={{ scale: [1, 1.5, 1], backgroundColor: ['#10b981', '#34d399', '#10b981'] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2.5 h-2.5 rounded-full" />
                <motion.span animate={{ scale: [1, 1.5, 1], backgroundColor: ['#10b981', '#34d399', '#10b981'] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full" />
                <motion.span animate={{ scale: [1, 1.5, 1], backgroundColor: ['#10b981', '#34d399', '#10b981'] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full" />
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">المعلم رێبەر يفكر...</span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Input Section - Cheerful & Floating */}
      <footer className="p-5 bg-white/70 backdrop-blur-2xl border-t-2 border-white z-30">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "جاري الاستماع..." : "اكتب شيئاً مبهجاً لنتعلمه..."}
              className="w-full bg-white py-4 pr-12 pl-14 rounded-3xl text-sm font-bold text-slate-800 placeholder-slate-400 outline-none border-2 border-slate-100 focus:border-emerald-400 transition-all shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <Languages className="w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            {recognitionRef.current && (
               <button 
                 onClick={toggleListening}
                 className={cn(
                   "absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl transition-all",
                   isListening 
                     ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse scale-105" 
                     : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95"
                 )}
               >
                 <Mic className="w-5 h-5" />
               </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={cn(
              "w-14 h-14 rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-emerald-500/20",
              input.trim() 
                ? "bg-emerald-500 text-white" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-white"
            )}
          >
            <Send className="w-6 h-6 transform rotate-180" />
          </motion.button>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fed7aa;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fdba74;
        }
      `}</style>
    </div>
  );
}

