// numberConverter.ts
// Utility to convert numbers into Kurdish Sorani text

const units = ["", "یەک", "دوو", "سێ", "چوار", "پێنج", "شەش", "حەوت", "هەشت", "نۆ"];
const unitsPron = ["", "Yek", "Dû", "Sê", "Çwar", "Pênc", "Şeş", "Hewt", "Heşt", "No"];

const tens = ["", "دە", "بیست", "سی", "چل", "پەنجا", "شەست", "حەفتا", "هەشتا", "نەوەد"];
const tensPron = ["", "De", "Bîst", "Sî", "Çil", "Penca", "Şest", "Hefta", "Heşta", "Newed"];

const hundreds = ["", "سەد", "دووسەد", "سێسەد", "چوارسەد", "پێنجسەد", "شەشسەد", "حەوتسەد", "هەشتسەد", "نۆسەد"];
const hundredsPron = ["", "Sed", "Dûsed", "Sêsed", "Çwarsed", "Pêncsed", "Şeşsed", "Hewtsed", "Heştsed", "Nosed"];

// Special cases for 11-19
const teens = ["دە", "یازدە", "دوانزە", "سیانزە", "چواردە", "پازدە", "شانزە", "حەڤدە", "هەژدە", "نۆزدە"];
const teensPron = ["De", "Yazde", "Dwanze", "Syanze", "Çwarde", "Pazde", "Şanze", "Hevde", "Hejde", "Nozde"];

export interface NumberResult {
  kurdish: string;
  pronunciation: string;
}

export function convertNumberToKurdish(numStr: string): NumberResult | null {
  // Clean input
  const cleanNum = numStr.replace(/[^0-9]/g, "");
  if (!cleanNum) return null;

  const num = parseInt(cleanNum, 10);
  
  if (isNaN(num)) return null;
  if (num === 0) return { kurdish: "سفر", pronunciation: "Sifir" };

  if (num < 0 || num > 9999999) {
    return { kurdish: "ئەم ژمارەیە زۆر گەورەیە", pronunciation: "Em jimareye zor gewreye" };
  }

  return processNumber(num);
}

function processNumber(num: number): NumberResult {
  if (num === 0) return { kurdish: "", pronunciation: "" };

  if (num < 10) {
    return { kurdish: units[num], pronunciation: unitsPron[num] };
  }

  if (num >= 11 && num <= 19) {
    return { kurdish: teens[num - 10], pronunciation: teensPron[num - 10] };
  }

  if (num < 100) {
    const t = Math.floor(num / 10);
    const u = num % 10;
    if (u === 0) return { kurdish: tens[t], pronunciation: tensPron[t] };
    return combine(
      { kurdish: tens[t], pronunciation: tensPron[t] },
      { kurdish: units[u], pronunciation: unitsPron[u] }
    );
  }

  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    if (rem === 0) return { kurdish: hundreds[h], pronunciation: hundredsPron[h] };
    return combine(
      { kurdish: hundreds[h], pronunciation: hundredsPron[h] },
      processNumber(rem)
    );
  }

  if (num < 1000000) {
    const th = Math.floor(num / 1000);
    const rem = num % 1000;
    
    let thResult: NumberResult;
    if (th === 1) {
      thResult = { kurdish: "هەزار", pronunciation: "Hezar" };
    } else {
      const p = processNumber(th);
      thResult = { kurdish: p.kurdish + " هەزار", pronunciation: p.pronunciation + " Hezar" };
    }

    if (rem === 0) return thResult;
    return combine(thResult, processNumber(rem));
  }

  // Millions
  const m = Math.floor(num / 1000000);
  const rem = num % 1000000;
  
  let mResult: NumberResult;
  if (m === 1) {
    mResult = { kurdish: "یەک ملیۆن", pronunciation: "Yek Mîlyon" };
  } else {
    const p = processNumber(m);
    mResult = { kurdish: p.kurdish + " ملیۆن", pronunciation: p.pronunciation + " Mîlyon" };
  }

  if (rem === 0) return mResult;
  return combine(mResult, processNumber(rem));
}

function combine(part1: NumberResult, part2: NumberResult): NumberResult {
  if (!part1.kurdish) return part2;
  if (!part2.kurdish) return part1;
  return {
    kurdish: part1.kurdish + " و " + part2.kurdish,
    pronunciation: part1.pronunciation + " u " + part2.pronunciation
  };
}
