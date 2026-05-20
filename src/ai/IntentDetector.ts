/**
 * IntentDetector.ts
 * Kurdish AI - Intent Recognition Engine
 * Detects user intent using weighted keyword scoring.
 */

export type Intent =
  | "GREETING"
  | "VOCABULARY_LOOKUP"
  | "TRANSLATION_AR_TO_KU"
  | "TRANSLATION_KU_TO_AR"
  | "GRAMMAR_QUESTION"
  | "PRONUNCIATION_HELP"
  | "QUIZ_REQUEST"
  | "CONVERSATION_PRACTICE"
  | "ENCOURAGEMENT_RESPONSE"
  | "HELP_REQUEST"
  | "LESSON_REQUEST"
  | "WORD_EXAMPLES"
  | "TRAINING"
  | "SENTENCE_STRUCTURE"
  | "VERB_CONJUGATION"
  | "NUMBER_TRANSLATION"
  | "UNKNOWN";

export interface DetectionResult {
  intent: Intent;
  confidence: number; // 0-1
  extractedEntity?: string; // The word/phrase the user is asking about
  raw: string;
}

interface IntentPattern {
  intent: Intent;
  keywords: string[];
  weight: number;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: "GREETING",
    keywords: ["مرحبا", "مرحباً", "هلا", "سلام", "أهلاً", "اهلا", "هاي", "صباح", "مساء", "كيف حالك", "كيف الحال", "ايش اخبارك"],
    weight: 2,
  },
  {
    intent: "VOCABULARY_LOOKUP",
    keywords: ["معنى", "معني", "يعني", "ما هو", "ما هي", "ايش يعني", "شو يعني", "وش يعني", "كلمة", "مفردة"],
    weight: 3,
  },
  {
    intent: "TRANSLATION_AR_TO_KU",
    keywords: ["كيف اقول", "كيف أقول", "كيف نقول", "بالكردية", "بالكرديه", "ترجم لي", "ترجمة", "ترجم", "قل لي بالكردي"],
    weight: 3,
  },
  {
    intent: "TRANSLATION_KU_TO_AR",
    keywords: ["ما معنى", "ما معنا", "بالعربية", "بالعربي", "اعني بها", "يعني ايش"],
    weight: 3,
  },
  {
    intent: "GRAMMAR_QUESTION",
    keywords: ["قاعدة", "قواعد", "نحو", "صرف", "جمع", "مفرد", "كيف اركب", "تركيب جملة", "ضمائر", "فعل", "اسم", "صفة", "مؤنث", "مذكر", "ماضي", "مضارع"],
    weight: 3,
  },
  {
    intent: "PRONUNCIATION_HELP",
    keywords: ["نطق", "انطق", "تلفظ", "تنطق", "ينطق", "كيف تنطق", "كيف انطق", "الفظ", "حرف"],
    weight: 3,
  },
  {
    intent: "QUIZ_REQUEST",
    keywords: ["اختبار", "اختبرني", "كويز", "تمرين", "تحدني", "سألني", "امتحن", "امتحنني", "اسألني", "تحديا", "تحدي"],
    weight: 3,
  },
  {
    intent: "CONVERSATION_PRACTICE",
    keywords: ["محادثة", "محادثه", "حوار", "تحدث", "تكلم", "كلمني", "ممارسة", "اتحدث", "تدريب", "نموذج محادثة", "مثال محادثة"],
    weight: 2,
  },
  {
    intent: "ENCOURAGEMENT_RESPONSE",
    keywords: ["شكراً", "شكرا", "ممتاز", "أحسنت", "رائع", "مشكور", "عاشت", "تمام", "برافو", "صح", "صحيح", "فهمت"],
    weight: 1,
  },
  {
    intent: "HELP_REQUEST",
    keywords: ["مساعدة", "ساعدني", "لا افهم", "مش فاهم", "ما فهمت", "اشرح", "وضح", "كيف", "علمني"],
    weight: 2,
  },
  {
    intent: "LESSON_REQUEST",
    keywords: ["درس", "تعلم", "ابدأ", "البداية", "مبتدئ", "وحدة", "الدرس", "الأول", "تعليم"],
    weight: 2,
  },
  {
    intent: "WORD_EXAMPLES",
    keywords: ["مثال", "أمثلة", "جملة بها", "استخدمها في", "كيف أستخدم", "في جملة", "مثال على"],
    weight: 2,
  },
];

