/**
 * ResponseGenerator.ts
 * Kurdish AI - Dynamic Response Builder
 * Builds formatted, educational, and friendly responses from templates + data.
 */

import {
  CONVERSATIONS,
  GRAMMAR_RULES,
  PRONUNCIATION_GUIDES,
  COMMON_PHRASES,
  MOTIVATIONAL_PHRASES,
  ENCOURAGEMENT_PHRASES,
  type Conversation,
  type GrammarRule,
} from "./data/kurdishKnowledge";
import { MOCK_WORDS } from "../data/mockLessons";
import { EXTENDED_VOCAB } from "./data/extendedVocab";
import { COMMON_VERBS } from "./data/extendedVerbs";
import { type Word } from "../types";
import { type Intent } from "./IntentDetector";
import { convertNumberToKurdish } from "./numberConverter";

// Combine vocabulary
const ALL_WORDS: Word[] = [
  ...MOCK_WORDS,
  ...EXTENDED_VOCAB.map(v => ({
    id: `ext_${v.ku}_${v.ar}`,
    kurdish: v.ku,
    translation: v.ar,
    pronunciation: v.pron,
    category: v.cat as any
  })),
  ...COMMON_VERBS.map(v => ({
    id: `verb_${v.infinitive}_${v.arabic}`,
    kurdish: v.infinitive,
    translation: v.arabic,
    pronunciation: v.presentRoot, // just a placeholder
    category: "verbs" as any
  }))
];

