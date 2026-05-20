import { GoogleGenAI } from "@google/genai";
import { type UserProfile } from "../types";
import { MOCK_WORDS } from "../data/mockLessons";
import { Word } from "../types";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { kurdishAI } from "../ai/KurdishAI";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

class HybridAIService {
  private ai: GoogleGenAI | null = null;
  private localCache: Map<string, string> = new Map();

  constructor() {
    this.initCloudAI();
    this.loadCache();
  }

  private initCloudAI() {
    try {
      const userProvidedKey = "AIzaSyCAWv6BvqeGalECzXfYRAuKqES0OIqizWQ";
      // @ts-ignore
      const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined;
      const apiKey = envKey || userProvidedKey;
      if (apiKey) {
        this.ai = new GoogleGenAI({ apiKey });
      }
    } catch (e) {
      console.warn("Could not initialize Cloud AI", e);
    }
  }

  private loadCache() {
    try {
      const cached = localStorage.getItem("ai_chat_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        this.localCache = new Map(Object.entries(parsed));
      }
    } catch (e) {
      console.warn("Could not load AI cache", e);
    }
  }

  private saveCache() {
    try {
      const obj = Object.fromEntries(this.localCache);
      localStorage.setItem("ai_chat_cache", JSON.stringify(obj));
    } catch (e) {
      console.warn("Could not save AI cache", e);
    }
  }

  // Simple string hash function
  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // --- LOCAL INTELLIGENCE ENGINE ---

  private searchLocalVocabulary(text: string): Word[] {
    const query = text.toLowerCase().trim();
    // Search words that might match the meaning in Arabic or Kurdish
    return MOCK_WORDS.filter(
      (w) =>
        w.translation.includes(query) ||
        w.kurdish.toLowerCase().includes(query) ||
        query.includes(w.translation) ||
        query.includes(w.kurdish.toLowerCase()),
    );
  }

  private isVocabularyRequest(text: string): boolean {
    const intentKeywords = [
      "معنى",
      "معني",
      "ترجم",
      "ترجمة",
      "كيف اقول",
      "يعني",
      "ما هو",
      "كيف نقول",
    ];
    return intentKeywords.some((keyword) => text.includes(keyword));
  }

