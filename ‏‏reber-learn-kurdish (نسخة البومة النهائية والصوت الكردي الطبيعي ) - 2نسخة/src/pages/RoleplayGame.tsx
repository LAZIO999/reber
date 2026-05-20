import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, ArrowLeft, Store, Coffee, XCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedOwlAsset } from '../components/InteractiveOwl';
import { useOutfitStore } from '../store/useOutfitStore';
import { cn } from '../lib/utils';

// Actually let's use the local storage or just standard React hooks
// to track experience points

// Define Game Types
type Scene = {
  id: string;
  speaker: 'npc' | 'system' | 'owl';
  name?: string;
  emoji?: string; // fallback if no icon
  kurdishText?: string;
  arabicText: string;
  options?: {
    text: string; // The choice text (usually Kurdish language)
    arabicTranslation: string;
    isCorrect: boolean;
    nextSceneId?: string;
    feedback?: string;
  }[];
  nextSceneId?: string;
};

type Story = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  theme: string;
  startSceneId: string;
  scenes: Record<string, Scene>;
};

const STORIES: Story[] = [
  {
    id: "cafe",
    title: "في المقهى (لە چایخانە)",
    description: "اطلب الشاي كالمحترفين في المقهى الشعبي.",
    icon: Coffee,
    theme: "bg-orange-50 dark:bg-orange-950/20",
    startSceneId: "intro",
    scenes: {
      "intro": {
        id: "intro",
        speaker: "system",
        arabicText: "دخلت المقهى والتقيت بالنادل. إنه مشغول ويرحب بك.",
        nextSceneId: "s1"
      },
      "s1": {
        id: "s1",
        speaker: "npc",
        name: "كاميران (النادل)",
        emoji: "👨‍🍳",
        kurdishText: "بەخێربێیت! فەرموو دانیشە.",
        arabicText: "(أهلاً بك! تفضل بالجلوس)",
        options: [
          {
            text: "سوپاس، زۆر باشە",
            arabicTranslation: "شكراً، عظيم جداً",
            isCorrect: true,
            nextSceneId: "s2"
          },
          {
            text: "نەخێر",
            arabicTranslation: "لا",
            isCorrect: false,
            feedback: "الرد بـ 'لا' غير مهذب عند الترحيب!"
          }
        ]
      },
      "s2": {
        id: "s2",
        speaker: "npc",
        name: "كاميران",
        emoji: "👨‍🍳",
        kurdishText: "چیت دەوێت بەڕێز؟ چا یان قاوە؟",
        arabicText: "(ماذا تريد يا سيدي؟ شاي أم قهوة؟)",
        options: [
          {
            text: "من باشم",
            arabicTranslation: "أنا بخير",
            isCorrect: false,
            feedback: "هذا لا يجيب على سؤاله عن طلبك للشراب!"
          },
          {
            text: "چایەک، بێ زەحمەت",
            arabicTranslation: "شاي، لو سمحت",
            isCorrect: true,
            nextSceneId: "end"
          }
        ]
      },
      "end": {
        id: "end",
        speaker: "system",
        arabicText: "طلبك شاي لذيذ في الطريق! أحسنت صنعاً في طلب الشاي بالكردية ☕",
      }
    }
  },
  {
    id: "market",
    title: "في السوق (لە بازاڕ)",
    description: "اذهب إلى السوق لشراء بعض التفاح الطازج.",
    icon: Store,
    theme: "bg-green-50 dark:bg-green-950/20",
    startSceneId: "intro",
    scenes: {
      "intro": {
        id: "intro",
        speaker: "system",
        arabicText: "أنت في سوق الخضار، وتتحدث مع البائع.",
        nextSceneId: "s1"
      },
      "s1": {
        id: "s1",
        speaker: "npc",
        name: "مامۆستا (البائع)",
        emoji: "🧑‍🌾",
        kurdishText: "بەخێربێیت، سێوەکان زۆر تازەن!",
        arabicText: "(أهلاً بك، التفاح طازج جداً!)",
        options: [
          {
            text: "کیلۆی بە چەندە؟",
            arabicTranslation: "الكيلو بكام؟",
            isCorrect: true,
            nextSceneId: "s2"
          },
          {
            text: "سوپاس، دەڕۆم",
            arabicTranslation: "شكراً، سأذهب",
            isCorrect: false,
            feedback: "ما زلت تريد شراء التفاح!"
          }
        ]
      },
      "s2": {
        id: "s2",
        speaker: "npc",
        name: "مامۆستا",
        emoji: "🧑‍🌾",
        kurdishText: "کیلۆی بە هەزار دینارە.",
        arabicText: "(الكيلو بألف دينار.)",
        options: [
          {
            text: "گرانە!",
            arabicTranslation: "غالي!",
            isCorrect: false,
            feedback: "السعر جيد، ربما يمكنك شراء كيلو واحد فقط بدلاً من الشكوى."
          },
          {
            text: "یەک کیلۆم بدەرێ، تکایە.",
            arabicTranslation: "أعطني كيلو واحد، من فضلك.",
            isCorrect: true,
            nextSceneId: "end"
          }
        ]
      },
      "end": {
        id: "end",
        speaker: "system",
        arabicText: "لقد اشتريت التفاح بنجاح! طعمه يبدو لذيذاً 🍎",
      }
    }
  }
];

