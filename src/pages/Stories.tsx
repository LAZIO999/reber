import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Book, Play, Lock, Sparkles, Star, ChevronLeft, Volume2, Gamepad2, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { playCorrectSound, playKurdishAudio } from "../lib/audio";
import { convertLatinToSorani, convertSoraniToLatin } from "../lib/kurdishTransliterator";

// Mock Story Data
const STORIES = [
  {
    id: "s1",
    title: "مغامرة في أربيل",
    kurdishTitle: "سەرکێشییەک لە هەولێر",
    level: 1,
    xpReward: 50,
    coverColor: "from-orange-400 to-red-500",
    image: "🏰",
    parts: [
      {
        kurdish: "Rojekê, Azad û malbata xwe çûn Hewlêrê ji bo serdanekê. Ew di rê de gelek kêfxweş bûn û li benda dîtina cihên nû bûn.",
        arabic: "في يوم ما، ذهب آزاد وعائلته إلى أربيل في زيارة. كانوا سعداء جداً في الطريق وينتظرون رؤية أماكن جديدة.",
        image: "🚗"
      },
      {
        kurdish: "Gava ew gihîştin, dîtina yekem ya wan Qeleyê Hewlêrê bû. Qele pir mezin, kevn û bi heybet bû li serê girsekî.",
        arabic: "عندما وصلوا، كانت نظرتهم الأولى على قلعة أربيل. القلعة كانت كبيرة جداً، قديمة، ومهيبة على قمة التل.",
        image: "🏰"
      },
      {
        kurdish: "Zarokan li derdora Qeleyê bazdan û wêneyên xweşik girtin. Ew tevlî geştyarên din bûn û li ser dîroka ew cih fêr bûn.",
        arabic: "ركض الأطفال حول القلعة والتقطوا صوراً جميلة. انضموا إلى سياح آخرين وتعلموا عن تاريخ ذلك المكان.",
        image: "📸"
      },
      {
        kurdish: "Piştre, ew çûn sûkê û li wê derê çayeke germ xwarin. Azad go: ev rojeke herî xweş bû!",
        arabic: "بعد ذلك، ذهبوا إلى السوق وهناك شربوا شاياً ساخناً. قال آزاد: هذا كان أجمل يوم!",
        image: "☕"
      }
    ]
  },
  {
    id: "s2",
    title: "صديق جديد",
    kurdishTitle: "هاوڕێیەکی نوێ",
    level: 2,
    xpReward: 100,
    coverColor: "from-blue-400 to-cyan-500",
    image: "🤝",
    parts: [
      {
        kurdish: "Deh saliya Şêrko dest pê kir, asîman şîn bû û ew ji bo roja yekem a dibistanê amade bû. Wî pir hez dikir hevalên nû nas bike.",
        arabic: "بدأت سنة شيركو العاشرة، السماء كانت زرقاء وكان مستعداً لليوم الأول في المدرسة. كان يحب جداً أن يتعرف على أصدقاء جدد.",
        image: "🎒"
      },
      {
        kurdish: "Gava çû polê, li kêleka wî xortekî nû dît ku navê wî Alan bû. Alan hinekî şermok bû û kes nas nedikir.",
        arabic: "عندما دخل الصف، رأى بجانبه فتى جديداً اسمه آلان. آلان كان خجولاً بعض الشيء ولم يكن يعرف أحداً.",
        image: "👨‍🏫"
      },
      {
        kurdish: "Şêrko bi rûyekî ken de çû ba wî û jê re pênûsek da, û got: Na xeme, em ê bi hev re fêr bibin.",
        arabic: "ذهب شيركو إليه بوجه مبتسم وأعطاه قلماً، وقال: لا تقلق، سوف نتعلم معاً.",
        image: "✏️"
      },
      {
        kurdish: "Ji wê rojê pê ve, ew bûn hevalên herî baş û her dem bi hev re dilîstin û daxwînin. Êdî dibistan jê re xweştir bû.",
        arabic: "منذ ذلك اليوم، أصبحا أفضل صديقين ولعبا ودرسا معاً دائماً. أصبحت المدرسة أجمل بالنسبة له.",
        image: "👬"
      }
    ]
  },
  {
    id: "s3",
    title: "الطبيعة الساحرة",
    kurdishTitle: "سروشتی دڵڕفێن",
    level: 4,
    xpReward: 150,
    coverColor: "from-green-400 to-emerald-600",
    image: "🏔️",
    parts: [
      {
        kurdish: "Di werza biharê de, çiyayên Kurdistanê kesk û xweşik in. Pêlên bayê teze dilê mirov ferah dike.",
        arabic: "في فصل الربيع، جبال كردستان خضراء وجميلة. أمواج الهواء النقي تريح القلب.",
        image: "🌱"
      },
      {
        kurdish: "Em çûn gundekî biçûk da ku li xwezaya pak binêrin û bêhna gulên biharê bigirin. Dîmenekê tijî kulîlkên rengareng hebû.",
        arabic: "ذهبنا إلى قرية صغيرة لكي ننظر إلى الطبيعة النقية ونشم رائحة ورود الربيع. كان هناك منظر مليء بالورود الملونة.",
        image: "🌸"
      },
      {
        kurdish: "Min dît ku çûkekî biçûk li ser darekê distirê, û robar bi hêdî diherikî. Dengê avê aramî da min.",
        arabic: "رأيت عصفوراً صغيراً يغني على شجرة، والنهر يجري ببطء. صوت الماء أعطاني الهدوء.",
        image: "🐦"
      },
      {
        kurdish: "Ew bîranînekê qet ji bîr nabe. Min fam kir ku parastina jîngehê gelek girîng e ji bo me hemûyan.",
        arabic: "إنها ذكرى لا تُنسى أبداً. أدركت أن حماية البيئة مهمة جداً لنا جميعاً.",
        image: "🌍"
      }
    ]
  },
  {
    id: "s4",
    title: "آرام والطائر",
    kurdishTitle: "ئارام و باڵندەکە",
    level: 1,
    xpReward: 70,
    coverColor: "from-purple-400 to-indigo-500",
    image: "📖",
    audioUrl: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0334937835.firebasestorage.app/o/tts_3aae5ee71676487a8cab3ddf095ead16ARAM.mp3?alt=media&token=250add5e-29db-4474-bf54-165a0aab44b4", 
    parts: [
      {
        kurdish: "ڕۆژێک، کوڕێک بە ناوی ئارام لە گوندێکی بچووک دەژیا. ئارام زۆر حەزی لە خوێندنەوە بوو. هەموو ڕۆژێک کتێبێکی نوێ دەخوێندەوە.",
        arabic: "في يوم من الأيام، كان هناك ولد اسمه آرام يعيش في قرية صغيرة. آرام كان يحب القراءة كثيراً. كل يوم كان يقرأ كتاباً جديداً.",
        image: "👦"
      },
      {
        kurdish: "ڕۆژێک لە باخچەکەیاندا باڵندەیەکی بریندار دۆزییەوە. ئەو باڵندەکەی برد بۆ ماڵەوە و چارەسەری کرد.",
        arabic: "في أحد الأيام وجد طائراً جريحاً في حديقتهم. أخذ الطائر إلى المنزل وعالجه.",
        image: "🐦"
      },
      {
        kurdish: "دوای چەند ڕۆژێک، باڵندەکە باش بووەوە و فڕی. ئارام زۆر دڵخۆش بوو، چونکە یارمەتی ژیانێکی کردبوو.",
        arabic: "بعد بضعة أيام، تعافى الطائر وطار. كان آرام سعيداً جداً، لأنه ساعد في إنقاذ حياة.",
        image: "🕊️"
      }
    ]
  }
];

