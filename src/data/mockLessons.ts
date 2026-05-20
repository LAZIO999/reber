import { Lesson, Word, Story } from "../types";
import { EXTENDED_WORDS, EXTENDED_LESSONS } from "./extendedData";
import { MORE_EXTENDED_WORDS } from "./extendedData2";
import { COLORS_WORDS } from "./colorsData";
import { EXTENDED_WORDS_3, EXTENDED_LESSONS_3 } from "./extendedData3";
import { EXTENDED_WORDS_4, EXTENDED_LESSONS_4 } from "./extendedData4";
import { EXTENDED_WORDS_5, EXTENDED_LESSONS_5 } from "./extendedData5";
import { EXTENDED_WORDS_6, EXTENDED_LESSONS_6 } from "./extendedData6";
import { EXTENDED_WORDS_7, EXTENDED_LESSONS_7 } from "./extendedData7";
import { EXTENDED_WORDS_8, EXTENDED_LESSONS_8 } from "./extendedData8";
import { EXTENDED_WORDS_9, EXTENDED_LESSONS_9 } from "./extendedData9";
import { EXTENDED_WORDS_10, EXTENDED_LESSONS_10 } from "./extendedData10";
import { EXTENDED_WORDS_11, EXTENDED_LESSONS_11 } from "./extendedData11";
import { EXTENDED_WORDS_12, EXTENDED_LESSONS_12 } from "./extendedData12";
import { ALPHABET_WORDS, ALPHABET_LESSONS } from "./alphabetData";
import { getEmojiForWord } from "./emojiMap";

