import { create } from "zustand";
import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserProfile } from "../types";
import { firestoreService } from "../services/firestoreService";

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  updateLessonProgress: (
    lessonId: string,
    status: "started" | "in-progress" | "completed",
    progress: number,
  ) => Promise<void>;
  deductHeart: () => Promise<boolean>;
  refreshHearts: () => Promise<void>;
  checkDailyStats: (profile: UserProfile) => Promise<UserProfile>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  checkDailyStats: async (profile: UserProfile) => {
    const now = new Date();
    const lastActive = new Date(profile.lastActive || now);

    // Reset to start of day for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActiveDay = new Date(
      lastActive.getFullYear(),
      lastActive.getMonth(),
      lastActive.getDate(),
    );

    const diffTime = Math.abs(today.getTime() - lastActiveDay.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = profile.streak;

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 0;
    } // If diffDays === 0, streak stays the same

    // Check hearts refresh (refills completely every 24 hours, or +1 every 4 hours? Let's just refill completely for now if it's a new day)
    let newHearts = profile.hearts ?? 5;
    if (diffDays >= 1) {
      newHearts = 5;
    }

    const updates: Partial<UserProfile> = {
      streak: newStreak,
      lastActive: now.toISOString(),
      hearts: newHearts,
    };

    if (diffDays > 0 || profile.hearts === undefined) {
      await firestoreService.updateUserProfile(profile.uid, updates);
      return { ...profile, ...updates };
    }

    return profile;
  },

  deductHeart: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return false;

    const currentHearts = profile.hearts ?? 5;
    if (currentHearts <= 0) return false;

    await updateProfile({
      hearts: currentHearts - 1,
      lastHeartRefresh: profile.lastHeartRefresh || new Date().toISOString(),
    });
    return true;
  },

  refreshHearts: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    await updateProfile({
      hearts: 5,
      lastHeartRefresh: new Date().toISOString(),
    });
  },

  updateLessonProgress: async (lessonId, status, progress) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    const currentProgress = profile.lessonProgress || {};
    const newProgress = {
      ...currentProgress,
      [lessonId]: {
        status,
        progress,
        lastAccessed: new Date().toISOString(),
      },
    };

    const completedLessons = [...(profile.completedLessons || [])];
    if (status === "completed" && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    await updateProfile({
      lessonProgress: newProgress,
      completedLessons,
    });
  },

  addXp: async (amount: number) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    // Lazy import to avoid circular dependency issues at the module level
    const { useXPAnimationStore } = await import("./useXPAnimationStore");

    const oldXp = profile.xp || 0;
    const oldLevel = profile.level || 1;
    const newXp = oldXp + amount;

    // Level formula: level = floor(sqrt(newXp / 50)) + 1
    const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;

    const hasLeveledUp = newLevel > oldLevel;

    useXPAnimationStore
      .getState()
      .showXPAnimation(amount, hasLeveledUp ? newLevel : null);

    await updateProfile({ xp: newXp, level: newLevel });
  },

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profile = await firestoreService.getUserProfile(user.uid);
        if (profile) {
          profile = await get().checkDailyStats(profile);
        }
        set({ user, profile, loading: false, initialized: true });
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let profile = await firestoreService.getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          username: user.displayName || "Learner",
          email: user.email || "",
          photoURL: user.photoURL || "",
          xp: 0,
          streak: 0,
          level: 1,
          hearts: 5,
          selectedDialect: "Sorani",
          learningLanguage: "English",
          lastActive: new Date().toISOString(),
          lastHeartRefresh: new Date().toISOString(),
          completedLessons: [],
          lessonProgress: {},
        };
        await firestoreService.createUserProfile(profile);
      }

      set({ user, profile, loading: false });
    } catch (error) {
      console.error("Login failed:", error);
      set({ loading: false });
    }
  },

  signInWithEmail: async (email, password, isSignUp) => {
    set({ loading: true });
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user = result.user;
      let profile = await firestoreService.getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          username: user.email?.split("@")[0] || "Learner",
          email: user.email || "",
          photoURL: "",
          xp: 0,
          streak: 0,
          level: 1,
          hearts: 5,
          selectedDialect: "Sorani",
          learningLanguage: "English",
          lastActive: new Date().toISOString(),
          lastHeartRefresh: new Date().toISOString(),
          completedLessons: [],
          lessonProgress: {},
        };
        await firestoreService.createUserProfile(profile);
      }

      set({ user, profile, loading: false });
    } catch (error: any) {
      console.error("Email auth failed:", error);
      set({ loading: false });
      throw error;
    }
  },

  signInAsGuest: async () => {
    set({ loading: true });
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;

      let profile = await firestoreService.getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          username: "ضيف",
          email: "",
          photoURL: "",
          xp: 0,
          streak: 0,
          level: 1,
          hearts: 5,
          selectedDialect: "Sorani",
          learningLanguage: "English",
          lastActive: new Date().toISOString(),
          lastHeartRefresh: new Date().toISOString(),
          completedLessons: [],
          lessonProgress: {},
        };
        await firestoreService.createUserProfile(profile);
      }

      set({ user, profile, loading: false });
    } catch (error) {
      console.error("Guest login failed:", error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    // Optimistic update
    set({ profile: { ...profile, ...updates } });

    try {
      await firestoreService.updateUserProfile(user.uid, updates);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Revert if needed (in a highly robust system) but for now just catch it
    }
  },
}));