  private handleLocalRequest(input: string): string | null {
    const text = input.toLowerCase();

    // Grammar hints
    if (
      text.includes("قواعد") ||
      text.includes("قاعدة") ||
      text.includes("كيف اركب جملة") ||
      text.includes("جمع") ||
      text.includes("ضمائر")
    ) {
      if (text.includes("جمع")) {
        return `(محلي ⚡) **قاعدة الجمع البسيطة:**\nفي الكردية، نجمع الكلمات بإضافة أدوات معينة. الأسهل والأكثر شيوعاً إضافة اللاحقة **(ان - an)** للأسماء.\n\n💡 **أمثلة:**\n- ماڵ (بيت) ➡️ ماڵان (بيوت)\n- کچ (بنت) ➡️ کچان (بنات)\n\nهل تريد اختباراً قصيراً فيها؟`;
      }
      return `(محلي ⚡) **قاعدة تركيب الجملة:**\nفي الكردية، الجملة تكون: **فاعل - مفعول به - فعل** (عكس العربية تماماً!).\n\n💡 **مثال:**\n- أنا التفاحة آكل = من سێو دەخۆم.\n\nاستمر في التدرب، أنت تبلي بلاءً حسناً! 🎉`;
    }

    // Pronunciation hints
    if (
      text.includes("نطق") ||
      text.includes("انطق") ||
      text.includes("الفض") ||
      text.includes("تلفظ")
    ) {
      return `(محلي ⚡) **نصائح النطق (Pronunciation):**\nاللغة الكردية تُقرأ كما تُكتب تماماً! تتضمن حروفاً لا توجد في العربية مثل:\n- **پ (P):** مثل Park\n- **چ (Ch):** مثل Chair\n- **ژ (Jh):** مثل تلفظ حرف الجيم في اللهجة الشامية\n- **گ (G):** مثل Go\n- **ڤ (V):** مثل Van\n\n💡 قسّم الكلمة إلى مقاطع لتسهيلها. مثال: نەخۆشخانە (مستشفى) تُنطق: نَـ - خُوش - خا - نَـه.`;
    }

    // Quiz Generation
    if (
      text.includes("اختبار") ||
      text.includes("كويز") ||
      text.includes("تمرين") ||
      text.includes("اختبرني")
    ) {
      const types = ["خيارات", "ترجمة"];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const randomWords = MOCK_WORDS.sort(() => 0.5 - Math.random()).slice(0, 3);
      const target = randomWords[0];
      
      if (type === "خيارات") {
        const options = randomWords.map(w => w.translation);
        // shuffle options
        options.sort(() => 0.5 - Math.random());
        return `(محلي ⚡) 📝 **سؤال ذكي:**\nما هو معنى الكلمة الكردية **"${target.kurdish}"**؟\n\n1️⃣ ${options[0]}\n2️⃣ ${options[1]}\n3️⃣ ${options[2]}\n\nأجب برقم الخيار! 🧠`;
      } else {
        return `(محلي ⚡) 📝 **تحدي الترجمة:**\nكيف تقول **"${target.translation}"** باللغة الكردية؟\n\nحاول كتابتها، وسأصحح لك! 💪`;
      }
    }

    // Conversation templates
    if (
      text.includes("محادثة") ||
      text.includes("حوار") ||
      text.includes("كيف اتحدث") ||
      text.includes("عمل") ||
      text.includes("شغل") ||
      text.includes("سوق") ||
      text.includes("يومية")
    ) {
      // More specific context matching
      if (
        text.includes("عمل") ||
        text.includes("شغل") ||
        text.includes("وظيفة") ||
        text.includes("دوام")
      ) {
        return `(محلي ⚡) إليك نموذج محادثة في العمل (لە کار):\n- **الموظف:** بەیانیت باش، ئەمڕۆ کارێکی زۆرمان هەیە؟ (صباح الخير، هل لدينا عمل كثير اليوم؟)\n- **المدير:** بەڵێ، تکایە ئەو راپۆرتە تەواو بکە. (نعم، من فضلك أكمل ذلك التقرير.)\n- **الموظف:** بەسەرچاو، ئێستا دەیکەم. (على عيني، سأفعله الآن.)\n- **المدير:** دەستخۆش. (عاشت يدك / أحسنت.)`;
      }

      if (
        text.includes("يوميات") ||
        text.includes("حياة") ||
        text.includes("تسوق") ||
        text.includes("سوق") ||
        text.includes("يومية") ||
        text.includes("شارع")
      ) {
        return `(محلي ⚡) إليك نموذج محادثة في السوق والحياة اليومية (لە بازاڕ و ژیانی ڕۆژانە):\n- **الزبون:** سڵاو، نرخی ئەمە چەندە؟ (مرحباً، كم سعر هذا؟)\n- **البائع:** ئەوە بە پێنج هەزار دینارە. (هذا بخمسة آلاف دينار.)\n- **الزبون:** کەمێک کەمتی بکە. (قلل السعر قليلاً.)\n- **البائع:** باشە، بۆ تۆ بە چوار هەزار. (حسناً، لك بأربعة آلاف.)\n- **الزبون:** زۆر سوپاس. (شكراً جزيلاً.)\n\n💡 للتحيات اليومية، يمكنك القول "بەیانیت باش" (صباح الخير) أو "ئێوارەت باش" (مساء الخير).`;
      }

      return `(محلي ⚡) إليك نموذج محادثة تعارف بسيطة:\n- **الشخص الأول:** سڵاو، چۆنی؟ (مرحباً، كيف حالك؟)\n- **الشخص الثاني:** من باشم، سوپاس. ئەی تۆ چۆنی؟ (أنا بخير، شكراً. وأنت كيف حالك؟)\n- **الشخص الأول:** منیش باشم. ناوت چییە؟ (أنا أيضاً بخير. ما اسمك؟)\n- **الشخص الثاني:** ناوم ئازادە. (اسمي آزاد.)\n\n💡 يمكنك أيضاً طلب "محادثة في العمل" أو "محادثة للتسوق"!`;
    }

    if (this.isVocabularyRequest(input)) {
      let searchTarget = input
        .replace(/معنى|ما هو|كيف اقول|كيف نقول|ترجم|كلمة/g, "")
        .trim();
      searchTarget = searchTarget.replace(/[؟?.,!]/g, "").trim();

      const foundWords = this.searchLocalVocabulary(searchTarget);
      if (foundWords.length > 0) {
        const word = foundWords[0];
        // Provide meaning + extra example if available + phonetic breakdown
        let response = `(محلي ⚡) **قاموس رێبەر:**\nالكلمة: **${word.kurdish}**\nالمعنى: **${word.translation}**\nالنطق: *${word.pronunciation}*\n\n`;
        if (word.category === "greetings") {
          response += `💡 **مثال:** ${word.kurdish}، چۆنی؟ (مرحباً، كيف حالك؟)\n`;
        } else if (word.category === "food") {
          response += `💡 **مثال:** من دەمەوێت ${word.kurdish} بخۆم (أريد أن آكل ${word.translation})\n`;
        } else if (word.category === "numbers") {
          response += `💡 **مثال:** من ${word.kurdish} سێوم هەیە (عندي ${word.translation} تفاحات)\n`;
        } else {
          response += `💡 **مثال:** ئەمە ${word.kurdish}ە (هذا/هذه ${word.translation})\n`;
        }
        
        response += `\n🔥 أحسنت التعلم! هل تريد اختباراً عن هذه الكلمة لحفظها أفضل؟`;
        return response;
      }
    }

    // Greeting fallback
    if (/مرحبا|هلا|سلام/.test(input)) {
      return "(محلي ⚡) مرحباً! (سڵاو). كيف يمكنني مساعدتك في تعلم الكردية اليوم؟";
    }

    return null;
  }