const RAW_MOCK_WORDS: Word[] = [
  // GREETINGS
  {
    id: "w1",
    kurdish: "Sław",
    translation: "مرحبا",
    pronunciation: "سڵاو",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w2",
    kurdish: "Çonî?",
    translation: "كيف حالك؟",
    pronunciation: "چۆنی؟",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w3",
    kurdish: "Başim",
    translation: "أنا بخير",
    pronunciation: "باشم",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w4",
    kurdish: "Supas",
    translation: "شكراً",
    pronunciation: "سوپاس",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1503594384566-46107386792b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w5",
    kurdish: "Xwa ḧafîz",
    translation: "مع السلامة",
    pronunciation: "خوا حافیز",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w15",
    kurdish: "Beyanî baş",
    translation: "صباح الخير",
    pronunciation: "بەیانی باش",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w16",
    kurdish: "Şew baş",
    translation: "تصبح على خير",
    pronunciation: "شەو باش",
    category: "greetings",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1472552944129-b035e9ea3744?auto=format&fit=crop&q=80&w=800",
  },
  // FAMILY
  {
    id: "w6",
    kurdish: "Bawk",
    translation: "أب",
    pronunciation: "باوک",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w7",
    kurdish: "Dayk",
    translation: "أم",
    pronunciation: "دایک",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1551048632-24346039535c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w8",
    kurdish: "Bira",
    translation: "أخ",
    pronunciation: "برا",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w9",
    kurdish: "Xuşk",
    translation: "أخت",
    pronunciation: "خوشک",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1581952976147-5a2d15560349?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w17",
    kurdish: "Bapîr",
    translation: "جد",
    pronunciation: "باپیر",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w18",
    kurdish: "Dapîr",
    translation: "جدة",
    pronunciation: "داپیر",
    category: "family",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=800",
  },
  // FOOD
  {
    id: "w10",
    kurdish: "Nan",
    translation: "خبز",
    pronunciation: "نان",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w11",
    kurdish: "Aw",
    translation: "ماء",
    pronunciation: "ئاو",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w12",
    kurdish: "Ça",
    translation: "شاي",
    pronunciation: "چا",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1544787210-2211d7c929c7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w19",
    kurdish: "Qawe",
    translation: "قهوة",
    pronunciation: "قاوە",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w20",
    kurdish: "Goşt",
    translation: "لحم",
    pronunciation: "گۆشت",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w21",
    kurdish: "Mîwe",
    translation: "فاكهة",
    pronunciation: "میوە",
    category: "food",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800",
  },
  // TRAVEL
  {
    id: "w13",
    kurdish: "Taksî",
    translation: "تاكسي",
    pronunciation: "تاکسی",
    category: "travel",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1559192823-e1d8e87def51?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w14",
    kurdish: "Firokexane",
    translation: "مطار",
    pronunciation: "فڕۆکەخانە",
    category: "travel",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w22",
    kurdish: "Pas",
    translation: "حافلة",
    pronunciation: "پاس",
    category: "travel",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w23",
    kurdish: "Bilît",
    translation: "تذكرة",
    pronunciation: "بلیت",
    category: "travel",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1549298240-0d8e60513026?auto=format&fit=crop&q=80&w=800",
  },
  // COLORS
  {
    id: "w24",
    kurdish: "Sûr",
    translation: "أحمر",
    pronunciation: "سوور",
    category: "colors",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1589133496033-0c4a04d2627a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w25",
    kurdish: "Şîn",
    translation: "أزرق",
    pronunciation: "شین",
    category: "colors",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1558244248-d0df52c92e74?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w26",
    kurdish: "Zerd",
    translation: "أصفر",
    pronunciation: "زەرد",
    category: "colors",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1528646969566-26792341d3b0?auto=format&fit=crop&q=80&w=800",
  },
  // NUMBERS
  {
    id: "w27",
    kurdish: "Yek",
    translation: "واحد",
    pronunciation: "یەک",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1518133501357-ff3b8417cd5d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w28",
    kurdish: "Dû",
    translation: "إثنان",
    pronunciation: "دوو",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w29",
    kurdish: "Sê",
    translation: "ثلاثة",
    pronunciation: "سێ",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1516089759367-1755dc034e3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w30",
    kurdish: "Çwar",
    translation: "أربعة",
    pronunciation: "چوار",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1542445101-7917631dedcb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w31",
    kurdish: "Pênc",
    translation: "خمسة",
    pronunciation: "پێنج",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1456121434658-96bb05c9ba6b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w32",
    kurdish: "Şeş",
    translation: "ستة",
    pronunciation: "شەش",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1551061985-78cd1dc388c3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w33",
    kurdish: "Ḩewt",
    translation: "سبعة",
    pronunciation: "حەوت",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1506443432-841f3d640989?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w34",
    kurdish: "Heşt",
    translation: "ثمانية",
    pronunciation: "هەشت",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1498429152472-9a433d9ddf3b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w35",
    kurdish: "No",
    translation: "تسعة",
    pronunciation: "نۆ",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1473220464249-144a7b539cdd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w36",
    kurdish: "De",
    translation: "عشرة",
    pronunciation: "دە",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1541819779379-cb6a78248c8b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w37",
    kurdish: "Sed",
    translation: "مئة",
    pronunciation: "سەد",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1430931071372-38127bd266fc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w38",
    kurdish: "Hezar",
    translation: "ألف",
    pronunciation: "هەزار",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1579208031541-11f87aa859b4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w39",
    kurdish: "Milyon",
    translation: "مليون",
    pronunciation: "ملیۆن",
    category: "numbers",
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1605809708681-79ba0a5c48b2?auto=format&fit=crop&q=80&w=800",
  },
  ...EXTENDED_WORDS,
  ...MORE_EXTENDED_WORDS,
  ...COLORS_WORDS,
  ...EXTENDED_WORDS_3,
  ...EXTENDED_WORDS_4,
  ...EXTENDED_WORDS_5,
  ...EXTENDED_WORDS_6,
  ...EXTENDED_WORDS_7,
  ...EXTENDED_WORDS_8,
  ...EXTENDED_WORDS_9,
  ...EXTENDED_WORDS_10,
  ...EXTENDED_WORDS_11,
  ...EXTENDED_WORDS_12,
  ...ALPHABET_WORDS,
];

