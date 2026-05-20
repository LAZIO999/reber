export const EMOJI_MAP: Record<string, string> = {
  // Greetings
  "Sław": "👋",
  "Beyanî baş": "🌅",
  "Şew baş": "🌙",
  "Supas": "🙏",
  "Çonî?": "🤔",
  "Başim": "🤝",
  // Numbers
  "Yek": "1️⃣",
  "Dû": "2️⃣",
  "Sê": "3️⃣",
  "Çwar": "4️⃣",
  "Pênc": "5️⃣",
  "Şeş": "6️⃣",
  "Ḩewt": "7️⃣",
  "Heşt": "8️⃣",
  "No": "9️⃣",
  "De": "🔟",
  // Colors
  "Sûr": "🔴",
  "Sor": "🔴",
  "Şîn": "🔵",
  "Sewz": "🟢",
  "Zerd": "🟡",
  "Reş": "⚫",
  "Spî": "⚪",
  "Qaweyî": "🟤",
  "Porteqalî": "🟠",
  "Pemeyî": "🌸",
  "Mor": "🟣",
  "Xolemêşî": "🩶",
  // Family
  "Dayk": "👩‍👦",
  "Bawk": "👨‍👦",
  "Bira": "👦",
  "Xuşk": "👧",
  "Bapîr": "👴",
  "Dapîr": "👵",
  // Food
  "Nan": "🍞",
  "Aw": "💧",
  "Ça": "☕",
  "Qawe": "☕",
  "Goşt": "🥩",
  "Mîwe": "🍎",
  // Travel
  "Taksî": "🚕",
  "Firokexane": "✈️",
  "Pas": "🚌",
  "Bilit": "🎫",
};

export const getEmojiForWord = (kurdish: string, category: string): string => {
  if (EMOJI_MAP[kurdish]) return EMOJI_MAP[kurdish];

  const genericCategoryEmojis: Record<string, string> = {
    greetings: "💬",
    numbers: "🔢",
    colors: "🎨",
    family: "👨‍👩‍👧‍👦",
    verbs: "✨",
    adjectives: "🎭",
    house: "🏡",
    nature: "🍃",
    animals: "🐾",
    jobs: "💼",
    food: "🍲",
    time: "⏰",
    body: "🧍",
    weather: "🌤️",
    school: "🏫",
    technology: "📱",
    clothing: "👕",
    travel: "✈️",
    health: "🩺",
    emotions: "💭",
    grammar: "📖",
    drinks: "🥤",
    places: "📍",
    items: "📦",
  };

  return genericCategoryEmojis[category] || "🎓";
};
