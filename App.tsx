// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Save, X, Calendar, Copy, Check, Filter, Upload, Download, Sparkles } from 'lucide-react';
import { WordEntry, FlashcardEntry, StoryEntry, FillBlankEntry, StudyMode } from './types';
import { VocabCard } from './components/VocabCard';
import { ShortcutsGuide } from './components/ShortcutsGuide';
import { ImportModal } from './components/ImportModal';
import { FlashcardSetup } from './components/FlashcardSetup';
import { FlashcardPlayer } from './components/FlashcardPlayer';
import { StoryPlayer } from './components/StoryPlayer';
import { FillBlankPlayer } from './components/FillBlankPlayer';

const WORD_TYPES = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Phrase", "Idiom", "Other"];

const getLocalDateString = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('sv'); 
};

type ViewMode = 'list' | 'aiSetup' | 'flashcardPlay' | 'storyPlay' | 'fillBlankPlay';

const App: React.FC = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  
  // View Modes & Data
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [flashcardData, setFlashcardData] = useState<FlashcardEntry[]>([]);
  const [storyData, setStoryData] = useState<StoryEntry | null>(null);
  const [fillBlankData, setFillBlankData] = useState<FillBlankEntry[]>([]);
  
  // Form State
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [type, setType] = useState('Noun');
  const [example, setExample] = useState('');
  
  // View & Search State
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vocab-flow-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map((item: any) => ({
          ...item,
          meaning: item.meaning || item.meaningVN || '',
        }));
        setWords(migrated);
      } catch (e) {
        console.error("Failed to parse saved words");
      }
    }
  }, []);
// Thêm state để quản lý Streak ở đầu Component App
const [streak, setStreak] = useState<number>(0);

// Logic kiểm tra và cập nhật Streak
useEffect(() => {
  const savedStreak = localStorage.getItem('vocab-flow-streak');
  const lastDate = localStorage.getItem('vocab-flow-last-date');
  const today = getLocalDateString();

  if (savedStreak && lastDate) {
    const s = parseInt(savedStreak);
    if (lastDate === today) {
      setStreak(s); // Đã học hôm nay, giữ nguyên streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday.getTime());

      if (lastDate === yesterdayStr) {
        // Nếu ngày cuối cùng học là hôm qua, streak vẫn được giữ
        setStreak(s);
      } else {
        // Quá 1 ngày không học -> Reset streak về 0
        setStreak(0);
        localStorage.setItem('vocab-flow-streak', '0');
      }
    }
  }
}, []);

