/**
 * ═══════════════════════════════════════════════════════════════
 *  نظام الكاش الصوتي - Audio Cache System (3 Layers)
 * ═══════════════════════════════════════════════════════════════
 *
 *  الطبقة 1: RAM Cache  → أسرع (نفس الجلسة فقط)
 *  الطبقة 2: IndexedDB  → محلي دائم (بين الجلسات، بدون إنترنت)
 *  الطبقة 3: Firebase Storage → سحابي مشترك (يوفر استهلاك TTS)
 *
 *  تدفق العمل:
 *  طلب صوت → RAM؟ ✅ شغّل فوراً
 *             ↓ لا
 *           IndexedDB؟ ✅ شغّل + احفظ في RAM
 *             ↓ لا
 *           Firebase Storage؟ ✅ حمّل + احفظ في IndexedDB + RAM
 *             ↓ لا
 *           API TTS → شغّل + ارفع لـ Firebase + احفظ في كل الطبقات
 * ═══════════════════════════════════════════════════════════════
 */

import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

// ─── ثوابت ──────────────────────────────────────────────────────
const IDB_DB_NAME = "reber_audio_cache_v1";
const IDB_STORE_NAME = "audio_blobs";
const IDB_VERSION = 1;
const RAM_CACHE_MAX_SIZE = 50; // أقصى عدد ملفات في RAM

// ─── طبقة 1: RAM Cache ─────────────────────────────────────────
// Map<cacheKey, objectURL>
const ramCache = new Map<string, string>();
// Queue لإدارة الحجم (LRU بسيط)
const ramCacheOrder: string[] = [];

function ramGet(key: string): string | null {
  return ramCache.get(key) ?? null;
}

function ramSet(key: string, objectUrl: string) {
  if (ramCache.has(key)) return; // موجود مسبقاً
  // إذا امتلأ الكاش، احذف الأقدم
  if (ramCacheOrder.length >= RAM_CACHE_MAX_SIZE) {
    const oldest = ramCacheOrder.shift();
    if (oldest) {
      const url = ramCache.get(oldest);
      if (url) URL.revokeObjectURL(url);
      ramCache.delete(oldest);
    }
  }
  ramCache.set(key, objectUrl);
  ramCacheOrder.push(key);
}

// ─── طبقة 2: IndexedDB ─────────────────────────────────────────
let idbPromise: Promise<IDBDatabase> | null = null;

function openIDB(): Promise<IDBDatabase> {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_DB_NAME, IDB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    request.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
  return idbPromise;
}

async function idbGet(key: string): Promise<Blob | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, "readonly");
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn("[AudioCache] IndexedDB get failed:", e);
    return null;
  }
}

async function idbSet(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, "readwrite");
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn("[AudioCache] IndexedDB set failed:", e);
  }
}

// ─── مولّد مفتاح الكاش ─────────────────────────────────────────
export function generateAudioCacheKey(text: string, speakerId: string): string {
  let hash = 0;
  const str = `${text}::${speakerId}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const safePrefix = encodeURIComponent(text.trim().slice(0, 15))
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return `${safePrefix}_${Math.abs(hash)}`;
}

// مسار الملف في Firebase Storage
function getStoragePath(cacheKey: string, speakerId: string): string {
  return `tts_cache/${speakerId}/${cacheKey}.wav`;
}

// ─── الواجهة الرئيسية ───────────────────────────────────────────

/**
 * يحاول جلب الملف الصوتي من الكاش (RAM → IndexedDB → Firebase)
 * @returns objectURL إذا وُجد في الكاش، أو null إذا لم يُوجد
 */
export async function getFromAudioCache(
  cacheKey: string,
  speakerId: string
): Promise<string | null> {
  // ── طبقة 1: RAM ──────────────────────────────────────────────
  const ramHit = ramGet(cacheKey);
  if (ramHit) {
    console.log(`[AudioCache] 🟢 RAM hit: ${cacheKey}`);
    return ramHit;
  }

  // ── طبقة 2: IndexedDB ────────────────────────────────────────
  const idbBlob = await idbGet(cacheKey);
  if (idbBlob) {
    console.log(`[AudioCache] 🔵 IndexedDB hit: ${cacheKey}`);
    const url = URL.createObjectURL(idbBlob);
    ramSet(cacheKey, url);
    return url;
  }

  // ── طبقة 3: Firebase Storage ─────────────────────────────────
  if (navigator.onLine) {
    try {
      const storagePath = getStoragePath(cacheKey, speakerId);
      const audioRef = ref(storage, storagePath);
      const downloadUrl = await getDownloadURL(audioRef);
      console.log(`[AudioCache] 🟡 Firebase hit: ${cacheKey}`);

      // حمّل الـ blob وخزّنه في الطبقات المحلية
      const response = await fetch(downloadUrl);
      if (response.ok) {
        const blob = await response.blob();
        await idbSet(cacheKey, blob); // احفظ في IndexedDB
        const url = URL.createObjectURL(blob);
        ramSet(cacheKey, url); // احفظ في RAM
        return url;
      }
    } catch {
      // الملف غير موجود في Firebase — سيتم توليده لاحقاً
    }
  }

  console.log(`[AudioCache] ⚪ Cache miss: ${cacheKey}`);
  return null;
}

/**
 * يحفظ الملف الصوتي في كل طبقات الكاش
 * @param blob الـ blob الصوتي المُولَّد من TTS
 * @param uploadToFirebase إذا كان false لن يُرفع للـ Firebase (وضع offline)
 */
export async function saveToAudioCache(
  cacheKey: string,
  speakerId: string,
  blob: Blob,
  uploadToFirebase: boolean = true
): Promise<string> {
  // ── حفظ في IndexedDB أولاً (محلي، آمن) ──────────────────────
  await idbSet(cacheKey, blob);

  // ── إنشاء objectURL وحفظه في RAM ────────────────────────────
  const blobCopy = blob.slice(0); // نسخة للـ RAM (لتجنب مشاكل revokeObjectURL)
  const url = URL.createObjectURL(blobCopy);
  ramSet(cacheKey, url);

  // ── رفع Firebase Storage في الخلفية ─────────────────────────
  if (uploadToFirebase && navigator.onLine) {
    const storagePath = getStoragePath(cacheKey, speakerId);
    const audioRef = ref(storage, storagePath);

    // رفع في الخلفية بدون انتظار (non-blocking)
    uploadBytes(audioRef, blob, { contentType: "audio/wav" })
      .then(() => {
        console.log(`[AudioCache] ✅ Uploaded to Firebase: ${storagePath}`);
      })
      .catch((err) => {
        console.warn(`[AudioCache] ⚠️ Firebase upload failed: ${err.message}`);
        // لا بأس — الملف محفوظ في IndexedDB
      });
  }

  return url;
}

/**
 * يعطي إحصائيات الكاش للتطوير والمراقبة
 */
export function getAudioCacheStats() {
  return {
    ramSize: ramCache.size,
    ramKeys: [...ramCacheOrder],
  };
}

/**
 * يمسح كاش RAM فقط (IndexedDB وFirebase تبقى)
 */
export function clearRamAudioCache() {
  for (const url of ramCache.values()) {
    try { URL.revokeObjectURL(url); } catch {}
  }
  ramCache.clear();
  ramCacheOrder.length = 0;
  console.log("[AudioCache] RAM cache cleared.");
}
