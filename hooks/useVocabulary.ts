import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { WordEntry, AppSettings } from '../types';
import { generateWordDetails } from '../services/aiService';
import { syncWordToFirebase, deleteWordFromFirebase, fetchWordsFromFirebase } from '../services/firebaseService';

const getLocalDateString = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('sv'); 
};

export const useVocabulary = (
  updateStreak: () => void,
  settings: AppSettings,
  user: User | null
) => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = user ? `vocab-flow-data-${user.uid}` : 'vocab-flow-data-anonymous';

  // 3. Tải từ Firebase Firestore cho user hiện tại
  const syncFromFirebase = async () => {
    if (!user) return;
    try {
      const fbWords = await fetchWordsFromFirebase(user.uid);
      if (fbWords.length > 0) {
        setWords((prev) => {
          // Gộp từ vựng từ Firebase và local (ưu tiên Firebase nếu trùng ID)
          const merged = [...prev];
          fbWords.forEach((fbW) => {
            const index = merged.findIndex((w) => w.id === fbW.id);
            if (index !== -1) {
              merged[index] = fbW;
            } else {
              merged.push(fbW);
            }
          });
          // Sắp xếp theo timestamp giảm dần
          return merged.sort((a, b) => b.timestamp - a.timestamp);
        });
        console.log("Synced data from Firebase successfully!");
      }
    } catch (err) {
      console.error("Error syncing from Firebase:", err);
    }
  };

  // 1. Đồng bộ và chuyển đổi dữ liệu khi user thay đổi (đăng nhập/đăng xuất/đổi tài khoản)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map((item: any) => ({
          ...item,
          meaning: item.meaning || item.meaningVN || '',
          srsLevel: item.srsLevel ?? 1,
          nextReview: item.nextReview ?? Date.now(),
          srsInterval: item.srsInterval ?? 0,
        }));
        setWords(migrated);
      } catch (e) {
        console.error("Failed to parse saved words");
        setWords([]);
      }
    } else {
      setWords([]);
    }

    if (user) {
      syncFromFirebase();
    }
  }, [user, storageKey]);

  // 2. Tự động lưu dữ liệu vào localStorage tương ứng với user hiện tại
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(words));
  }, [words, storageKey]);

  // 4. Thêm từ vựng mới
  const addWord = async (wordText: string, meaningText: string, typeText: string, exampleText: string): Promise<boolean> => {
    const rawWord = wordText.trim();
    const rawMeaning = meaningText.trim();

    if (!rawWord) {
      setError("Vui lòng nhập từ vựng.");
      return false;
    }
    if (!rawMeaning) {
      setError("Vui lòng nhập nghĩa của từ.");
      return false;
    }
    if (words.some(w => w.word.toLowerCase() === rawWord.toLowerCase())) {
      setError("Từ này đã tồn tại trong danh sách của bạn!");
      return false;
    }

    const newEntry: WordEntry = {
      id: crypto.randomUUID(),
      word: rawWord,
      type: typeText,
      meaning: rawMeaning,
      example: exampleText.trim(),
      timestamp: Date.now(),
      // Mặc định SRS ban đầu
      srsLevel: 1,
      nextReview: Date.now(),
      srsInterval: 0,
    };

    const updatedWords = [newEntry, ...words];
    setWords(updatedWords);
    
    // Đồng bộ lên Firebase
    if (user) {
      await syncWordToFirebase(newEntry, user.uid);
    }

    updateStreak();
    setError(null);
    return true;
  };

  // 5. Xóa từ vựng
  const deleteWord = async (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
    if (user) {
      await deleteWordFromFirebase(id, user.uid);
    }
  };

  // 6. Import hàng loạt
  const bulkImport = async (newEntries: WordEntry[]) => {
    const sanitizedEntries = newEntries.map(entry => {
      const originalTimestamp = entry.timestamp ? Number(entry.timestamp) : Date.now();
      return {
        ...entry,
        id: entry.id || crypto.randomUUID(),
        timestamp: originalTimestamp,
        srsLevel: entry.srsLevel ?? 1,
        nextReview: entry.nextReview ?? Date.now(),
        srsInterval: entry.srsInterval ?? 0,
      };
    });

    const uniqueEntries = sanitizedEntries.filter(
      newW => !words.some(existW => existW.word.toLowerCase() === newW.word.toLowerCase())
    );

    if (uniqueEntries.length < sanitizedEntries.length) {
      alert(`Đã bỏ qua ${sanitizedEntries.length - uniqueEntries.length} từ bị trùng lặp.`);
    }

    const updatedWords = [...uniqueEntries, ...words];
    setWords(updatedWords);

    // Đồng bộ tất cả từ mới lên Firebase
    if (user && uniqueEntries.length > 0) {
      for (const entry of uniqueEntries) {
        await syncWordToFirebase(entry, user.uid);
      }
    }

    return uniqueEntries;
  };

  // 7. Auto fill bằng AI
  const autoFillWord = async (wordText: string): Promise<{ type: string; meaning: string; example: string } | null> => {
    const rawWord = wordText.trim();
    if (!rawWord) {
      setError("Vui lòng nhập từ tiếng Anh trước khi dùng AI Auto-fill!");
      return null;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateWordDetails(rawWord);
      return data;
    } catch (err: any) {
      setError(err.message || "Lỗi tự động điền từ vựng bằng AI.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // 8. Cập nhật SRS cho một từ cụ thể (dùng cho SRS Player)
  const updateWordSRS = async (wordId: string, srsLevel: number, nextReview: number, srsInterval: number, difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    setWords(prev => {
      const updated = prev.map(w => {
        if (w.id === wordId) {
          const updatedWord = {
            ...w,
            srsLevel,
            nextReview,
            srsInterval,
            lastDifficulty: difficulty
          };
          // Đồng bộ Firebase
          if (user) {
            syncWordToFirebase(updatedWord, user.uid);
          }
          return updatedWord;
        }
        return w;
      });
      return updated;
    });
  };

  // 9. Cập nhật/Sửa từ vựng đã có
  const editWord = async (id: string, wordText: string, meaningText: string, typeText: string, exampleText: string): Promise<boolean> => {
    const rawWord = wordText.trim();
    const rawMeaning = meaningText.trim();

    if (!rawWord) {
      setError("Vui lòng nhập từ vựng.");
      return false;
    }
    if (!rawMeaning) {
      setError("Vui lòng nhập nghĩa của từ.");
      return false;
    }

    // Kiểm tra xem từ mới sửa có trùng với từ khác không (ngoại trừ chính nó)
    if (words.some(w => w.id !== id && w.word.toLowerCase() === rawWord.toLowerCase())) {
      setError("Từ này đã tồn tại trong danh sách của bạn!");
      return false;
    }

    setWords(prev => 
      prev.map(w => {
        if (w.id === id) {
          const updatedWord = {
            ...w,
            word: rawWord,
            type: typeText,
            meaning: rawMeaning,
            example: exampleText.trim()
          };
          // Đồng bộ lên Firebase
          if (user) {
            syncWordToFirebase(updatedWord, user.uid);
          }
          return updatedWord;
        }
        return w;
      })
    );

    setError(null);
    return true;
  };

  return {
    words,
    setWords,
    addWord,
    editWord,
    deleteWord,
    bulkImport,
    autoFillWord,
    updateWordSRS,
    isGenerating,
    error,
    setError,
    syncFromFirebase
  };
};
