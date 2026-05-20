import { convertSoraniToLatin } from "./kurdishTransliterator";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

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
            // cute pitch bend up
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

export const playKurdishAudio = async (text: string) => {
   const AUDIO_MAP: Record<string, string> = {};

   // Check if we have a pre-recorded audio for this text (case-insensitive check)
   const customAudioUrl = AUDIO_MAP[text] || AUDIO_MAP[text.trim()] || Object.entries(AUDIO_MAP).find(([key]) => key.toLowerCase() === text.trim().toLowerCase())?.[1];

   if (customAudioUrl) {
     try {
       const audio = new Audio(customAudioUrl);
       // Play directly to avoid iOS blocking delayed playback
       await audio.play();
       return; // If successful, exit
     } catch (err) {
       console.error("Custom audio playback failed, falling back to TTS:", err);
     }
   }

   const isArabicScript = /[\u0600-\u06FF]/.test(text);
   const speaker_id = isArabicScript ? "sorani_1" : "kurmanji_236";
   
   // Generate cache filename
   const safeTitle = encodeURIComponent(text.slice(0, 20)).replace(/[^a-zA-Z0-9]/g, '');
   let textHash = 0;
   for (let i = 0; i < text.length; i++) {
      textHash = ((textHash << 5) - textHash) + text.charCodeAt(i);
      textHash = textHash & textHash; 
   }
   const fileName = `tts_cache/${safeTitle}_${Math.abs(textHash)}_${speaker_id}.wav`;

   // Try to fetch from Firebase Storage first
   try {
     const audioRef = ref(storage, fileName);
     const cachedUrl = await getDownloadURL(audioRef);
     
     if (cachedUrl) {
       console.log("Playing from Firebase cache:", fileName);
       const audio = new Audio(cachedUrl);
       await new Promise((resolve, reject) => {
         audio.onended = resolve;
         audio.onerror = reject;
         audio.play().catch(reject);
       });
       return;
     }
   } catch (error) {
     // Expected to fail if file doesn't exist yet
     console.log("No cache found, generating new TTS audio...");
   }

   try {
     const response = await fetch("/api/tts", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         text,
         speaker_id,
         speed: 1.0
       })
     });

     if (!response.ok) throw new Error("Network response was not ok from TTS API");
     
     const blob = await response.blob();
     
     // Save to Firebase Storage in background
     try {
       const audioRef = ref(storage, fileName);
       uploadBytes(audioRef, blob).then(() => {
         console.log("Successfully cached audio to Firebase:", fileName);
       }).catch((err) => {
         console.error("Failed to cache audio in Firebase:", err);
       });
     } catch (cacheErr) {
       console.warn("Could not initiate cache upload:", cacheErr);
     }

     const url = URL.createObjectURL(blob);
     const audio = new Audio(url);
     
     await new Promise((resolve, reject) => {
       audio.onended = () => {
         URL.revokeObjectURL(url);
         resolve(true);
       };
       audio.onerror = (e) => {
         URL.revokeObjectURL(url);
         reject(e);
       };
       audio.play().catch(reject);
     });
     return; // Success with API key
   } catch (e) {
     console.error("TTS API engine failed, falling back to local speech synthesis:", e);
   }

   // Fallback to local speech synthesis
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
};