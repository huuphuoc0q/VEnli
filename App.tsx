// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Save, X, Calendar, Copy, Check, Filter,
  Upload, Download, Sparkles, Loader2, Play, BookOpen, Zap, Trophy
} from 'lucide-react';

// Hooks
import { useRouter } from './hooks/useRouter';
import { useStreak } from './hooks/useStreak';
import { useDarkMode } from './hooks/useDarkMode';
import { useVocabulary } from './hooks/useVocabulary';
import { useVSTEPState } from './hooks/useVSTEPState';

// Components
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { SRSPlayer } from './components/SRSPlayer';
import { VocabCard } from './components/VocabCard';
import { ShortcutsGuide } from './components/ShortcutsGuide';
import { ImportModal } from './components/ImportModal';
import { FlashcardSetup } from './components/FlashcardSetup';
import { FlashcardPlayer } from './components/FlashcardPlayer';
import { StoryPlayer } from './components/StoryPlayer';
import { FillBlankPlayer } from './components/FillBlankPlayer';

// VSTEP Components & Services
import { VSTEPSetup } from './components/VSTEPSetup';
import { ListeningPlayer } from './components/ListeningPlayer';
import { ReadingPlayer } from './components/ReadingPlayer';
import { WritingPlayer } from './components/WritingPlayer';
import { SpeakingPlayer } from './components/SpeakingPlayer';
import { VSTEPScoreResult } from './components/VSTEPScore';
import { calculateVSTEPScore } from './services/vstepService';
import { auth, fetchStatsFromFirebase, syncStatsToFirebase } from './services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LoginView } from './components/LoginView';
import { MatchingGame } from './components/MatchingGame';
import { addXP, getUserStats, awardXPForAction } from './services/gamificationService';
import { getDueWordsCount } from './services/srsService';

import { AppSettings, WordEntry, StudyMode } from './types';

const WORD_TYPES = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Phrase", "Idiom", "Other"];

