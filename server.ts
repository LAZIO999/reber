import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    // Priority: User's provided API key
    const userProvidedKey = "AIzaSyD-ra1t6qwLI8iFlvUzjc7dsjCekSphnEQ";
    aiClient = new GoogleGenAI({ apiKey: userProvidedKey || process.env.GEMINI_API_KEY });
  }
  return aiClient;
}
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userProfile } = req.body;
      
      const systemInstruction = `أنت "رێبەر" (Reber)، الذكاء الاصطناعي المعلم والشخصي للغة الكردية (اللهجة ${userProfile?.selectedDialect || "السورانية"}). أسلوبك يشبه معلم تفاعلي ذكي وودود جداً.
أهدافك وقواعدك:
1. **تدريب وتعليم:** درب المستخدم ليتعلم اللغة الكردية وقواعدها بشكل مبسط. أعط أمثلة واضحة.
2. **توضيح المفردات:** عند شرح كلمة، قدم: نصها الكردي، ترجمتها، نطقها المقطعي، مثال في جملة، وإيموجي.
3. **محاكاة المحادثات:** شجع المستخدم على التحدث وصحح أخطاءه بلطف.
4. **توليد الاختبارات القصيرة (Quizzes):** إذا طلب اختباراً، أعطه سؤالاً واحداً (خيارات، أو ترجمة)، وانتظر إجابته.
5. **تحفيز (Motivation):** استخدم عبارات تشجيعية (أحسنت! ممتاز!).
6. ركز على التنسيق الجميل والمنظم (Bold/Lists)، وقسم الإجابات لتكون مريحة للعين. لا تكن طويلاً جداً.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: messages,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "فشل في الاتصال بالذكاء الاصطناعي." });
    }
  });

  // API route for TTS
  app.post("/api/tts", async (req, res) => {
    try {
      let { text, speaker_id, speed } = req.body;
      
      // Default parameters
      if (!speaker_id) speaker_id = "sorani_1";
      if (!speed) speed = 1.0;
      
      const ttsData = JSON.stringify({
        text,
        speaker_id,
        model_version: "v4",
        speed
      });

      const fetchRes = await fetch("https://www.kurdishtts.com/api/tts-proxy", {
        method: "POST",
        headers: {
          "x-api-key": "f149c49a9bf8446c16ddf8b703d23b04076d9009",
          "Content-Type": "application/json"
        },
        body: ttsData
      });

      if (!fetchRes.ok) {
        throw new Error(`TTS API Error: ${fetchRes.statusText}`);
      }
      
      const arrayBuffer = await fetchRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader("Content-Type", "audio/wav");
      res.send(buffer);
    } catch (error: any) {
      console.error("TTS API Error:", error);
      res.status(500).json({ error: "فشل في توليد الصوت." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
