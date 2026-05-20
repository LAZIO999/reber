export interface Word {
  id: string;
  kurdish: string;
  translation: string;
  pronunciation: string;
  category: string;
  imageUrl?: string;
  emoji?: string;
  difficulty?: string;
}

export type Dialect = "Sorani";
export type Language = string;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryTitle?: string;
  order: number;
  xpReward: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  photoURL?: string;
  role?: "user" | "admin";
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  learningLanguage: string;
  nativeLanguage?: string;
  selectedDialect?: string;
  completedLessons: string[];
  hearts?: number;
  lastHeartRefresh?: string;
  lessonProgress?: Record<
    string,
    {
      progress: number;
      lastAccessed: string;
      status: "started" | "in-progress" | "completed";
      stars?: number;
    }
  >;
  achievements?: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "quiz" | "correction";
  metadata?: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  startedAt: string;
  updatedAt: string;
}

export interface SavedWord {
  wordId: string;
  kurdish: string;
  translation: string;
  pronunciation: string;
  imageUrl?: string;
  emoji?: string;
  savedAt: string;
  easeFactor: number;
  interval: number;
  reviewCount: number;
  nextReviewDate: string;
}

export interface FailedWord {
  word: Word;
  failedCount: number;
  lastFailed: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  translation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}