  // Trims extra whitespace only - does NOT remove emojis or special chars
  private trimPrompt(text: string): string {
     return text
      .trim()
      .replace(/\s+/g, ' '); // collapse structural spacing only
  }

  // --- HYBRID ROUTER With Consumption Optimizer ---

  public async askAI(
    input: string,
    messages: ChatMessage[],
    profile: UserProfile | null,
  ): Promise<string> {
    const trimmedInput = input.trim();
    if (!trimmedInput) return "يبدو أن رسالتك فارغة! 😊";

    // ── LAYER 1: Local Kurdish AI Engine (Zero API cost, instant) ──────────
    const localResponse = await kurdishAI.process(trimmedInput, messages, profile);
    if (localResponse !== null) {
      return localResponse;
    }

    // ── LAYER 2: Local Memory Cache ─────────────────────────────────────────
    const cacheKey = trimmedInput.toLowerCase();
    const promptHash = this.generateHash(cacheKey);

    if (this.localCache.has(cacheKey)) {
      return this.localCache.get(cacheKey)!;
    }

    // 3. Pre-Flight Check: Firestore Database (Zero-API-Cost playback)
    if (navigator.onLine) {
        try {
            const cacheDocRef = doc(db, "gemini_cache", promptHash);
            const cacheSnapshot = await getDoc(cacheDocRef);

            if (cacheSnapshot.exists()) {
                console.log(`[Optimizer] Hit Firestore Cache for prompt: ${promptHash}`);
                
                // Smart Caching Logic: Update hit_count and last_accessed
                try {
                    await updateDoc(cacheDocRef, {
                        hit_count: increment(1),
                        last_accessed: serverTimestamp()
                    });
                } catch(updateErr) {
                    // non-critical
                }

                const answer = cacheSnapshot.data().answer;
                this.localCache.set(cacheKey, answer);
                this.saveCache();
                return answer;
            }
        } catch (dbErr) {
            console.error("Firestore Cache Check Failed:", dbErr);
        }
    }

    // 4. Try Cloud AI if configured
    if (navigator.onLine && this.ai) {
      try {
        const systemInstruction = `أنت "المعلم رێبەر" (Mamosta Rêber)، معلم لغة كردية (باللهجة السورانية حصرياً) خبير، ذكي جداً، عاطفي، وواسع الاطلاع. 
مهمتك ليست فقط الترجمة، بل تعليم المستخدمين (الناطقين بالعربية) اللغة الكردية بأسلوب تفاعلي، مشجع، وممتع.

### قواعد أساسية وصارمة (CRITICAL INSTRUCTIONS):
1. استخدم **اللهجة السورانية فقط** (Sorani dialect). يُمنع منعاً باتاً استخدام الكرمانجية (Kurmanji) أو البهدينية (Badini) أو الحورامية (Hawrami). إذا طلب المستخدم كلمة لها مرادف كرمانجي، أعطه الموازي السوراني فقط.
2. تحدث دائماً باللغة العربية مع المستخدم ما لم يطلب محادثة كاملة بالكردية.
3. كن ودوداً جداً، استخدم الإيموجي المناسبة، وشجع المستخدم دائماً بعبارات مثل "أحسنت!"، "ممتاز!"، أو "دەستخۆش!".

### قدراتك وأسلوبك (YOUR CAPABILITIES & STYLE):

1. **الاستيعاب العميق والمحادثة (Deep Understanding & Conversation):**
   - افهم نية المستخدم. إذا كان يمزح، مازحه. إذا كان محبطاً من التعلم، شجعه.
   - إذا سأل سؤالاً عاماً عن الثقافة الكردية، أجب بشغف ومعلومات دقيقة.
   - إذا أراد ممارسة المحادثة، العب دور الشخصية التي يريدها (بائع في السوق، صديق، طبيب) واستخدم لغة يومية طبيعية وليست آلية.

2. **التصحيح المنهجي (Systematic Correction):**
   - عندما يخطئ المستخدم، لا تعطه الجواب الصحيح فقط.
   - أولاً: اذكر جملته. ثانياً: التصحيح بالكردية السورانية. ثالثاً: اشرح القاعدة ببساطة شديدة.

3. **تبسيط القواعد (Simplifying Grammar):**
   - اشرح القواعد (كالإضافة Izafa، الضمائر المتصلة، الأزمنة) كأنك تشرح لصديق، استخدم أمثلة من الحياة اليومية.
   - لا تستخدم مصطلحات لغوية معقدة بدون شرحها.

4. **النطق واللفظ (Transliteration & Pronunciation):**
   - دائماً وفر اللفظ بالحروف اللاتينية أو العربية المشكلة لتسهيل القراءة (مثل: چۆنی؟ - Choni؟).
   - انتبه للحروف الكردية الخاصة (پ، چ، ژ، گ، ڤ، ۆ، ێ) ووضح كيف تُنطق إذا اقتضى الأمر.

5. **الثقافة والمصطلحات (Culture & Idioms):**
   - علم المستخدم المصطلحات الدارجة في الشارع الكردي (في السليمانية أو أربيل).
   - تجنب الترجمة الحرفية الجافة، بل أعطِ المعنى السياقي.

6. **الذخيرة اللغوية الواسعة (Extensive Vocabulary & Word Expansion):**
   - تم تدريبك الآن لكي تكون قاموساً حياً واسعاً جداً. وظف مفردات غنية ومتنوعة من مختلف المجالات (التكنولوجيا، الطب، الحياة اليومية، المشاعر، الطبيعة، الأدب).
   - عند تعليم المستخدم كلمة، استغل الفرصة لإعطائه كلمات متعلقة بها، أو مرادفاتها، أو تضادها لكي توسع حصيلته اللغوية بسرعة.

تذكر: أنت لست مجرد قاموس، أنت رفيق رحلة تعلم اللغة الكردية للمستخدم. اجعل كل محادثة معه تجربة لا تُنسى ومثمرة لغوياً!`;

        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            ...messages.map((m) => ({
              role: m.role,
              parts: [{ text: m.text }],
            })),
            { role: "user", parts: [{ text: trimmedInput }] },
          ],
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const modelText = response.text || "عذراً، لم أتمكن من معالجة ذلك.";

        // Cache locally
        this.localCache.set(cacheKey, modelText);
        this.saveCache();

        // 5. Smart Caching Logic: Save to Firestore
        try {
            const cacheDocRef = doc(db, "gemini_cache", promptHash);
            await setDoc(cacheDocRef, {
                question: trimmedInput,
                answer: modelText,
                hit_count: 1,
                last_accessed: serverTimestamp(),
                created_at: serverTimestamp(),
            });
            console.log(`[Optimizer] Saved new AI response to Firestore Vault: ${promptHash}`);
        } catch (dbErr) {
            console.error("Failed to cache AI response in Firestore:", dbErr);
        }

        return modelText;
      } catch (error: any) {
        const errMsg = error?.message || JSON.stringify(error);
        console.error("Cloud AI Error details:", errMsg);
        // Fallback to offline message
        return `(خطأ في الخادم 📴) عذراً، حدث خطأ تقني: ${errMsg.slice(0, 100)}. يمكنني مساعدتك في معاني الكلمات الأساسية إذا أردت!`;
      }
    } else {
      // Offline / No API key, local engine didn't catch it
      return "(غير متصل بالإنترنت 📴) عذراً، أنت غير متصل بالإنترنت حالياً ولا يملك نظامي المحلي إجابة لهذا السؤال. حاول سؤالي عن مفردات بسيطة!";
    }
  }
  
  // Backward compatibility wrapper
  public async generateResponse(
    input: string,
    messages: ChatMessage[],
    profile: UserProfile | null,
  ): Promise<string> {
     return this.askAI(input, messages, profile);
  }

  public clearCache() {
    this.localCache.clear();
    localStorage.removeItem("ai_chat_cache");
  }
}

export const aiService = new HybridAIService();