// Hàm để gọi mỗi khi bạn "Save Word" hoặc hoàn thành 1 bài học
const updateStreak = () => {
  const today = getLocalDateString();
  const lastDate = localStorage.getItem('vocab-flow-last-date');
  
  if (lastDate !== today) {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('vocab-flow-streak', newStreak.toString());
    localStorage.setItem('vocab-flow-last-date', today);
  }
};
  useEffect(() => {
    localStorage.setItem('vocab-flow-data', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'list') return; 

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        wordInputRef.current?.focus();
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

  const handleClear = () => {
    setWord('');
    setMeaning('');
    setExample('');
    setType('Noun');
    setError(null);
  }

  const handleExport = () => {
    if (words.length === 0) {
      alert("No words to export!");
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

  const handleBulkImport = (newEntries: WordEntry[]) => {
    const sanitizedEntries = newEntries.map(entry => ({
      ...entry,
      id: entry.id || crypto.randomUUID(),
      timestamp: entry.timestamp || Date.now()
    }));

    const uniqueEntries = sanitizedEntries.filter(
        newW => !words.some(existW => existW.word.toLowerCase() === newW.word.toLowerCase())
    );

    if (uniqueEntries.length < sanitizedEntries.length) {
        alert(`Skipped ${sanitizedEntries.length - uniqueEntries.length} duplicates.`);
    }

    setWords(prev => [...uniqueEntries, ...prev]);
    
    if (uniqueEntries.length > 0) {
        setSelectedDate(getLocalDateString(uniqueEntries[0].timestamp));
    }
  };

  const handleAddWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawWord = word.trim();
    const rawMeaning = meaning.trim();

    if (!rawWord) {
      setError("Please enter a word.");
      wordInputRef.current?.focus();
      return;
    }
    if (!rawMeaning) {
      setError("Please enter the meaning.");
      return;
    }
    if (words.some(w => w.word.toLowerCase() === rawWord.toLowerCase())) {
      setError("This word is already in your list!");
      return;
    }

    const newEntry: WordEntry = {
      id: crypto.randomUUID(),
      word: rawWord,
      type: type,
      meaning: rawMeaning,
      example: example.trim(),
      timestamp: Date.now(),
    };

    setWords(prev => [newEntry, ...prev]);
    updateStreak();
    handleClear();
    setSelectedDate(getLocalDateString());
    setSearchTerm(''); 
    setTimeout(() => wordInputRef.current?.focus(), 50);
  };

  const handleDelete = (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
  };

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

  const isToday = selectedDate === getLocalDateString();
  const isSearching = searchTerm.length > 0;

  return (
    
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleBulkImport} 
      />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('list')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">VocabFlow</h1>
          </div> */}
          {/* Tìm khoảng dòng 268 trong App.tsx và thay thế khối div này */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('list')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">VocabFlow</h1>
            
            {/* Phần Streak mới thêm vào ngay sau tiêu đề VocabFlow */}
            <div className="ml-4 flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100 shadow-sm">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-sm">{streak} ngày</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             {viewMode === 'list' && (
                <button 
                  onClick={() => setViewMode('aiSetup')}
                  disabled={filteredWords.length === 0}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold shadow-md transition-all ${
                    filteredWords.length === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  <Sparkles size={16} fill="currentColor" />
                  <span className="hidden sm:inline">Học AI Mode</span>
                </button>
             )}

             {viewMode === 'list' && (
                <>
                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-sm font-medium transition-all" title="Export">
                        <Download size={16} />
                    </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-sm font-medium transition-all" title="Import">
                        <Upload size={16} />
                    </button>
                  </div>
                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                  <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <div className="px-2 text-slate-400">
                        <Calendar size={16} />
                      </div>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setSearchTerm(''); }}
                        className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-32 cursor-pointer"
                      />
                  </div>
                </>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        
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
           />
        )}

        {viewMode === 'storyPlay' && storyData && (
           <StoryPlayer story={storyData} onExit={() => setViewMode('list')} />
        )}

        {viewMode === 'fillBlankPlay' && (
           <FillBlankPlayer questions={fillBlankData} onExit={() => setViewMode('list')} />
        )}

        {viewMode === 'list' && (
          <>
            <div className="max-w-3xl mx-auto mb-10">
              <form onSubmit={handleAddWord} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">New Word <span className="text-red-400">*</span></label>
                    <input ref={wordInputRef} type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. Epiphany" className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800" autoComplete="off" />
                  </div>
                  <div className="col-span-12 sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                    <div className="relative">
                      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer text-slate-700">
                        {WORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Meaning (VN) <span className="text-red-400">*</span></label>
                    <input type="text" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="e.g. Sự giác ngộ" className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-800" autoComplete="off" />
                  </div>
                  <div className="col-span-12">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Example Sentence <span className="text-slate-300 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <input type="text" value={example} onChange={(e) => setExample(e.target.value)} placeholder="e.g. She had an epiphany about her career direction." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700" autoComplete="off" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-4">
                      <span className="flex items-center"><span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">↹ Tab</span> Next</span>
                      <span className="flex items-center"><span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">↵ Enter</span> Save</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {(word || meaning || example) && (
                        <button type="button" onClick={handleClear} className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">Clear</button>
                    )}
                    <button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
                        <Save size={18} /><span>Save Word</span>
                    </button>
                  </div>
                </div>
                {error && <div className="absolute top-4 right-4 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 animate-pulse flex items-center">{error}</div>}
              </form>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg whitespace-nowrap">
                {isSearching ? <Search size={20} className="text-indigo-600" /> : <Filter size={20} className="text-indigo-600" />}
                <h2>{isSearching ? "Search Results" : (isToday ? "Today's Vocabulary" : `Words from ${selectedDate}`)}</h2>
                <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full">{filteredWords.length}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input type="text" placeholder="Search stored words..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
                    {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"><X size={14} /></button>}
                </div>
                <button onClick={handleCopyList} disabled={filteredWords.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm flex-shrink-0 ${copyStatus === 'copied' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {copyStatus === 'copied' ? <><Check size={16} /><span className="hidden sm:inline">Copied!</span></> : <><Copy size={16} /><span className="hidden sm:inline">Copy List</span></>}
                </button>
              </div>
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                {isSearching ? (
                  <>
                    <div className="mx-auto bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4"><Search size={28} className="text-slate-400" /></div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">No matches found</h3>
                    <p className="text-slate-500 text-sm">We couldn't find any word matching "{searchTerm}".</p>
                    <button onClick={() => setSearchTerm('')} className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Clear search</button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4"><Calendar size={28} className="text-slate-400" /></div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">No words found for this date</h3>
                    <p className="text-slate-500 text-sm">{isToday ? "Start typing or use Import to add words." : `You didn't save any vocabulary on ${selectedDate}.`}</p>
                    <button onClick={() => setIsImportModalOpen(true)} className="mt-4 inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"><Upload size={16} /> Import from text</button>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((entry) => (
                <VocabCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </main>

      {viewMode === 'list' && <ShortcutsGuide />}
    </div>
    
  );
};

export default App;