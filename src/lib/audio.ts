import { convertSoraniToLatin } from "./kurdishTransliterator";
import {
  generateAudioCacheKey,
  getFromAudioCache,
  saveToAudioCache,
} from "./audioCache";

// ─── أصوات تأثيرات اللعبة ───────────────────────────────────────

export const playCorrectSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playDing = (freq: number, delay: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.3);
        }
        playDing(600, 0);
        playDing(800, 0.1);
    } catch (e) {}
};

export const playWrongSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playBuzzer = (freq: number, delay: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.3);
        }
        playBuzzer(150, 0);
        playBuzzer(120, 0.15);
    } catch (e) {}
};

export const playFinishSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        let delay = 0;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(i === freqs.length - 1 ? 0.3 : 0.2, ctx.currentTime + delay + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + (i === freqs.length - 1 ? 0.8 : 0.3));
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + (i === freqs.length - 1 ? 0.8 : 0.3));
            delay += 0.12;
        });
    } catch(e) {}
};

export const playCuteSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playDing = (freq: number, delay: number, type: OscillatorType = "sine") => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + delay + 0.1);
            
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.25);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.3);
        }
        
        playDing(400, 0, "sine");
        playDing(600, 0.15, "triangle");
    } catch (e) {}
};

// ─── الدالة الرئيسية لتشغيل الصوت الكردي ──────────────────────
/**
 * تشغيل الصوت الكردي مع نظام كاش 3 طبقات:
 *   RAM → IndexedDB → Firebase Storage → TTS API → Speech Synthesis
 *
 * أول مرة: يُولَّد الصوت من TTS ويُحفظ في كل الطبقات تلقائياً.
 * المرات التالية: يُشغَّل مباشرة من الكاش بدون استهلاك أي حد يومي.
 */
export const playKurdishAudio = async (text: string): Promise<void> => {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  // تحديد معرّف المتكلم بناءً على نوع النص
  const isArabicScript = /[\u0600-\u06FF]/.test(trimmedText);
  const speaker_id = isArabicScript ? "sorani_1" : "kurmanji_236";

  // توليد مفتاح الكاش الفريد
  const cacheKey = generateAudioCacheKey(trimmedText, speaker_id);

  // ── المحاولة من الكاش (طبقة 1 + 2 + 3) ──────────────────────
  const cachedUrl = await getFromAudioCache(cacheKey, speaker_id);
  if (cachedUrl) {
    await playAudioUrl(cachedUrl);
    return;
  }

  // ── لا يوجد في الكاش → توليد من TTS API ────────────────────
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmedText, speaker_id, speed: 1.0 }),
    });

    if (!response.ok) {
      throw new Error(`TTS API responded with ${response.status}`);
    }

    const blob = await response.blob();

    // ── حفظ في كل طبقات الكاش (IndexedDB + RAM + Firebase في الخلفية) ──
    const objectUrl = await saveToAudioCache(
      cacheKey,
      speaker_id,
      blob,
      navigator.onLine // ارفع لـ Firebase فقط إذا كان هناك اتصال
    );

    await playAudioUrl(objectUrl);
    return;

  } catch (apiError) {
    console.error("[Audio] TTS API failed, falling back to Speech Synthesis:", apiError);
  }

  // ── بديل أخير: Web Speech Synthesis ─────────────────────────
  fallbackToSpeechSynthesis(trimmedText, isArabicScript);
};

// ─── دوال مساعدة ───────────────────────────────────────────────

/** تشغيل صوت من objectURL أو URL عادي */
async function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play().catch(reject);
  });
}

/** الاحتياط الأخير: نطق محلي عبر Web Speech API */
function fallbackToSpeechSynthesis(text: string, isArabicScript: boolean): void {
  if (!("speechSynthesis" in window)) return;

  const textToSpeak = isArabicScript ? convertSoraniToLatin(text) : text;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(textToSpeak);
  utter.lang = "tr-TR";
  utter.rate = 0.82;
  utter.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const pick =
    voices.find((v) => v.lang.startsWith("tr")) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null;

  if (pick) utter.voice = pick;
  window.speechSynthesis.speak(utter);
}