export class ResponseGenerator {
  // ─── Greeting ────────────────────────────────────────────────────────────
  greeting(): string {
    const greetings = [
      `سڵاو! 👋 **أهلاً بك في رێبەر!**\n\nأنا معلمك الكردي الذكي. يمكنني مساعدتك في:\n- 📖 **معاني الكلمات** - فقط اكتب "معنى كلمة ..."\n- 🗣️ **المحادثات** - اكتب "أعطني محادثة"\n- 📝 **القواعد** - اكتب "اشرح قاعدة الجمع"\n- 🎯 **الاختبارات** - اكتب "اختبرني"\n- 🔤 **النطق** - اكتب "كيف أنطق حرف ..."\n\nبماذا تريد أن تبدأ اليوم؟ 🌟`,
      `سڵاو وخۆش ئامادەبوی! 🎉\n\nأنا رێبەر، رفيقك في تعلم اللغة الكردية السورانية.\nاسألني عن أي كلمة، قاعدة، أو محادثة، وسأساعدك فوراً! 🚀`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // ─── Vocabulary Lookup ───────────────────────────────────────────────────
  vocabularyLookup(entity?: string): string {
    if (!entity) {
      return `🔍 **البحث في القاموس**\n\nأخبرني الكلمة التي تريد معرفتها! مثال:\n- "معنى سڵاو"\n- "معنى كلمة باش"`;
    }

    const results = this.searchVocabulary(entity);
    if (results.length === 0) {
      return `🔍 لم أجد كلمة مطابقة لـ **"${entity}"** في قاموسي.\n\nجرب:\n- كتابة الكلمة بشكل مختلف\n- أو اسألني عن كلمة أخرى\n- أو اكتب "أعطني كلمات عن الطعام" لأقترح عليك كلمات`;
    }

    const word = results[0];
    return this.formatWordCard(word);
  }

  // ─── Translation Ar → Ku ─────────────────────────────────────────────────
  translateArToKu(entity?: string): string {
    if (!entity) {
      return `🌐 **الترجمة إلى الكردية**\n\nماذا تريد أن تقول بالكردية؟ مثال:\n- "كيف أقول شكراً بالكردية؟"\n- "ترجم كلمة بيت"`;
    }

    const results = this.searchVocabulary(entity);
    if (results.length > 0) {
      const word = results[0];
      return `🌐 **ترجمة "${entity}" إلى الكردية:**\n\n**${word.kurdish}**\n🔊 *النطق: ${word.pronunciation || word.kurdish}*\n\n💡 مثال: ئەمە ${word.kurdish}ە (هذا/هذه ${word.translation})`;
    }

    return `🌐 لم أجد ترجمة دقيقة لـ **"${entity}"** في قاموسي المحلي.\n\nحاول سؤالي بطريقة مختلفة، أو اكتب الكلمة بشكل أبسط.`;
  }

  // ─── Translation Ku → Ar ─────────────────────────────────────────────────
  translateKuToAr(entity?: string): string {
    if (!entity) {
      return `🌐 **ترجمة من الكردية إلى العربية**\n\nاكتب الكلمة الكردية! مثال:\n- "ما معنى سڵاو؟"\n- "ما معنى باشم؟"`;
    }

    const results = this.searchVocabulary(entity);
    if (results.length > 0) {
      const word = results[0];
      return this.formatWordCard(word);
    }

    // Try matching by kurdish text directly
    const byKurdish = ALL_WORDS.find(
      (w) => w.kurdish.toLowerCase().includes(entity.toLowerCase())
    );
    if (byKurdish) return this.formatWordCard(byKurdish);

    return `🔍 لم أجد ترجمة لـ **"${entity}"**. تأكد من الكتابة أو جرب كلمة أخرى!`;
  }

  // ─── Grammar ─────────────────────────────────────────────────────────────
  grammarExplanation(input: string): string {
    const text = input.toLowerCase();

    // Find matching grammar rule
    const ruleMap: Record<string, string> = {
      جمع: "plural_formation",
      جملة: "sentence_order",
      ترتيب: "sentence_order",
      ضمير: "pronouns",
      فعل: "verb_present",
      مضارع: "verb_present",
      نفي: "negation",
      نفى: "negation",
      صفة: "adjectives",
      مقارنة: "comparative_superlative",
      تفضيل: "comparative_superlative",
      مجهول: "passive_voice",
      سببية: "causative_verbs",
      ربط: "conjunctions_complex",
      صلة: "relative_clauses",
      الذي: "relative_clauses",
    };

    let ruleId = "";
    for (const [keyword, id] of Object.entries(ruleMap)) {
      if (text.includes(keyword)) {
        ruleId = id;
        break;
      }
    }

    if (ruleId) {
      const rule = GRAMMAR_RULES.find((r) => r.id === ruleId);
      if (rule) return this.formatGrammarRule(rule);
    }

    // Return grammar menu if no specific rule found
    return `📚 **قواعد اللغة الكردية (Grammar)**\n\nيمكنني شرح:\n${GRAMMAR_RULES.map((r) => `- **${r.titleAr}**: اكتب "اشرح ${r.titleAr}"`).join("\n")}\n\nأيها تريد؟ 🎯`;
  }

  // ─── Pronunciation ────────────────────────────────────────────────────────
  pronunciationHelp(input: string): string {
    // Find letter in input
    for (const guide of PRONUNCIATION_GUIDES) {
      if (input.includes(guide.letter)) {
        return `🔤 **نطق الحرف "${guide.letter}"**\n\n- **الصوت:** ${guide.sound}\n- **في الإنجليزية:** مثل "${guide.englishEquivalent}"\n- **مثال:** ${guide.example}\n- 💡 **نصيحة:** ${guide.tip}`;
      }
    }

    // General pronunciation guide
    return `🔤 **دليل النطق الكردي**\n\nالحروف الصعبة التي لا توجد في العربية:\n\n${PRONUNCIATION_GUIDES.map(
      (g) => `**${g.letter}** = ${g.sound} (مثل "${g.englishEquivalent}") - مثال: ${g.example}`
    ).join("\n")}\n\n💡 **نصيحة عامة:** اللغة الكردية تُقرأ كما تُكتب تماماً! قسّم الكلمة لمقاطع.`;
  }

  // ─── Conversation Practice ────────────────────────────────────────────────
  conversationPractice(input: string): string {
    const text = input.toLowerCase();

    // Find matching conversation topic
    const topicKeywords: Record<string, string[]> = {
      "greet_1": ["تعارف", "تقديم", "اسم"],
      "daily_1": ["يوم", "يومية", "صباح"],
      "shop_1": ["سوق", "تسوق", "شراء", "بازار"],
      "restaurant_1": ["مطعم", "طعام", "أكل"],
      "work_1": ["عمل", "شغل", "وظيفة"],
      "directions_1": ["طريق", "اتجاه", "مكان"],
      "health_1": ["صحة", "مرض", "دكتور"],
      "family_1": ["عائلة", "أسرة", "أهل"],
    };

    let matchedId = "";
    for (const [id, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some((k) => text.includes(k))) {
        matchedId = id;
        break;
      }
    }

    let conv;
    if (matchedId) {
      conv = CONVERSATIONS.find((c) => c.id === matchedId);
    } else {
      // Try to find a match directly in the topicAr
      conv = CONVERSATIONS.find((c) => text.includes(c.topicAr.toLowerCase()) || c.topicAr.toLowerCase().includes(text.replace("محادثة", "").trim()));
    }

    // Pick random conversation if no specific match
    if (!conv) {
      conv = CONVERSATIONS[Math.floor(Math.random() * CONVERSATIONS.length)];
    }

    if (!conv) return "لم أجد محادثة مناسبة. اكتب مثلاً: **محادثة تعارف** أو **محادثة في السوق**.";

    return this.formatConversation(conv);
  }

  // ─── Sentence Structure Explanation ─────────────────────────────────────
  sentencePatternExplanation(input: string): string {
    const text = input.toLowerCase();
    const { SENTENCE_STRUCTURES } = require("./data/kurdishKnowledge"); // Dynamic import to avoid circular dependency issues if any
    
    // Check if user is asking for "I want to" or "I can"
    let pattern = SENTENCE_STRUCTURES.find((p: any) => text.includes(p.patternAr.replace("...", "").trim()));
    
    if (!pattern) {
      // Default to "I want to" if they just say "how do I say sentences"
      pattern = SENTENCE_STRUCTURES[0];
    }

    let response = `📝 **درس في تركيب الجمل: ${pattern.patternAr}**\n\n`;
    response += `في الكردية نستخدم القاعدة التالية:\n**${pattern.patternKu}**\n\n`;
    response += `**أمثلة عملية:**\n`;
    response += pattern.examples.map((e: any) => `🔹 **${e.arabic}**\n   ${e.kurdish}\n   _النطق: ${e.pronunciation}_`).join("\n\n");
    response += `\n\n💡 **جرب الآن:** اكتب لي جملة تبدأ بـ "أريد أن..." وسأصححها لك!`;
    
    return response;
  }

  // ─── Training Challenge ──────────────────────────────────────────────────
  trainingChallenge(): string {
    const { SENTENCE_STRUCTURES } = require("./data/kurdishKnowledge");
    const pattern = SENTENCE_STRUCTURES[Math.floor(Math.random() * SENTENCE_STRUCTURES.length)];
    const example = pattern.examples[Math.floor(Math.random() * pattern.examples.length)];

    return `🎯 **تحدي الترجمة الفوري!**\n\nكيف تترجم هذه الجملة إلى الكردية؟\n\n**"${example.arabic}"**\n\nاكتب إجابتك وسأقوم بتصحيحها! 💪`;
  }

  // ─── Verb Conjugation ──────────────────────────────────────────────────
  verbConjugation(input: string): string {
    const text = input.toLowerCase();
    const { COMMON_VERBS } = require("./data/extendedVerbs");
    
    // Find matching verb
    let matchedVerb = COMMON_VERBS.find((v: any) => 
      text.includes(v.infinitive) || 
      text.includes(v.arabic) ||
      text.includes(v.pastRoot) ||
      text.includes(v.presentRoot)
    );

    if (!matchedVerb) {
      // Pick random verb if none matched
      matchedVerb = COMMON_VERBS[Math.floor(Math.random() * COMMON_VERBS.length)];
    }

    return `⚡ **تصريف الفعل: ${matchedVerb.infinitive} (${matchedVerb.arabic})**\n\n` +
           `في الكردية، لكل فعل جذران: جذر ماضي وجذر مضارع.\n` +
           `- **الجذر الماضي:** ${matchedVerb.pastRoot}\n` +
           `- **الجذر المضارع:** ${matchedVerb.presentRoot}\n\n` +
           `📖 **أمثلة على الاستخدام:**\n\n` +
           `⏱️ **الماضي:**\n` +
           `**${matchedVerb.examples.past.ku}**\n(${matchedVerb.examples.past.ar})\n_النطق: ${matchedVerb.examples.past.pron}_\n\n` +
           `⏳ **المضارع:**\n` +
           `**${matchedVerb.examples.present.ku}**\n(${matchedVerb.examples.present.ar})\n_النطق: ${matchedVerb.examples.present.pron}_\n\n` +
           `🗣️ **الأمر:**\n` +
           `**${matchedVerb.examples.imperative.ku}**\n(${matchedVerb.examples.imperative.ar})\n_النطق: ${matchedVerb.examples.imperative.pron}_\n\n` +
           `💡 **تحدي:** حاول كتابة جملة جديدة باستخدام الجذر المضارع!`;
  }

  // ─── Number Translation ──────────────────────────────────────────────────
  numberTranslation(numStr?: string): string {
    if (!numStr) {
      return `🔢 **الأرقام الكردية**\n\nاسألني عن أي رقم وسأترجمه لك! مثال:\n- "كيف أقول 150 بالكردية؟"\n- "الرقم 2024"`;
    }

    const result = convertNumberToKurdish(numStr);
    
    if (!result || !result.kurdish) {
      return `⚠️ عذراً، لم أتمكن من ترجمة الرقم "${numStr}". تأكد من كتابة الأرقام بشكل صحيح (من 0 إلى 9,999,999).`;
    }

    return `🔢 **الرقم: ${numStr}**\n\n` +
           `**بالكردية:** ${result.kurdish}\n` +
           `**النطق:** _${result.pronunciation}_\n\n` +
           `💡 **معلومة:** الأرقام في الكردية تُقرأ من اليسار إلى اليمين (عكس العربية). مثلاً 25 تُقرأ (عشرون وخمسة) -> بیست و پێنج.`;
  }

  // ─── Encouragement ───────────────────────────────────────────────────────
  encouragement(): string {
    return `${MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]}\n\n` +
      `استمر في التعلم! كل كلمة جديدة تتعلمها تقربك من إتقان الكردية. 🌟\n\nماذا تريد أن تتعلم الآن؟`;
  }

  // ─── Help Menu ────────────────────────────────────────────────────────────
  helpMenu(): string {
    return `📖 **مرحباً! أنا رێبەر، معلمك الكردي.**\n\nإليك ما يمكنني مساعدتك فيه:\n\n` +
      `🔍 **كلمات ومعاني:**\n  ← اكتب: "معنى سڵاو" أو "ما معنى باشم"\n\n` +
      `🌐 **الترجمة:**\n  ← اكتب: "كيف أقول شكراً بالكردية"\n\n` +
      `📚 **القواعد:**\n  ← اكتب: "اشرح قاعدة الجمع" أو "اشرح ترتيب الجملة"\n\n` +
      `🗣️ **المحادثات:**\n  ← اكتب: "أعطني محادثة تعارف" أو "محادثة في السوق"\n\n` +
      `🔤 **النطق:**\n  ← اكتب: "كيف أنطق پ" أو "دليل النطق"\n\n` +
      `🎯 **الاختبارات:**\n  ← اكتب: "اختبرني" أو "كويز"\n\n` +
      `ما الذي تريد تعلمه الآن؟ 🚀`;
  }

  // ─── Common Phrases ───────────────────────────────────────────────────────
  commonPhrases(category?: string): string {
    const all = COMMON_PHRASES;
    const target = category
      ? all.find((c) => c.categoryAr.includes(category) || c.category.toLowerCase().includes(category.toLowerCase()))
      : all[Math.floor(Math.random() * all.length)];

    if (!target) return this.helpMenu();

    return `💬 **عبارات شائعة: ${target.categoryAr}**\n\n${target.phrases
      .map((p) => `**${p.kurdish}** - ${p.arabic}\n_النطق: ${p.pronunciation}_`)
      .join("\n\n")}`;
  }

  // ─── Unknown / Fallback ───────────────────────────────────────────────────
  unknownFallback(): string {
    return null as any; // Signal to KurdishAI to use Gemini
  }

  // ─── Formatters ───────────────────────────────────────────────────────────
  private formatWordCard(word: Word): string {
    const categoryEmojis: Record<string, string> = {
      greetings: "👋",
      food: "🍽️",
      numbers: "🔢",
      colors: "🎨",
      family: "👨‍👩‍👧",
      body: "🫀",
      animals: "🐾",
      places: "📍",
      verbs: "⚡",
    };
    const emoji = categoryEmojis[word.category] || "📖";

    return `${emoji} **قاموس رێبەر**\n\n` +
      `**الكردية:** ${word.kurdish}\n` +
      `**العربية:** ${word.translation}\n` +
      `**النطق:** *${word.pronunciation || word.kurdish}*\n` +
      (word.category ? `**الفئة:** ${word.category}\n` : "") +
      `\n💡 **مثال:** ئەمە ${word.kurdish}ە. *(هذا/هذه ${word.translation})*\n\n` +
      `🔥 هل تريد مثالاً في جملة أطول؟ أو اكتب **اختبرني** لاختبارك على هذه الكلمة!`;
  }

  private formatGrammarRule(rule: GrammarRule): string {
    let text = `📚 **قاعدة: ${rule.titleAr}**\n\n${rule.explanation}\n\n`;
    text += `**الهيكل:** \`${rule.structure}\`\n\n`;
    text += `**أمثلة:**\n${rule.examples.map((e) => `- ${e.kurdish} ← *${e.arabic}*${e.breakdown ? `\n  (${e.breakdown})` : ""}`).join("\n")}\n`;
    if (rule.tips?.length) {
      text += `\n💡 **نصائح:**\n${rule.tips.map((t) => `- ${t}`).join("\n")}`;
    }
    return text;
  }

  private formatConversation(conv: Conversation): string {
    const levelEmoji = { beginner: "🟢", intermediate: "🟡", advanced: "🔴" };
    let text = `🗣️ **محادثة: ${conv.topicAr}** ${levelEmoji[conv.level]}\n\n`;
    text += conv.lines.map((line) => {
      const speaker = line.speaker === "A" ? "الشخص الأول" : "الشخص الثاني";
      return `**${speaker}:** ${line.kurdish}\n_(${line.arabic})_${line.pronunciation ? `\n🔊 *${line.pronunciation}*` : ""}`;
    }).join("\n\n");
    text += "\n\n💡 **جرب قراءتها بصوت عالٍ!** أو اكتب **اختبرني** لتدريب على هذه المفردات.";
    return text;
  }

  // Search vocabulary (bi-directional: Arabic ↔ Kurdish)
  searchVocabulary(query: string): Word[] {
    const q = query.toLowerCase().trim();
    return ALL_WORDS.filter(
      (w) =>
        w.translation.includes(q) ||
        w.kurdish.toLowerCase().includes(q) ||
        q.includes(w.translation) ||
        q.includes(w.kurdish.toLowerCase()) ||
        (w.pronunciation && w.pronunciation.toLowerCase().includes(q))
    ).slice(0, 3);
  }
}

export const responseGenerator = new ResponseGenerator();