export function RoleplayGame() {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>('');
  
  const [wrongShake, setWrongShake] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, isError: boolean} | null>(null);
  
  const { equippedOutfit, equippedStyle } = useOutfitStore();
  const level = parseInt(localStorage.getItem('owl_level') || '1');

  const handleStartStory = (story: Story) => {
    setActiveStory(story);
    setCurrentSceneId(story.startSceneId);
    setFeedback(null);
  };

  const currentScene = activeStory ? activeStory.scenes[currentSceneId] : null;

  const handleOptionSelect = (option: any) => {
    if (option.isCorrect) {
      setFeedback({ message: "أحسنت! إجابة صحيحة.", isError: false });
      setTimeout(() => {
        setFeedback(null);
        setCurrentSceneId(option.nextSceneId);
      }, 1500);
    } else {
      setWrongShake(true);
      setFeedback({ message: option.feedback || "حاول مرة أخرى!", isError: true });
      setTimeout(() => {
        setWrongShake(false);
      }, 500);
    }
  };

  const handleNextCutscene = () => {
    if (currentScene?.nextSceneId) {
      setCurrentSceneId(currentScene.nextSceneId);
    }
  };

  if (!activeStory) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-24 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/games')}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-black mb-2 text-zinc-900 dark:text-white">قصص المحادثة</h1>
            <p className="text-zinc-500 dark:text-zinc-400">عش مغامرات تفاعلية وتعلم من خلال الاختيارات</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORIES.map(story => {
            const Icon = story.icon;
            return (
              <motion.button
                key={story.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartStory(story)}
                className={`p-6 rounded-3xl border-2 border-transparent hover:border-brand-blue/30 text-right h-full text-right ${story.theme} shadow-sm backdrop-blur-sm transition-all text-right`}
              >
                <div className="w-14 h-14 bg-white/60 dark:bg-zinc-900/40 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{story.title}</h3>
                <p className="text-zinc-700 dark:text-zinc-400 font-medium leading-relaxed mb-6 text-sm">{story.description}</p>
                
                <div className="flex items-center gap-2 text-brand-blue font-bold text-sm bg-white/40 dark:bg-black/20 w-fit px-4 py-2 rounded-full">
                  <span>ابدأ القصة</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    );
  }

  if (!currentScene) return null;

  const isStoryEnded = activeStory && !currentScene.options && !currentScene.nextSceneId;

  return (
    <div className={cn("w-full min-h-[90vh] md:min-h-[85vh] lg:min-h-screen relative overflow-hidden flex flex-col pt-16 transition-colors duration-1000", activeStory.theme)}>
      
      {/* Top Header */}
      <div className="absolute top-20 left-4 right-4 z-20 flex justify-between items-center pointer-events-auto max-w-5xl mx-auto px-4">
         <button
            onClick={() => setActiveStory(null)}
            className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-bold text-zinc-700 hover:text-brand-red transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>خروج</span>
         </button>
         
         <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2 flex items-center gap-3 rounded-full shadow-sm">
            {React.createElement(activeStory.icon, { className: "w-5 h-5 text-brand-blue" })}
            <h2 className="font-black text-zinc-900 dark:text-white capitalize">{activeStory.title}</h2>
         </div>
      </div>

      {/* Main Scene Area */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl mx-auto p-4 lg:p-8 relative mt-12 z-10">
        
        {/* Scene Characters & Dialogue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 pt-10"
          >
            
            {/* Player / System Area */}
            <div className="flex flex-col items-center gap-4">
              {currentScene.speaker !== 'system' && (
                <div className="bg-white dark:bg-zinc-900/80 p-4 rounded-3xl shadow-xl w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center border-4 border-white/50 dark:border-white/10 shrink-0">
                  <AnimatedOwlAsset 
                    level={level} 
                    outfit={equippedOutfit}
                    styleId={equippedStyle}
                  />
                </div>
              )}
            </div>

            {/* Conversation Box */}
            <div className="flex-1 w-full max-w-2xl bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-zinc-100 dark:border-zinc-800 relative z-20">
               
               {/* Speaker Tag */}
               {currentScene.name && (
                 <div className="absolute -top-5 right-8 bg-brand-blue text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                   {currentScene.emoji && <span>{currentScene.emoji}</span>}
                   {currentScene.name}
                 </div>
               )}

               {currentScene.speaker === 'system' && (
                 <div className="absolute -top-5 right-8 bg-brand-orange text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                   الراوي
                 </div>
               )}

               <div className="min-h-[120px] flex flex-col justify-center gap-4 text-center mt-2">
                 {currentScene.kurdishText && (
                   <h3 className="text-2xl md:text-3xl font-black text-brand-blue" dir="rtl">
                     {currentScene.kurdishText}
                   </h3>
                 )}
                 <p className={cn(
                   "text-zinc-600 dark:text-zinc-400 font-medium",
                   currentScene.speaker === 'system' ? "text-xl leading-relaxed text-zinc-800 dark:text-zinc-200" : "text-lg md:text-xl"
                 )}>
                   {currentScene.arabicText}
                 </p>
               </div>
            </div>

            {/* NPC Area (if any, typically visual novel has it on the other side, but we put it in the speaker tag. Let's just have an empty box or icon if NPC) */}
            {currentScene.speaker === 'npc' && (
              <div className="hidden lg:flex w-40 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-full border-4 border-white dark:border-zinc-700 items-center justify-center shadow-xl text-6xl">
                {currentScene.emoji}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Options / Action Area */}
        <div className="w-full max-w-2xl mt-8">
          
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "mb-6 p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-center",
                  feedback.isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                )}
              >
                {feedback.isError ? <XCircle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                <span>{feedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {currentScene.options ? (
            <motion.div 
               animate={wrongShake ? { x: [-10, 10, -10, 10, 0] } : {}}
               transition={{ duration: 0.4 }}
               className="flex flex-col gap-3"
            >
              {currentScene.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={!!feedback && !feedback.isError} // Disable all if correct answers chosen (during delay)
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 hover:border-brand-blue hover:shadow-md p-4 rounded-2xl flex flex-col items-center justify-center transition-all group disabled:opacity-50"
                >
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-brand-blue transition-colors">
                    {opt.text}
                  </span>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {opt.arabicTranslation}
                  </span>
                </button>
              ))}
            </motion.div>
          ) : isStoryEnded ? (
             <div className="flex justify-center">
               <button
                 onClick={() => setActiveStory(null)}
                 className="bg-brand-green text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-600 shadow-xl shadow-brand-green/20 hover:-translate-y-1 transition-all"
               >
                 إنهاء القصة ✨
               </button>
             </div>
          ) : (
            <div className="flex justify-center">
               <button
                 onClick={handleNextCutscene}
                 className="bg-brand-blue text-white w-full max-w-xs md:max-w-md flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-blue-600 shadow-xl shadow-brand-blue/20 hover:-translate-y-1 transition-all group"
               >
                 <span>متابعة</span>
                 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
