import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocFromServer,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import {
  UserProfile,
  OperationType,
  FirestoreErrorInfo,
  SavedWord,
} from "../types";

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export const firestoreService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.uid}`;
    try {
      await setDoc(doc(db, "users", profile.uid), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>,
  ): Promise<void> {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, "users", uid), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async saveWord(
    userId: string,
    word: Omit<SavedWord, "savedAt">,
  ): Promise<void> {
    const path = `users/${userId}/savedWords/${word.wordId}`;
    try {
      await setDoc(doc(db, "users", userId, "savedWords", word.wordId), {
        ...word,
        savedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async unsaveWord(userId: string, wordId: string): Promise<void> {
    const path = `users/${userId}/savedWords/${wordId}`;
    try {
      await deleteDoc(doc(db, "users", userId, "savedWords", wordId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async updateSavedWord(
    userId: string,
    wordId: string,
    updates: Partial<SavedWord>,
  ): Promise<void> {
    const path = `users/${userId}/savedWords/${wordId}`;
    try {
      await updateDoc(doc(db, "users", userId, "savedWords", wordId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async getSavedWords(userId: string): Promise<SavedWord[]> {
    const path = `users/${userId}/savedWords`;
    try {
      const snapshot = await getDocs(
        collection(db, "users", userId, "savedWords"),
      );
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          savedAt:
            data.savedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as SavedWord;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
};
