import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, deleteDoc, getDocs, getDoc, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { WordEntry } from '../types';

// Cấu hình Firebase tĩnh
const firebaseConfig = {
  apiKey: "AIzaSyD9aEmfBnpqxPBkjJGmGT9llMtiZEJV_Ds",
  authDomain: "vocab-enlish.firebaseapp.com",
  projectId: "vocab-enlish",
  storageBucket: "vocab-enlish.firebasestorage.app",
  messagingSenderId: "82307639723",
  appId: "1:82307639723:web:ac404ba32ca913cccc8aee",
  measurementId: "G-MLHHDHK61W"
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const dbInstance = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Lỗi khi đăng nhập Google:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Lỗi khi đăng nhập Email:", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error("Lỗi khi đăng ký Email:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    throw error;
  }
};

export const syncStatsToFirebase = async (userId: string, stats: { xp: number; level: number; streak: number; lastDate?: string }) => {
  try {
    const docRef = doc(dbInstance, 'users', userId);
    await setDoc(docRef, stats, { merge: true });
  } catch (e) {
    console.error("Failed to sync stats to Firebase:", e);
  }
};

export const fetchStatsFromFirebase = async (userId: string): Promise<{ xp: number; level: number; streak: number; lastDate: string } | null> => {
  try {
    const docRef = doc(dbInstance, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        lastDate: data.lastDate || ''
      };
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch stats from Firebase:", e);
    return null;
  }
};

// Cung cấp các hàm cũ để không bị vỡ logic ở các chỗ khác
export const initFirebase = (config: any) => dbInstance;
export const getFirebaseDb = () => dbInstance;

// Helper để lấy User ID hiện tại, nếu chưa đăng nhập dùng ID ẩn danh
const getCurrentUserId = () => {
  return auth.currentUser?.uid || 'vocab_flow_default_user';
};

export const syncWordToFirebase = async (word: WordEntry, userId?: string) => {
  try {
    const uid = userId && userId !== 'vocab_flow_default_user' ? userId : getCurrentUserId();
    const docRef = doc(dbInstance, 'users', uid, 'words', word.id);
    await setDoc(docRef, {
      ...word,
      srsLevel: word.srsLevel ?? 1,
      nextReview: word.nextReview ?? Date.now(),
      srsInterval: word.srsInterval ?? 0,
      lastDifficulty: word.lastDifficulty ?? 'good'
    });
  } catch (e) {
    console.error("Failed to sync word to Firebase:", e);
  }
};

export const deleteWordFromFirebase = async (wordId: string, userId?: string) => {
  try {
    const uid = userId && userId !== 'vocab_flow_default_user' ? userId : getCurrentUserId();
    const docRef = doc(dbInstance, 'users', uid, 'words', wordId);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Failed to delete word from Firebase:", e);
  }
};

export const fetchWordsFromFirebase = async (userId?: string): Promise<WordEntry[]> => {
  try {
    const uid = userId && userId !== 'vocab_flow_default_user' ? userId : getCurrentUserId();
    const colRef = collection(dbInstance, 'users', uid, 'words');
    const querySnapshot = await getDocs(colRef);
    const words: WordEntry[] = [];
    querySnapshot.forEach((doc) => {
      words.push(doc.data() as WordEntry);
    });
    return words;
  } catch (e) {
    console.error("Failed to fetch words from Firebase:", e);
    return [];
  }
};
