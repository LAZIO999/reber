// Mapping object defining specific substitution rules from Latin to Sorani
const SORANI_MAP: Record<string, string> = {
  // Consonants
  b: "ب",
  c: "ج",
  ç: "چ",
  d: "د",
  f: "ف",
  g: "گ",
  h: "ه",
  j: "ژ",
  k: "ک",
  l: "ل",
  m: "م",
  n: "ن",
  p: "پ",
  q: "ق",
  r: "ر",
  s: "س",
  ş: "ش",
  t: "ت",
  v: "ڤ",
  w: "و",
  x: "خ",
  y: "ی",
  z: "ز",
  ll: "ڵ",
  rr: "ڕ",
  "ł": "ڵ",
  "ř": "ڕ",
  "ḧ": "ح",
  "ḩ": "ح",
  "ẍ": "غ",

  // Vowels
  a: "ا",
  e: "ە",
  ê: "ێ",
  i: "", // Short 'i' is unwritten in Sorani Arabic script
  î: "ی",
  o: "ۆ",
  u: "و",
  û: "وو",
  
  // Specific clusters
  xwe: "خۆ",
};

// Extremely basic reverse map. Real transliteration is stateful.
const LATIN_MAP: Record<string, string> = {
  "ب": "b",
  "ج": "c",
  "چ": "ç",
  "د": "d",
  "ف": "f",
  "گ": "g",
  "ه": "h",
  "ژ": "j",
  "ک": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "پ": "p",
  "ق": "q",
  "ر": "r",
  "س": "s",
  "ش": "ş",
  "ت": "t",
  "ڤ": "v",
  "و": "w",
  "خ": "x",
  "ی": "y",
  "ز": "z",
  "ڵ": "ll",
  "ڕ": "rr",
  "ا": "a",
  "ە": "e",
  "ێ": "ê",
  "ۆ": "o",
  "وو": "û",
};

export function convertLatinToSorani(latinText: string): string {
  if (!latinText) return "";
  let text = latinText.toLowerCase();

  // Multi-character replacements first
  text = text.replace(/ll/g, "ڵ");
  text = text.replace(/rr/g, "ڕ");
  text = text.replace(/xwe/g, "خۆ");

  // Single character replacement
  let output = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    output += SORANI_MAP[char] || char;
  }

  // Very basic fix for starting vowels in Sorani (requires independent vowel marker "ئ")
  output = output.replace(/^([اەێۆوویێ])/g, "ئ$1");
  output = output.replace(/(\s)([اەێۆوویێ])/g, "$1ئ$2");

  return output;
}

export function convertSoraniToLatin(soraniText: string): string {
  if (!soraniText) return "";
  let text = soraniText;
  
  // Remove independent vowel marker before processing
  text = text.replace(/ئ/g, "");
  
  // Multi-character replacements
  text = text.replace(/وو/g, "û");
  
  let output = "";
  for (let i = 0; i < text.length; i++) {
     const char = text[i];
     output += LATIN_MAP[char] || char;
  }
  
  return output;
}
