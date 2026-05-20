export const GRAMMAR_RULES = [
  {
    id: "plural_formation",
    titleAr: "قاعدة الجمع",
    explanation: "في الكردية، نجمع الأسماء بإضافة لاحقة تعتمد على الحرف الأخير من الكلمة.",
    structure: "اسم + (ان) للصحيح / (یان) للمعتل",
    examples: [
      { kurdish: "کتێب -> کتێبەکان", arabic: "كتاب -> كتب", breakdown: "للمعرفة نستخدم (ەکان)" },
      { kurdish: "قوتابی -> قوتابیان", arabic: "طالب -> طلاب", breakdown: "للنكرة المعتلة (یان)" }
    ],
    tips: ["تأكد من الحرف الأخير إذا كان علة (ا، ە، ۆ، ی، ێ، و، وو) أم صحيح."]
  },
  {
    id: "sentence_order",
    titleAr: "ترتيب الجملة",
    explanation: "الكردية تتبع ترتيب (فاعل - مفعول به - فعل) SOV.",
    structure: "الفاعل + المفعول به + الفعل",
    examples: [
      { kurdish: "من سێو دەخۆم", arabic: "أنا آكل تفاحة", breakdown: "من (أنا) سێو (تفاحة) دەخۆم (آكل)" }
    ]
  }
];

export const SENTENCE_STRUCTURES = [
  {
    patternAr: "أريد أن...",
    patternKu: "دەمەوێت + [فعل مضارع منصوب]",
    examples: [
      { arabic: "أريد أن أذهب", kurdish: "دەمەوێت بچم", pronunciation: "demewet bchm" },
      { arabic: "أريد أن آكل", kurdish: "دەمەوێت بخۆم", pronunciation: "demewet bxom" }
    ]
  },
  {
    patternAr: "أستطيع أن...",
    patternKu: "دەتوانم + [فعل مضارع منصوب]",
    examples: [
      { arabic: "أستطيع أن أقرأ", kurdish: "دەتوانم بخوێنم", pronunciation: "detwanm bxwenm" },
      { arabic: "أستطيع أن أتحدث", kurdish: "دەتوانم قسە بکەم", pronunciation: "detwanm qse bkem" }
    ]
  }
];

export const COMMON_PHRASES = [
  {
    category: "Greetings",
    categoryAr: "التحيات",
    phrases: [
      { kurdish: "سڵاو", arabic: "مرحباً", pronunciation: "Slaw" },
      { kurdish: "چۆنی؟", arabic: "كيف حالك؟", pronunciation: "Choni" },
      { kurdish: "باشم سوپاس", arabic: "أنا بخير أشكرك", pronunciation: "Bashm supas" },
      { kurdish: "بەیانیت باش", arabic: "صباح الخير", pronunciation: "Beyanit bash" },
      { kurdish: "شەوت شاد", arabic: "طابت ليلتك", pronunciation: "Shewt shad" }
    ]
  },
  {
    category: "Shopping",
    categoryAr: "التسوق",
    phrases: [
      { kurdish: "ئەمە بە چەندە؟", arabic: "بكم هذا؟", pronunciation: "Eme be chende?" },
      { kurdish: "گرانە", arabic: "غالي", pronunciation: "Grane" },
      { kurdish: "هەرزانە", arabic: "رخيص", pronunciation: "Herzane" }
    ]
  }
];

export const CONVERSATIONS = [
  {
    id: "greet_1",
    topicAr: "التعارف الأول",
    level: "beginner",
    lines: [
      { speaker: "A", kurdish: "سڵاو، ناوت چییە؟", arabic: "مرحباً، ما اسمك؟", pronunciation: "Slaw, nawt chiye?" },
      { speaker: "B", kurdish: "سڵاو، ناوم ئەحمەدە، ئەی تۆ؟", arabic: "مرحباً، اسمي أحمد، وأنت؟", pronunciation: "Slaw, nawm Ehmede, ey to?" },
      { speaker: "A", kurdish: "خۆشحاڵبووم بە ناسینت", arabic: "سعدت بمعرفتك", pronunciation: "Xoshhallbum be nasint" },
      { speaker: "B", kurdish: "منیش هەروەها", arabic: "وأنا كذلك", pronunciation: "Mnish herweha" }
    ]
  },
  {
    id: "shop_1",
    topicAr: "في السوق",
    level: "beginner",
    lines: [
      { speaker: "A", kurdish: "سڵاو، ئەمە بە چەندە؟", arabic: "مرحباً، بكم هذا؟", pronunciation: "Slaw, eme be chende?" },
      { speaker: "B", kurdish: "بە پێنج هەزار دینارە", arabic: "بخمسة آلاف دينار", pronunciation: "Be penj hezar dinare" },
      { speaker: "A", kurdish: "زۆر گرانە، کەمێک دایبەزێنە", arabic: "غالي جداً، خفضه قليلاً", pronunciation: "Zor grane, kemek daybezene" },
      { speaker: "B", kurdish: "باشە، بۆ تۆ بە چوار هەزار", arabic: "حسناً، لك بأربعة آلاف", pronunciation: "Bashe, bo to be chwar hezar" }
    ]
  }
];

export const PRONUNCIATION_GUIDES = [
  { letter: "پ", sound: "P", englishEquivalent: "Pen", example: "پارە (نقود)", tip: "ضم شفتيك واخرج الهواء بقوة." },
  { letter: "چ", sound: "Ch", englishEquivalent: "Chair", example: "چای (شاي)", tip: "انطق ت+ش معاً بشكل سريع." },
  { letter: "ژ", sound: "Zh", englishEquivalent: "Pleasure", example: "ژن (امرأة)", tip: "مثل حرف الجيم في اللهجة الشامية." },
  { letter: "گ", sound: "G", englishEquivalent: "Go", example: "گەرم (حار)", tip: "جيم مصرية." },
  { letter: "ڤ", sound: "V", englishEquivalent: "Van", example: "مرۆڤ (إنسان)", tip: "انطق الفاء مع اهتزاز الأحبال الصوتية." },
  { letter: "ۆ", sound: "O", englishEquivalent: "Door", example: "شۆفێر (سائق)", tip: "واو مفخمة أو O طويلة." },
  { letter: "ێ", sound: "E", englishEquivalent: "Bed (long)", example: "سێو (تفاحة)", tip: "يا خفيفة، مثل الكسرة الممالة." }
];

export const MOTIVATIONAL_PHRASES = [
  "رائع جداً! دەستخۆش! 👏",
  "أنت تتقدم بسرعة! بژی! 🌟",
  "لا تستسلم، اللغة الكردية سهلة وأنت تستطيع! 💪🏼",
  "استمر يا بطل! بەردەوام بە! 🔥"
];

export const ENCOURAGEMENT_PHRASES = MOTIVATIONAL_PHRASES;

export type Conversation = any;
export type GrammarRule = any;