export function Stories() {
  const { profile, addXp } = useAuthStore();
  const [selectedStory, setSelectedStory] = useState<typeof STORIES[0] | null>(null);
  const [currentPart, setCurrentPart] = useState(0);
  const [showArabic, setShowArabic] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleOpenStory = (story: typeof STORIES[0]) => {
    setSelectedStory(story);
    setCurrentPart(0);
    setShowArabic(new Array(story.parts.length).fill(false));
    setIsFinished(false);
  };

  const handleNextPart = () => {
    if (selectedStory && currentPart < selectedStory.parts.length - 1) {
      setCurrentPart(p => p + 1);
    } else {
      setIsFinished(true);
      playCorrectSound();
      addXp(selectedStory?.xpReward || 50);
    }
  };

  const toggleTranslation = (idx: number) => {
    const newArr = [...showArabic];
    newArr[idx] = true;
    setShowArabic(newArr);
  };

  const readText = async (text: string) => {
    if (selectedStory?.audioUrl) {
      try {
        const audio = new Audio(selectedStory.audioUrl);
        await audio.play();
        return;
      } catch (err) {
        console.error("Failed to play custom story audio", err);
      }
    }
    await playKurdishAudio(text);
  };

  // 1. Stories List View
  if (!selectedStory) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 font-arabic animate-in fade-in">
        
        <div className="bg-white rounded-3xl p-8 border-4 border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[60px] pointer-events-none" />
           <div className="text-center md:text-right relative z-10">
             <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-3">
               <Book className="w-4 h-4" />
               مكتبة القصص
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">اقرأ وتعلم</h1>
             <p className="text-slate-500 font-bold mt-2 text-sm max-w-sm">طور مهاراتك في القراءة والاستماع من خلال قصص قصيرة ممتعة.</p>
           </div>
           
           <div className="relative z-10 w-24 h-24 bg-purple-100 rounded-[2rem] flex items-center justify-center rotate-6 shadow-xl border-4 border-white">
             <Book className="w-12 h-12 text-purple-500" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map((story) => {
             const userLvl = profile?.level || 1;
             const isLocked = story.level > userLvl;

             return (
               <motion.div
                 key={story.id}
                 whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
                 onClick={() => !isLocked && handleOpenStory(story)}
                 className={cn(
                   "relative rounded-[2.5rem] p-6 border-4 overflow-hidden transition-all text-white min-h-[280px] flex flex-col justify-between group",
                   isLocked 
                     ? "bg-gray-100 border-gray-200 text-gray-400 grayscale cursor-not-allowed" 
                     : `bg-gradient-to-br ${story.coverColor} border-white cursor-pointer shadow-xl`
                 )}
               >
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                       <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2">
                         <Lock className="w-8 h-8 text-slate-500" />
                         <span className="font-black text-slate-800 text-xs">مستوى {story.level} مطلوب</span>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start relative z-0">
                    <div className={cn("text-5xl drop-shadow-md transition-transform group-hover:scale-110", isLocked && "opacity-50 grayscale")}>
                      {story.image}
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      {story.xpReward} XP
                    </div>
                  </div>

                  <div className="relative z-0 space-y-1">
                     <h3 className="text-2xl font-black drop-shadow-md">{story.title}</h3>
                     <p className="font-bold opacity-80" dir="rtl">{convertLatinToSorani(story.kurdishTitle)}</p>
                  </div>
                  
                  {/* Decorative */}
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-black/10 rounded-full blur-xl" />
               </motion.div>
             );
          })}
        </div>
      </div>
    );
  }

  // 2. Story Finished View
  if (isFinished) {
     return createPortal(
       <div className="fixed inset-0 bg-[#FFFBF0] z-[100] flex flex-col items-center justify-center p-6 text-center font-arabic animate-in fade-in" dir="rtl">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            className="w-32 h-32 bg-gradient-to-tr from-brand-gold to-yellow-400 rounded-full flex items-center justify-center shadow-2xl mb-8 border-4 border-white"
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">نهاية القصة!</h2>
          <p className="text-xl text-slate-500 font-bold mb-8 max-w-sm">لقد أكملت القراءة بنجاح واكتسبت مفردات جديدة.</p>
          
          <div className="bg-white px-8 py-4 rounded-[2rem] border-4 border-brand-gold flex gap-4 text-brand-gold font-black text-2xl shadow-lg mb-12">
            <span>+{selectedStory.xpReward}</span>
            <span>XP</span>
          </div>

          <button
            onClick={() => setSelectedStory(null)}
            className="w-full max-w-sm h-16 bg-brand-green text-white rounded-[1.5rem] font-black text-xl shadow-[0_6px_0_0_#15803d] hover:translate-y-[-2px] transition-transform"
          >
            العودة للقصص
          </button>
       </div>,
       document.body
     );
  }

  // 3. Reading View
  const part = selectedStory.parts[currentPart];
  
  return createPortal(
    <div className="fixed inset-0 bg-[#FFFBF0] z-[100] flex flex-col font-arabic overflow-hidden" dir="rtl">
       {/* Header */}
       <div className="bg-white border-b-2 border-gray-100 p-4 flex items-center justify-between shadow-sm relative z-10">
          <button 
            onClick={() => setSelectedStory(null)}
            className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 px-4 py-2.5 rounded-xl font-black transition-colors shadow-sm border border-red-100 active:scale-95"
          >
             <X className="w-5 h-5" />
             <span>خروج</span>
          </button>
          
          <div className="flex-1 max-w-xs mx-4">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-brand-green"
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentPart + 1) / selectedStory.parts.length) * 100}%` }}
               />
            </div>
          </div>

          <div className="font-black text-slate-400 text-sm whitespace-nowrap">
            {currentPart + 1} / {selectedStory.parts.length}
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentPart}
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -50 }}
               className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border-4 border-gray-50 flex flex-col text-center"
             >
                <div className="text-7xl mb-8 drop-shadow-md">{part.image}</div>
                
                <h3 className="text-3xl md:text-5xl font-black text-brand-blue mb-8 leading-relaxed" dir="rtl">
                  {convertLatinToSorani(part.kurdish)}
                </h3>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <button 
                    className="relative p-3 bg-zinc-100 text-zinc-400 mx-auto rounded-2xl flex flex-col items-center justify-center cursor-not-allowed group border border-zinc-200"
                    title="قريباً"
                  >
                    <Volume2 className="w-5 h-5 mb-1" />
                    <span className="font-bold text-[10px] bg-brand-gold text-yellow-950 px-2 py-0.5 rounded-full">قريباً</span>
                  </button>
                </div>

                {showArabic[currentPart] ? (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-6 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl"
                   >
                     <p className="text-xl md:text-2xl font-black text-slate-600">{part.arabic}</p>
                   </motion.div>
                ) : (
                   <button 
                     onClick={() => toggleTranslation(currentPart)}
                     className="mt-6 text-sm font-black text-brand-gold uppercase tracking-widest hover:underline mx-auto"
                   >
                     ترجمة للغة العربية
                   </button>
                )}
             </motion.div>
          </AnimatePresence>
       </div>

       {/* Footer */}
       <div className="shrink-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white border-t border-border-main/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10 flex justify-center">
          <button
            onClick={handleNextPart}
            className="w-full max-w-lg h-16 bg-brand-green text-white rounded-2xl font-black text-xl shadow-[0_6px_0_0_#15803d] hover:translate-y-[-2px] transition-transform active:shadow-none active:translate-y-1"
          >
            {currentPart < selectedStory.parts.length - 1 ? "التالي" : "إنهاء القصة"}
          </button>
       </div>
    </div>,
    document.body
  );
}