export const MOCK_WORDS: Word[] = RAW_MOCK_WORDS.map((word) => ({
  ...word,
  emoji: getEmojiForWord(word.kurdish, word.category),
}));

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "l1",
    categoryId: "greetings",
    title: "التحيات الأساسية",
    description: "تعلم كيف تقول مرحباً ومع السلامة بالكردية الصورانية.",
    order: 1,
    xpReward: 20,
  },
  {
    id: "l2",
    categoryId: "greetings",
    title: "طلب المساعدة",
    description: "عبارات أساسية للمسافرين.",
    order: 2,
    xpReward: 30,
  },
  {
    id: "l6",
    categoryId: "greetings",
    title: "أوقات اليوم",
    description: "تعلم تحيات الصباح والمساء.",
    order: 3,
    xpReward: 25,
  },
  {
    id: "l3",
    categoryId: "family",
    title: "أفراد العائلة",
    description: "الأب، الأم، الأخ، والأخت.",
    order: 1,
    xpReward: 25,
  },
  {
    id: "l7",
    categoryId: "family",
    title: "الأجداد",
    description: "تعرف على كيفية مناداة الجد والجدة.",
    order: 2,
    xpReward: 25,
  },
  {
    id: "l4",
    categoryId: "food",
    title: "في المطعم",
    description: "شراء الطعام وطلب الحساب.",
    order: 1,
    xpReward: 35,
  },
  {
    id: "l8",
    categoryId: "food",
    title: "المأكولات والمشروبات",
    description: "تعلم أسماء الفواكه واللحوم والمشروبات.",
    order: 2,
    xpReward: 40,
  },
  {
    id: "l5",
    categoryId: "travel",
    title: "في المطار",
    description: "المفردات الضرورية للسفر والمطار.",
    order: 1,
    xpReward: 40,
  },
  {
    id: "l9",
    categoryId: "travel",
    title: "المواصلات",
    description: "استخدام الحافلة وشراء التذاكر.",
    order: 2,
    xpReward: 35,
  },
  {
    id: "l10",
    categoryId: "colors",
    title: "الألوان الأساسية",
    description: "تعلم الألوان الأساسية وكيفية استخدامها.",
    order: 1,
    xpReward: 25,
  },
  {
    id: "l11",
    categoryId: "numbers",
    title: "الأرقام 1-3",
    description: "العد من واحد إلى ثلاثة بالكردية.",
    order: 1,
    xpReward: 20,
  },
  {
    id: "l12",
    categoryId: "numbers",
    title: "الأرقام من 4 إلى 10",
    description: "العد من أربعة إلى عشرة بالكردية.",
    order: 2,
    xpReward: 25,
  },
  {
    id: "l14",
    categoryId: "numbers",
    title: "الأرقام من 11 إلى 99",
    description: "تعلم كيف تقول الأرقام من 11 إلى 99 بالكردية.",
    order: 3,
    xpReward: 30,
  },
  {
    id: "l13",
    categoryId: "numbers",
    title: "مئات والآلاف والملايين",
    description: "تعلم كيف تحسب الأرقام الكبيرة، 100، 1000 ومليون.",
    order: 4,
    xpReward: 35,
  },
  ...EXTENDED_LESSONS,
  ...EXTENDED_LESSONS_3,
  ...EXTENDED_LESSONS_4,
  ...EXTENDED_LESSONS_5,
  ...EXTENDED_LESSONS_6,
  ...EXTENDED_LESSONS_7,
  ...EXTENDED_LESSONS_8,
  ...EXTENDED_LESSONS_9,
  ...EXTENDED_LESSONS_10,
  ...EXTENDED_LESSONS_11,
  ...EXTENDED_LESSONS_12,
  ...ALPHABET_LESSONS,
];

export const MOCK_STORIES: Story[] = [
  {
    id: "s1",
    title: "يوم في أربيل",
    difficulty: "beginner",
    duration: "3 دقائق",
    content:
      "ئەمڕۆ هەوا زۆر خۆشە لە هەولێر. من دەچم بۆ قەڵا. قەڵای هەولێر زۆر کۆن و جوانە. دوای ئەوە دەچم بۆ بازاڕی نیشتمان.",
    translation:
      "اليوم الجو جميل جداً في أربيل. أنا ذاهب إلى القلعة. قلعة أربيل قديمة جداً وجميلة. بعد ذلك سأذهب إلى سوق نيشتيمان.",
    imageUrl:
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s2",
    title: "البازار القديم",
    difficulty: "intermediate",
    duration: "5 دقائق",
    content:
      "بازاڕی تەوێڵە پڕە لە ڕەنگ و بۆنی خۆش. خەڵکەکە زۆر میهرەبانن. لێرە دەتوانیت جلی کوردی و ت things کەلوپەلی دەستی بکڕیت.",
    translation:
      "سوق توبو ممتلئ بالألوان والروائح الجميلة. الناس ودودون جداً. هنا يمكنك شراء الملابس الكردية والأدوات المصنوعة يدوياً.",
    imageUrl:
      "https://images.unsplash.com/photo-1512106374988-c95f566d39ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s3",
    title: "جبل قنديل",
    difficulty: "advanced",
    duration: "8 دقائق",
    content:
      "چیاکانی کوردستان لە زستاندا سپی پۆش دەبن. گەشتیاران دێن بۆ بینینی دیمەنە سەرنجڕاکێشەکان. سروشت لێرە زۆر پاک و بێدەنگە.",
    translation:
      "جبال كردستان تكتسي باللون الأبيض في الشتاء. السياح يأتون لرؤية المناظر الخلابة. الطبيعة هنا نقية وهادئة جداً.",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
  },
];