export class IntentDetector {
  detect(userInput: string): DetectionResult {
    const text = userInput.trim().toLowerCase();
    const scores = new Map<Intent, number>();

    // Check for Training
    if (text.includes("تدريب") || text.includes("تمرين") || text.includes("اختبرني") || text.includes("تحدي")) {
      return { intent: "TRAINING", confidence: 1, raw: userInput };
    }

    // Check for Sentence Structures
    if ((text.includes("كيف") || text.includes("اريد")) && (text.includes("جملة") || text.includes("أقول") || text.includes("اريد ان"))) {
      return { intent: "SENTENCE_STRUCTURE", confidence: 1, raw: userInput };
    }

    // Check for Verb Conjugation
    if (text.includes("فعل") || text.includes("تصريف") || text.includes("ماضي") || text.includes("مضارع") || text.includes("امر") || text.includes("أمر")) {
      return { intent: "VERB_CONJUGATION", confidence: 1, raw: userInput };
    }

    // Check for Numbers
    const numberMatch = text.match(/\d+/);
    if (numberMatch && (text.includes("رقم") || text.includes("عدد") || text.includes("كيف أقول") || text.includes("كيف اقول") || text.includes("ترجم"))) {
      return { intent: "NUMBER_TRANSLATION", confidence: 1, extractedEntity: numberMatch[0], raw: userInput };
    }

    // Score each intent
    for (const pattern of INTENT_PATTERNS) {
      let score = 0;
      for (const keyword of pattern.keywords) {
        if (text.includes(keyword)) {
          score += pattern.weight;
        }
      }
      if (score > 0) {
        scores.set(pattern.intent, (scores.get(pattern.intent) || 0) + score);
      }
    }

    // Find the highest scoring intent
    let topIntent: Intent = "UNKNOWN";
    let topScore = 0;

    for (const [intent, score] of scores.entries()) {
      if (score > topScore) {
        topScore = score;
        topIntent = intent;
      }
    }

    // Calculate confidence (normalize by max possible score)
    const maxPossibleScore = 9;
    const confidence = Math.min(topScore / maxPossibleScore, 1);

    // Extract entity (the word being asked about)
    const entity = this.extractEntity(text, topIntent);

    return {
      intent: topIntent,
      confidence,
      extractedEntity: entity,
      raw: userInput,
    };
  }

  private extractEntity(text: string, intent: Intent): string | undefined {
    // Extract word after trigger phrases
    const patterns: Record<string, RegExp[]> = {
      VOCABULARY_LOOKUP: [
        /معنى\s+[""]?([^\s"]+)[""]?/,
        /معنى\s+كلمة\s+(.+)/,
        /يعني\s+[""]?([^\s"]+)[""]?/,
      ],
      TRANSLATION_AR_TO_KU: [
        /كيف أقول\s+"?(.+?)"?\s*(بالكردية|كرديا)?$/,
        /كيف اقول\s+"?(.+?)"?\s*(بالكردية|كرديا)?$/,
        /ترجم\s+"?(.+?)"?\s*(بالكردية|للكردي)?$/,
      ],
      TRANSLATION_KU_TO_AR: [
        /ما معنى\s+"?([^\s"]+)"?/,
        /[""]([^""]+)[""]\s*(بالعربية|يعني)/,
      ],
      WORD_EXAMPLES: [
        /مثال على\s+"?(.+?)"?$/,
        /جملة\s+(ب|بكلمة)\s+"?(.+?)"?$/,
      ],
    };

    const intentPatterns = patterns[intent];
    if (!intentPatterns) return undefined;

    for (const regex of intentPatterns) {
      const match = text.match(regex);
      if (match) {
        return match[1]?.trim();
      }
    }
    return undefined;
  }
}

export const intentDetector = new IntentDetector();
