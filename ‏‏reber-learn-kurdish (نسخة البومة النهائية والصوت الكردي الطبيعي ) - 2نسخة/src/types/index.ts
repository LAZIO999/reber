export type Dialect = "Sorani";
export type Language = "English" | "Arabic";

export interface LessonProgress {
  status: "started" | "in-progress" | "completed";
  lastAccessed: string;
  progress: number;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  photoURL?: string;
  xp: number;
  streak: number;
  level: number;
  hearts?: number;
  lastHeartRefresh?: string;
  selectedDialect: Dialect;
  learningLanguage: Language;
  lastActive: string;
  completedLessons: string[];
  lessonProgress?: Record<string, LessonProgress>;
}

export interface Word {
  id: string;
  kurdish: string;
  translation: string;
  pronunciation: string;
  imageUrl?: string;
  emoji?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface SavedWord {
  wordId: string;
  kurdish: string;
  translation: string;
  pronunciation?: string;
  imageUrl?: string;
  emoji?: string;
  savedAt: string;
  nextReviewDate?: string;
  interval?: number;
  easeFactor?: number;
  reviewCount?: number;
}

export interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
}

export interface Category {
  id: string;
  title: string;
  icon?: string;
  description: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  translation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  imageUrl?: string;
  audioUrl?: string;
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
