import { create } from "zustand";
import { SavedWord, Word, FailedWord } from "../types";
import { firestoreService } from "../services/firestoreService";

interface WordState {
  savedWords: SavedWord[];
  failedWords: FailedWord[];
  loading: boolean;
  fetchSavedWords: (userId: string) => Promise<void>;
  toggleSaveWord: (userId: string, word: Word) => Promise<void>;
  handleFailedWord: (userId: string, word: Word) => void;
  isWordSaved: (wordId: string) => boolean;
  updateWordReviewStatus: (
    userId: string,
    wordId: string,
    isCorrect: boolean,
  ) => Promise<void>;
}

const calculateNextReview = (
  easeFactor: number = 2.5,
  interval: number = 0,
  reviewCount: number = 0,
  isCorrect: boolean,
) => {
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newReviewCount = reviewCount;

  if (isCorrect) {
    if (reviewCount === 0) {
      newInterval = 1;
    } else if (reviewCount === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newReviewCount += 1;
    newEaseFactor = easeFactor + 0.1;
  } else {
    newReviewCount = 0;
    newInterval = 1;
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    reviewCount: newReviewCount,
    nextReviewDate: nextReviewDate.toISOString(),
  };
};

export const useWordStore = create<WordState>((set, get) => ({
  savedWords: [],
  failedWords: [],
  loading: false,

  handleFailedWord: (userId: string, word: Word) => {
    const { failedWords } = get();
    const existing = failedWords.find((fw) => fw.word.id === word.id);
    if (existing) {
      set({
        failedWords: failedWords.map((fw) =>
          fw.word.id === word.id
            ? { ...fw, failedCount: fw.failedCount + 1, lastFailed: new Date().toISOString() }
            : fw
        ),
      });
    } else {
      set({
        failedWords: [
          ...failedWords,
          { word, failedCount: 1, lastFailed: new Date().toISOString() },
        ],
      });
    }
  },

  updateWordReviewStatus: async (
    userId: string,
    wordId: string,
    isCorrect: boolean,
  ) => {
    const { savedWords } = get();
    const word = savedWords.find((w) => w.wordId === wordId);
    if (!word) return;

    const { easeFactor, interval, reviewCount, nextReviewDate } =
      calculateNextReview(
        word.easeFactor,
        word.interval,
        word.reviewCount,
        isCorrect,
      );

    const updates = { easeFactor, interval, reviewCount, nextReviewDate };

    set({
      savedWords: savedWords.map((w) =>
        w.wordId === wordId ? { ...w, ...updates } : w,
      ),
    });

    try {
      await firestoreService.updateSavedWord(userId, wordId, updates);
    } catch (error) {
      console.error("Failed to update word review status:", error);
    }
  },

  fetchSavedWords: async (userId: string) => {
    set({ loading: true });
    try {
      const savedWords = await firestoreService.getSavedWords(userId);
      set({ savedWords, loading: false });
    } catch (error) {
      console.error("Failed to fetch saved words:", error);
      set({ loading: false });
    }
  },

  toggleSaveWord: async (userId: string, word: Word) => {
    const { savedWords } = get();
    const isSaved = savedWords.some((w) => w.wordId === word.id);

    try {
      if (isSaved) {
        await firestoreService.unsaveWord(userId, word.id);
        set({ savedWords: savedWords.filter((w) => w.wordId !== word.id) });
      } else {
        const savedWord: Omit<SavedWord, "savedAt"> = {
          wordId: word.id,
          kurdish: word.kurdish,
          translation: word.translation,
          pronunciation: word.pronunciation,
          imageUrl: word.imageUrl,
          emoji: word.emoji,
          easeFactor: 2.5,
          interval: 0,
          reviewCount: 0,
          nextReviewDate: new Date().toISOString(),
        };
        await firestoreService.saveWord(userId, savedWord);
        // We add manually for optimistic UI update, format date locally
        set({
          savedWords: [
            ...savedWords,
            { ...savedWord, savedAt: new Date().toISOString() },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to toggle save word:", error);
    }
  },

  isWordSaved: (wordId: string) => {
    return get().savedWords.some((w) => w.wordId === wordId);
  },
}));
