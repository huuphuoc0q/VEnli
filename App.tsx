import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, BookOpen, Save, X, Calendar, Copy, Check, Filter } from 'lucide-react';
import { WordEntry } from './types';
import { VocabCard } from './components/VocabCard';
import { ShortcutsGuide } from './components/ShortcutsGuide';

const WORD_TYPES = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Phrase", "Idiom", "Other"];

// Helper to get YYYY-MM-DD string in local time
const getLocalDateString = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format based on local timezone
};

const App: React.FC = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  
  // Form State
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [type, setType] = useState('Noun');
  const [example, setExample] = useState('');
  
  // View State
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const [error, setError] = useState<string | null>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage
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

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('vocab-flow-data', JSON.stringify(words));
  }, [words]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K to focus word input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        wordInputRef.current?.focus();
      }
      // ESC to clear/blur
      if (e.key === 'Escape') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
           handleClear();
           (document.activeElement as HTMLElement).blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setWord('');
    setMeaning('');
    setExample('');
    setType('Noun');
    setError(null);
  }

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

    // Check duplicates
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
    handleClear();
    
    // Switch view to today so user sees the new word
    setSelectedDate(getLocalDateString());
    
    // Refocus word input for rapid entry
    setTimeout(() => wordInputRef.current?.focus(), 50);
  };

  const handleDelete = (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
  };

  // Filter words by selected date
  const filteredWords = words.filter(w => getLocalDateString(w.timestamp) === selectedDate);

  // Copy functionality
  const handleCopyList = () => {
    if (filteredWords.length === 0) return;

    // Format: "Word - Type - Meaning; ..."
    const textToCopy = filteredWords
      .map(w => `${w.word} - ${w.type} - ${w.meaning}`)
      .join(';\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const isToday = selectedDate === getLocalDateString();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">VocabFlow</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <div className="px-2 text-slate-400">
                  <Calendar size={16} />
                </div>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-32 cursor-pointer"
                />
             </div>
             <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {words.length} total
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        
        {/* Manual Input Form */}
        <div className="max-w-3xl mx-auto mb-10">
          <form 
            onSubmit={handleAddWord}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            
            <div className="grid grid-cols-12 gap-4">
              {/* Word Input */}
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  New Word <span className="text-red-400">*</span>
                </label>
                <input
                  ref={wordInputRef}
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g. Epiphany"
                  className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800"
                  autoComplete="off"
                />
              </div>

              {/* Type Select */}
              <div className="col-span-12 sm:col-span-3">
                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer text-slate-700"
                  >
                    {WORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Meaning Input */}
              <div className="col-span-12 sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Meaning (VN) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="e.g. Sự giác ngộ"
                  className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                  autoComplete="off"
                />
              </div>

              {/* Example Input */}
              <div className="col-span-12">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Example Sentence <span className="text-slate-300 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="e.g. She had an epiphany about her career direction."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
               <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-4">
                  <span className="flex items-center"><span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">↹ Tab</span> Next</span>
                  <span className="flex items-center"><span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">↵ Enter</span> Save</span>
               </div>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 {(word || meaning || example) && (
                    <button 
                      type="button" 
                      onClick={handleClear}
                      className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      Clear
                    </button>
                 )}
                 <button
                    type="submit"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                 >
                    <Save size={18} />
                    <span>Save Word</span>
                 </button>
               </div>
            </div>

            {error && (
              <div className="absolute top-4 right-4 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 animate-pulse flex items-center">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* List Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
             <Filter size={20} className="text-indigo-600" />
             <h2>
               {isToday ? "Today's Vocabulary" : `Words from ${selectedDate}`}
             </h2>
             <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full">
               {filteredWords.length}
             </span>
          </div>

          <button
            onClick={handleCopyList}
            disabled={filteredWords.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
              copyStatus === 'copied' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copyStatus === 'copied' ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy List
              </>
            )}
          </button>
        </div>

        {/* Empty State for Date */}
        {filteredWords.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="mx-auto bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">No words found for this date</h3>
            <p className="text-slate-500 text-sm">
              {isToday 
                ? "Start typing above to add your first word today." 
                : `You didn't save any vocabulary on ${selectedDate}.`
              }
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((entry) => (
            <VocabCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      </main>

      <ShortcutsGuide />
    </div>
  );
};

export default App;