const getLocalDateString = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('sv');
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const App: React.FC = () => {
  // 1. Cấu hình & Trạng thái Hệ thống
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { viewMode, setViewMode } = useRouter('dashboard');

  // Theo dõi tab chính gần nhất được chọn (để quay lại khi thoát SRS)
  const [lastActiveView, setLastActiveView] = useState<'dashboard' | 'list'>('dashboard');
  // Trạng thái mở rộng/thu gọn của Form Thêm từ mới (mặc định thu gọn)
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  // Trạng thái thu gọn của thanh sidebar dọc
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Gamification & Streak - scoped to the authenticated user
  const { streak, updateStreak } = useStreak(user);
  const [userXPState, setUserXPState] = useState(() => getUserStats(user?.uid));
  const [xpToast, setXpToast] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });
  const [levelUpToast, setLevelUpToast] = useState<{ level: number; visible: boolean }>({ level: 1, visible: false });

  // Auto-dismiss XP Toast after 3 seconds
  useEffect(() => {
    if (xpToast.visible) {
      const timer = setTimeout(() => {
        setXpToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [xpToast.visible]);

  // Auto-dismiss Level Up Toast after 5 seconds
  useEffect(() => {
    if (levelUpToast.visible) {
      const timer = setTimeout(() => {
        setLevelUpToast(prev => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [levelUpToast.visible]);

  // Online/Offline status
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Synchronize XP, level, and streak from Firebase on login, or upload current local values
  useEffect(() => {
    const syncStats = async () => {
      if (user) {
        // First load correct user XP/Level from localStorage
        const localStats = getUserStats(user.uid);
        setUserXPState(localStats);

        // Fetch from Firebase
        const fbStats = await fetchStatsFromFirebase(user.uid);
        if (fbStats) {
          const finalXP = Math.max(localStats.xp, fbStats.xp);
          const finalLevel = Math.max(localStats.level, fbStats.level);
          
          const keyXP = `vocab-flow-xp-${user.uid}`;
          const keyLevel = `vocab-flow-level-${user.uid}`;
          localStorage.setItem(keyXP, finalXP.toString());
          localStorage.setItem(keyLevel, finalLevel.toString());
          
          const streakKey = `vocab-flow-streak-${user.uid}`;
          const lastDateKey = `vocab-flow-last-date-${user.uid}`;
          
          const localStreak = parseInt(localStorage.getItem(streakKey) || '0', 10);
          const finalStreak = Math.max(localStreak, fbStats.streak);
          
          localStorage.setItem(streakKey, finalStreak.toString());
          if (fbStats.lastDate) {
            localStorage.setItem(lastDateKey, fbStats.lastDate);
          }
          
          setUserXPState({ xp: finalXP, level: finalLevel });
        } else {
          // Push local stats to Firebase if Firestore doesn't have them yet
          const streakKey = `vocab-flow-streak-${user.uid}`;
          const lastDateKey = `vocab-flow-last-date-${user.uid}`;
          const localStreak = parseInt(localStorage.getItem(streakKey) || '0', 10);
          const localLastDate = localStorage.getItem(lastDateKey) || '';
          
          await syncStatsToFirebase(user.uid, {
            xp: localStats.xp,
            level: localStats.level,
            streak: localStreak,
            lastDate: localLastDate
          });
        }
      } else {
        // Fallback for anonymous
        setUserXPState(getUserStats());
      }
    };
    
    syncStats();
  }, [user]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'dashboard' || viewMode === 'list') {
      setLastActiveView(viewMode);
    }
  }, [viewMode]);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('vocab-flow-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error("Lỗi parse settings", e);
      }
    }
    const legacyKey = localStorage.getItem('user-gemini-key') || '';
    return {
      geminiApiKey: legacyKey,
      firebaseEnabled: false,
      firebaseConfig: null,
      ttsRate: 1.0,
      ttsPitch: 1.0
    };
  });

  // Lưu Settings và cập nhật legacy API key cho tương thích ngược
  useEffect(() => {
    localStorage.setItem('vocab-flow-settings', JSON.stringify(settings));
    if (settings.geminiApiKey) {
      localStorage.setItem('user-gemini-key', settings.geminiApiKey);
    }
  }, [settings]);

  // 2. Custom hooks quản lý từ vựng và thi VSTEP
  const {
    words,
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
  } = useVocabulary(updateStreak, settings, user);

  const {
    vstepExam,
    setVstepExam,
    vstepListeningAnswers,
    setVstepListeningAnswers,
    vstepReadingAnswers,
    setVstepReadingAnswers,
    vstepWritingSubmissions,
    setVstepWritingSubmissions,
    vstepWritingFeedbacks,
    setVstepWritingFeedbacks,
    vstepSpeakingSubmissions,
    setVstepSpeakingSubmissions,
    finalScore,
    setFinalScore,
    resetVstepExamState
  } = useVSTEPState();

  // 3. Quản lý form nhập liệu từ vựng
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [type, setType] = useState('Noun');
  const [example, setExample] = useState('');
  const [editingWordId, setEditingWordId] = useState<string | null>(null);

  // Trạng thái tìm kiếm & date
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Học AI mode states
  const [flashcardData, setFlashcardData] = useState<any[]>([]);
  const [storyData, setStoryData] = useState<any | null>(null);
  const [fillBlankData, setFillBlankData] = useState<any[]>([]);
  const [localFlashcardData, setLocalFlashcardData] = useState<any[]>([]);

  // Đếm số từ đến hạn ôn tập SRS
  const dueSrsCount = getDueWordsCount(words);

  // Hàm thưởng điểm kinh nghiệm XP & Thông báo Level Up
  const handleAwardXP = (amount: number) => {
    const res = addXP(amount, user?.uid);
    setUserXPState({ xp: res.xp, level: res.level });
    setXpToast({ amount, visible: true }); // Show beautiful XP Toast
    if (res.didLevelUp) {
      setLevelUpToast({ level: res.level, visible: true });
    }

    // Sync to Firestore if authenticated
    if (user) {
      const streakKey = `vocab-flow-streak-${user.uid}`;
      const lastDateKey = `vocab-flow-last-date-${user.uid}`;
      const localStreak = parseInt(localStorage.getItem(streakKey) || '0', 10);
      const localLastDate = localStorage.getItem(lastDateKey) || '';
      
      syncStatsToFirebase(user.uid, {
        xp: res.xp,
        level: res.level,
        streak: localStreak,
        lastDate: localLastDate
      });
    }
  };

  const handleClear = () => {
    setWord('');
    setMeaning('');
    setExample('');
    setType('Noun');
    setError(null);
    setEditingWordId(null);
  };

  const handleStartEdit = (entry: WordEntry) => {
    setWord(entry.word);
    setMeaning(entry.meaning);
    setType(entry.type);
    setExample(entry.example || '');
    setEditingWordId(entry.id);
    setIsFormExpanded(true);
    // Cuộn mượt đến form và focus vào ô input
    setTimeout(() => {
      wordInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      wordInputRef.current?.focus();
    }, 100);
  };

  const handleAutoFill = async () => {
    const res = await autoFillWord(word);
    if (res) {
      if (res.type) setType(res.type);
      if (res.meaning) setMeaning(res.meaning);
      if (res.example) setExample(res.example);
      handleAwardXP(2); // Cộng 2 XP khi dùng AI auto-fill
    }
  };

  const handleAddWordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingWordId) {
      const success = await editWord(editingWordId, word, meaning, type, example);
      if (success) {
        handleClear();
        setSelectedDate(getLocalDateString());
        setSearchTerm('');
        alert("Đã cập nhật từ vựng thành công!");
      }
    } else {
      const success = await addWord(word, meaning, type, example);
      if (success) {
        handleClear();
        setSelectedDate(getLocalDateString());
        setSearchTerm('');
        handleAwardXP(10); // Cộng 10 XP khi thêm từ
        setTimeout(() => wordInputRef.current?.focus(), 50);
      }
    }
  };

  const handleBulkImport = async (newEntries: WordEntry[]) => {
    const imported = await bulkImport(newEntries);
    if (imported.length > 0) {
      setSelectedDate(getLocalDateString(imported[0].timestamp));
      handleAwardXP(imported.length * 5); // Thưởng 5 XP cho mỗi từ import
    }
    setIsImportModalOpen(false);
  };

  const handleExport = () => {
    if (words.length === 0) {
      alert("Không có từ vựng nào để xuất!");
      return;
    }
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vocab-flow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyList = () => {
    if (filteredWords.length === 0) return;
    const textToCopy = filteredWords
      .map(w => `${w.word} - ${w.type} - ${w.meaning}`)
      .join(';\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const handleStartAILearning = (data: any, mode: StudyMode) => {
    handleAwardXP(20); // Tặng 20 XP khi bắt đầu học AI
    if (mode === 'flashcard') {
      setFlashcardData(data);
      setViewMode('flashcardPlay');
    } else if (mode === 'story') {
      setStoryData(data);
      setViewMode('storyPlay');
    } else if (mode === 'fillblank') {
      setFillBlankData(data);
      setViewMode('fillBlankPlay');
    }
  };

  // Khởi tạo thẻ Flashcard từ kho từ vựng local cho chế độ chơi nhanh
  useEffect(() => {
    if (viewMode === 'flashcardQuick') {
      if (words.length === 0) {
        setLocalFlashcardData([]);
        return;
      }
      // Lọc ra các từ đến hạn ôn tập (nextReview <= now hoặc chưa có nextReview)
      const now = Date.now();
      let selected = words.filter(w => !w.nextReview || w.nextReview <= now);
      
      // Nếu số từ đến hạn ít hơn 15, bù thêm các từ khác (ưu tiên cấp độ srsLevel thấp và từ mới hơn)
      if (selected.length < 15) {
        const notDue = words.filter(w => w.nextReview && w.nextReview > now)
          .sort((a, b) => {
            const srsDiff = (a.srsLevel || 1) - (b.srsLevel || 1);
            if (srsDiff !== 0) return srsDiff;
            return b.timestamp - a.timestamp;
          });
        selected = [...selected, ...notDue.slice(0, 15 - selected.length)];
      }
      
      // Giới hạn tối đa 20 từ cho mỗi phiên học nhanh
      const finalSelection = selected.slice(0, 20);
      
      // Ánh xạ sang định dạng thẻ Flashcard
      const mapped = finalSelection.map(w => ({
        word: w.word,
        pronunciation: '',
        partOfSpeech: w.type,
        meaningVN: w.meaning,
        definitionEN: '',
        exampleEN: w.example || '',
        exampleVN: '',
        usageNote: 'Ôn tập nhanh từ vựng local'
      }));
      
      setLocalFlashcardData(mapped);
    }
  }, [viewMode, words]);

  // VSTEP Exam Navigation Flow
  const goToNextVstepSection = (currentSection: typeof viewMode | 'start', currentExam: any) => {
    const hasListening = currentExam?.sections?.listening?.length > 0;
    const hasReading = currentExam?.sections?.reading?.length > 0;
    const hasWriting = currentExam?.sections?.writing?.length > 0;
    const hasSpeaking = currentExam?.sections?.speaking?.length > 0;

    let nextMode: typeof viewMode = 'vstepScore';

    if (currentSection === 'start') {
      if (hasListening) nextMode = 'vstepListening';
      else if (hasReading) nextMode = 'vstepReading';
      else if (hasWriting) nextMode = 'vstepWriting';
      else if (hasSpeaking) nextMode = 'vstepSpeaking';
    }
    else if (currentSection === 'vstepListening') {
      handleAwardXP(100); // Thưởng 100 XP hoàn thành nghe
      if (hasReading) nextMode = 'vstepReading';
      else if (hasWriting) nextMode = 'vstepWriting';
      else if (hasSpeaking) nextMode = 'vstepSpeaking';
    }
    else if (currentSection === 'vstepReading') {
      handleAwardXP(100); // Thưởng 100 XP hoàn thành đọc
      if (hasWriting) nextMode = 'vstepWriting';
      else if (hasSpeaking) nextMode = 'vstepSpeaking';
    }
    else if (currentSection === 'vstepWriting') {
      handleAwardXP(150); // Thưởng 150 XP hoàn thành viết
      if (hasSpeaking) nextMode = 'vstepSpeaking';
    }
    else if (currentSection === 'vstepSpeaking') {
      handleAwardXP(150); // Thưởng 150 XP hoàn thành nói
    }

    if (nextMode === 'vstepScore') {
      const score = calculateVSTEPScore(currentExam);
      setFinalScore(score);
    }

    setViewMode(nextMode);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'list') return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsFormExpanded(true);
        setTimeout(() => wordInputRef.current?.focus(), 150);
      }
      if (e.key === 'Escape') {
        if (isImportModalOpen) {
          setIsImportModalOpen(false);
        } else if (searchTerm) {
          setSearchTerm('');
        } else if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
          handleClear();
          (document.activeElement as HTMLElement).blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, isImportModalOpen, viewMode]);

  const filteredWords = words.filter(w => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return (
        w.word.toLowerCase().includes(term) ||
        w.meaning.toLowerCase().includes(term) ||
        (w.example && w.example.toLowerCase().includes(term))
      );
    }
    return getLocalDateString(w.timestamp) === selectedDate;
  });

  const isToday = selectedDate === getLocalDateString();
  const isSearching = searchTerm.length > 0;

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-105 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30 transition-colors duration-300">

      {/* Floating Offline Toast */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
          <span>Bạn đang ngoại tuyến. Dữ liệu mới sẽ được lưu cục bộ.</span>
        </div>
      )}

      {/* Floating XP Toast */}
      {xpToast.visible && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-650 text-white px-4 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 flex items-center gap-2.5 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white/20 p-1 rounded-lg">
            <Zap size={14} fill="currentColor" className="text-amber-300 animate-bounce" />
          </div>
          <span>+{xpToast.amount} XP Nhan duoc!</span>
        </div>
      )}

      {/* Floating Level Up Toast */}
      {levelUpToast.visible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 px-6 py-4 rounded-[2rem] shadow-2xl shadow-amber-500/20 flex items-center gap-4 z-50 animate-in slide-in-from-top-12 fade-in duration-500 border border-amber-300/30">
          <div className="bg-slate-950 p-2.5 rounded-2xl text-amber-400 shadow-inner flex-shrink-0">
            <Trophy size={20} className="animate-bounce" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Level Up! 🎉</h4>
            <p className="text-xs font-bold text-slate-900 leading-tight">Chúc mừng! Bạn đã đạt Cấp {levelUpToast.level}!</p>
          </div>
          <button 
            onClick={() => setLevelUpToast(prev => ({ ...prev, visible: false }))}
            className="text-slate-900/60 hover:text-slate-950 p-1 rounded-full hover:bg-slate-900/10 transition-colors ml-2 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navigation Sidebar/Bottom Bar */}
      <Navigation
        currentView={viewMode}
        onNavigate={setViewMode}
        dueSrsCount={dueSrsCount}
        streak={streak}
        level={userXPState.level}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBulkImport}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto px-4 md:px-8 py-8 pb-28 md:pb-8 transition-all duration-300">

        {/* Render View Mode dynamically */}

        {/* 1. DASHBOARD VIEW */}
        {viewMode === 'dashboard' && (
          <Dashboard
            words={words}
            streak={streak}
            userXPState={userXPState}
            settings={settings}
            onNavigate={setViewMode}
            onSyncFirebase={syncFromFirebase}
          />
        )}

        {/* 2. SETTINGS VIEW */}
        {viewMode === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={setSettings}
          />
        )}

        {/* 3. SRS REVIEW PLAY VIEW */}
        {viewMode === 'srsPlay' && (
          <SRSPlayer
            words={words}
            onExit={(targetView) => setViewMode(targetView || lastActiveView)}
            onUpdateSRS={updateWordSRS}
            settings={settings}
            onAwardXP={handleAwardXP}
          />
        )}

        {/* 4. VOCABULARY LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-6">

            {/* Header List */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 py-3.5 px-5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Sổ Từ Vựng</h2>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Quản lý và nạp vốn từ vựng ngoại ngữ cá nhân</p>
              </div>

              {/* Sync, Import, Export, Date Picker controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-slate-700 transition-all text-xs font-bold active:scale-95"
                  title="Export JSON"
                >
                  <Download size={14} /> <span>Xuất</span>
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-slate-700 transition-all text-xs font-bold active:scale-95"
                  title="Import JSON"
                >
                  <Upload size={14} /> <span>Nhập</span>
                </button>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

                <div 
                  onClick={() => {
                    try {
                      dateInputRef.current?.showPicker();
                    } catch (e) {
                      dateInputRef.current?.click();
                    }
                  }}
                  className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/50 dark:border-slate-700 transition-colors cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <Calendar size={13} className="text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <span className="pointer-events-none">{formatDisplayDate(selectedDate)}</span>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSearchTerm(''); }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                </div>

                <button
                  onClick={() => setViewMode('aiSetup')}
                  disabled={filteredWords.length === 0}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all duration-300 active:scale-95 ${filteredWords.length === 0
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 border border-slate-200/50 dark:border-slate-700/50 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                  <Sparkles size={14} fill={filteredWords.length === 0 ? "none" : "currentColor"} />
                  <span>Học AI</span>
                </button>
              </div>
            </div>

            {/* Input Form */}
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setIsFormExpanded(!isFormExpanded)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-sm border transition-all duration-300 active:scale-95 ${isFormExpanded
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-750 text-white border-transparent shadow-indigo-500/10'
                    }`}
                >
                  <Sparkles size={14} className={isFormExpanded ? '' : 'animate-pulse'} />
                  <span>{isFormExpanded ? 'Đóng Form Nhập Liệu' : 'Thêm Từ Vựng Mới'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isFormExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>

              {isFormExpanded && (
                <div className="animate-in slide-in-from-top-3 fade-in duration-300 mb-6">
                  <form onSubmit={handleAddWordSubmit} className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-800 relative overflow-hidden transition-colors duration-300 ${editingWordId ? 'ring-2 ring-emerald-500/20' : ''}`}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300 ${editingWordId ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>

                    <div className="grid grid-cols-12 gap-4">
                      {editingWordId && (
                        <div className="col-span-12 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-2.5 rounded-2xl flex justify-between items-center mb-2 animate-in fade-in duration-200">
                          <span className="font-bold">📝 Bạn đang chỉnh sửa từ: <strong className="underline">{words.find(w => w.id === editingWordId)?.word}</strong></span>
                          <button type="button" onClick={handleClear} className="text-emerald-500 hover:text-emerald-700 font-extrabold text-[10px] uppercase">Hủy bỏ</button>
                        </div>
                      )}

                      {/* Word Input */}
                      <div className="col-span-12 sm:col-span-5">
                        <div className="flex items-center justify-between mb-1 ml-1">
                          <label className="block text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                            Từ mới <span className="text-red-400">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleAutoFill}
                            disabled={!word.trim() || isGenerating}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-2 py-0.5 rounded-md transition-colors disabled:opacity-50"
                          >
                            {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                            {isGenerating ? "Đang tra..." : "Auto-fill AI"}
                          </button>
                        </div>
                        <input ref={wordInputRef} type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. Efficiency" className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium text-slate-750 dark:text-slate-200" autoComplete="off" />
                      </div>

                      {/* Type */}
                      <div className="col-span-12 sm:col-span-3">
                        <label className="block text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Loại từ</label>
                        <div className="relative">
                          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                            {WORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></div>
                        </div>
                      </div>

                      {/* Meaning */}
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Nghĩa tiếng Việt <span className="text-red-400">*</span></label>
                        <input type="text" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="e.g. Hiệu suất, năng lực" className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-750 dark:text-slate-200 font-medium" autoComplete="off" />
                      </div>

                      {/* Example */}
                      <div className="col-span-12">
                        <label className="block text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Ví dụ minh họa <span className="text-slate-300 dark:text-slate-600 font-normal">(Không bắt buộc)</span></label>
                        <input type="text" value={example} onChange={(e) => setExample(e.target.value)} placeholder="e.g. The new system will improve our working efficiency." className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-700 dark:text-slate-300 font-medium" autoComplete="off" />
                      </div>

                    </div>

                    {/* Form Footer */}
                    <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-850">
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest hidden sm:flex items-center gap-4">
                        <span><kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">↹ Tab</kbd> Chuyển ô</span>
                        <span><kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">↵ Enter</kbd> Lưu từ</span>
                      </div>
                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {editingWordId ? (
                          <>
                            <button type="button" onClick={handleClear} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold">Hủy bỏ</button>
                            <button type="submit" className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 text-xs">
                              Cập nhật
                            </button>
                          </>
                        ) : (
                          <>
                            {(word || meaning || example) && (
                              <button type="button" onClick={handleClear} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold">Làm trống</button>
                            )}
                            <button type="submit" className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 text-xs">
                              Lưu Từ Vựng
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {error && <div className="absolute top-4 right-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-900/30 animate-pulse">{error}</div>}
                  </form>
                </div>
              )}
            </div>

            {/* Search Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-extrabold text-lg">
                <Filter size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h2>{isSearching ? "Kết quả tìm kiếm" : (isToday ? "Từ vựng hôm nay" : `Từ vựng ngày ${selectedDate}`)}</h2>
                <span className="ml-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-bold">{filteredWords.length}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" placeholder="Tìm kiếm từ vựng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-60 pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold" />
                  {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
                </div>
                <button onClick={handleCopyList} disabled={filteredWords.length === 0} className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-bold text-xs transition-all shadow-sm ${copyStatus === 'copied' ? 'bg-green-50 dark:bg-green-950/20 text-green-700 border-green-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}`}>
                  {copyStatus === 'copied' ? "Đã sao chép!" : "Copy danh sách"}
                </button>
              </div>
            </div>

            {/* Empty view */}
            {filteredWords.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="mx-auto bg-slate-50 dark:bg-slate-950/40 w-14 h-14 rounded-full flex items-center justify-center mb-4"><Calendar size={24} className="text-slate-450" /></div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Không tìm thấy từ vựng nào</h3>
                <p className="text-slate-450 dark:text-slate-500 text-xs font-semibold">{isSearching ? `Chúng tôi không tìm thấy kết quả nào khớp với "${searchTerm}".` : "Hãy bắt đầu thêm từ mới ngay hôm nay!"}</p>
              </div>
            )}

            {/* Grid list words */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((entry) => (
                <VocabCard
                  key={entry.id}
                  entry={entry}
                  onDelete={deleteWord}
                  onEdit={handleStartEdit}
                  settings={settings}
                  onAwardXP={handleAwardXP}
                />
              ))}
            </div>

          </div>
        )}

        {/* 5. AI PRACTICE VIEW PANELS */}
        {viewMode === 'aiSetup' && (
          <FlashcardSetup
            wordsToLearn={filteredWords}
            onBack={() => setViewMode('list')}
            onStartPlay={handleStartAILearning}
          />
        )}

        {viewMode === 'flashcardPlay' && (
          <FlashcardPlayer
            cards={flashcardData}
            onExit={() => setViewMode('list')}
            settings={settings}
            onAwardXP={handleAwardXP}
            onUpdateSRS={updateWordSRS}
            originalWords={words}
          />
        )}

        {viewMode === 'flashcardQuick' && (
          <FlashcardPlayer
            cards={localFlashcardData}
            onExit={() => setViewMode('list')}
            settings={settings}
            onAwardXP={handleAwardXP}
            onUpdateSRS={updateWordSRS}
            originalWords={words}
          />
        )}

        {viewMode === 'storyPlay' && storyData && (
          <StoryPlayer story={storyData} onExit={() => setViewMode('list')} />
        )}

        {viewMode === 'fillBlankPlay' && (
          <FillBlankPlayer questions={fillBlankData} onExit={() => setViewMode('list')} />
        )}

        {viewMode === 'matchingPlay' && (
          <MatchingGame
            words={words}
            onExit={() => setViewMode(lastActiveView)}
            onAwardXP={handleAwardXP}
            settings={settings}
          />
        )}

        {/* 6. VSTEP TEST PANELS */}
        {viewMode === 'vstepSetup' && (
          <VSTEPSetup
            onBack={() => { resetVstepExamState(); setViewMode('dashboard'); }}
            onStartExam={(exam) => { setVstepExam(exam); goToNextVstepSection('start', exam); }}
          />
        )}

        {viewMode === 'vstepListening' && vstepExam && (
          <ListeningPlayer
            exam={vstepExam}
            settings={settings}
            onComplete={(answers) => {
              setVstepListeningAnswers(answers);
              const updatedExam = { ...vstepExam, answers: { ...vstepExam.answers, listening: answers } };
              setVstepExam(updatedExam);
              goToNextVstepSection('vstepListening', updatedExam);
            }}
            onExit={() => { resetVstepExamState(); setViewMode('dashboard'); }}
          />
        )}

        {viewMode === 'vstepReading' && vstepExam && (
          <ReadingPlayer
            exam={vstepExam}
            onComplete={(answers) => {
              setVstepReadingAnswers(answers);
              const updatedExam = { ...vstepExam, answers: { ...vstepExam.answers, reading: answers } };
              setVstepExam(updatedExam);
              goToNextVstepSection('vstepReading', updatedExam);
            }}
            onExit={() => { resetVstepExamState(); setViewMode('dashboard'); }}
          />
        )}

        {viewMode === 'vstepWriting' && vstepExam && (
          <WritingPlayer
            exam={vstepExam}
            onComplete={(submissions, feedbacks) => {
              setVstepWritingSubmissions(submissions);
              setVstepWritingFeedbacks(feedbacks);
              const updatedExam = { ...vstepExam, writingSubmissions: submissions };
              setVstepExam(updatedExam);
              goToNextVstepSection('vstepWriting', updatedExam);
            }}
            onExit={() => { resetVstepExamState(); setViewMode('dashboard'); }}
          />
        )}

        {viewMode === 'vstepSpeaking' && vstepExam && (
          <SpeakingPlayer
            exam={vstepExam}
            onComplete={(submissions) => {
              setVstepSpeakingSubmissions(submissions);
              const updatedExam = { ...vstepExam, speakingSubmissions: submissions };
              setVstepExam(updatedExam);
              goToNextVstepSection('vstepSpeaking', updatedExam);
            }}
            onExit={() => { resetVstepExamState(); setViewMode('dashboard'); }}
          />
        )}

        {viewMode === 'vstepScore' && vstepExam && finalScore && (
          <VSTEPScoreResult
            exam={vstepExam}
            score={finalScore}
            onRetake={() => {
              resetVstepExamState();
              setViewMode('vstepSetup');
            }}
            onExit={() => {
              resetVstepExamState();
              setViewMode('dashboard');
            }}
          />
        )}

      </main>

      {viewMode === 'list' && <ShortcutsGuide />}

    </div>
  );
};

export default App;