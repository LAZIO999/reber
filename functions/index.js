const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.apiTts = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { text, speaker_id, model_version, speed } = req.body;
    if (!text || !speaker_id) {
      res.status(400).send("Bad Request: Missing text or speaker_id");
      return;
    }

    const response = await fetch("https://www.kurdishtts.com/api/tts-proxy", {
      method: "POST",
      headers: {
        "x-api-key": "f149c49a9bf8446c16ddf8b703d23b04076d9009",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        speaker_id,
        model_version: model_version || "v4",
        speed: speed || 1.0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kurdish TTS API error:", errorText);
      res.status(response.status).send(errorText);
      return;
    }

    // Return correct content type and send binary WAV buffer
    res.setHeader("Content-Type", "audio/wav");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});
