import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, CheckCircle2, AlertCircle, Award, Zap } from 'lucide-react';
import { FlashcardEntry, WordEntry, AppSettings } from '../types';
import { speak } from '../services/ttsService';
import { calculateNextSRS } from '../services/srsService';

interface FlashcardPlayerProps {
  cards: FlashcardEntry[];
  onExit: () => void;
  settings?: AppSettings;
  onAwardXP?: (xp: number) => void;
  onUpdateSRS: (
    wordId: string,
    srsLevel: number,
    nextReview: number,
    srsInterval: number,
    difficulty: 'again' | 'hard' | 'good' | 'easy'
  ) => void;
  originalWords: WordEntry[];
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ 
  cards, 
  onExit, 
  settings,
  onAwardXP,
  onUpdateSRS,
  originalWords
}) => {
  const [sessionQueue, setSessionQueue] = useState<FlashcardEntry[]>([]);
  const [totalSessionCardsCount, setTotalSessionCardsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [challengeInput, setChallengeInput] = useState('');
  const [isChallengeSuccess, setIsChallengeSuccess] = useState<boolean | null>(null);
  const [autoPronounce, setAutoPronounce] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tự động focus vào ô nhập khi lật thẻ sang mặt sau
  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  // Khởi tạo hàng đợi session học từ props cards
  useEffect(() => {
    if (cards && cards.length > 0) {
      setSessionQueue([...cards]);
      setTotalSessionCardsCount(cards.length);
      setCompletedCount(0);
      setXpEarned(0);
      setIsFlipped(false);
      setChallengeInput('');
      setIsChallengeSuccess(null);
    }
  }, [cards]);

  const currentCard = sessionQueue.length > 0 ? sessionQueue[0] : null;

  // Tự động phát âm khi chuyển thẻ hoặc khi lật về mặt trước
  useEffect(() => {
    if (!isFlipped && currentCard?.word && autoPronounce) {
      speak(currentCard.word, {
        ttsRate: settings?.ttsRate,
        ttsPitch: settings?.ttsPitch,
        ttsVoiceName: settings?.ttsVoiceName
      });
    }
  }, [currentCard?.word, isFlipped, autoPronounce, settings]);

  // Đăng ký phím tắt: Space để lật thẻ, 1-4 để đánh giá độ nhớ (chỉ khi thẻ đang lật mặt sau)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }

      if (isFlipped && sessionQueue.length > 0) {
        if (e.key === '1') {
          handleDifficulty('again');
        } else if (e.key === '2') {
          handleDifficulty('hard');
        } else if (e.key === '3') {
          handleDifficulty('good');
        } else if (e.key === '4') {
          handleDifficulty('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, sessionQueue]);

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    // 1. Đồng bộ kết quả SRS của từ vựng vào database thông qua từ gốc originalWords
    const matchedWord = originalWords.find(
      w => w.word.trim().toLowerCase() === currentCard.word.trim().toLowerCase()
    );

    if (matchedWord) {
      const { srsLevel, srsInterval, nextReview } = calculateNextSRS(
        difficulty,
        matchedWord.srsLevel || 1,
        matchedWord.srsInterval || 0
      );
      onUpdateSRS(matchedWord.id, srsLevel, nextReview, srsInterval, difficulty);
    }

    // 2. Cộng điểm thưởng kinh nghiệm XP
    const xpReward = difficulty === 'again' ? 2 : difficulty === 'easy' ? 10 : 6;
    if (onAwardXP) onAwardXP(xpReward);
    setXpEarned(prev => prev + xpReward);

    // 3. Hiệu ứng lật về mặt trước mượt mà trước khi chuyển thẻ/cập nhật hàng đợi
    setIsFlipped(false);

    setTimeout(() => {
      setChallengeInput('');
      setIsChallengeSuccess(null);

      const updatedQueue = [...sessionQueue];
      const finishedCard = updatedQueue.shift();

      if (difficulty === 'again' && finishedCard) {
        // Đẩy xuống cuối hàng đợi để học lại
        updatedQueue.push(finishedCard);
      } else {
        // Hoàn thành thẻ này trong phiên học hiện tại
        setCompletedCount(prev => prev + 1);
      }

      setSessionQueue(updatedQueue);
    }, 200);
  };

  const playSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCard?.word) {
      speak(currentCard.word, {
        ttsRate: settings?.ttsRate,
        ttsPitch: settings?.ttsPitch,
        ttsVoiceName: settings?.ttsVoiceName
      });
      if (onAwardXP) onAwardXP(2); // Thưởng 2 XP khi nghe phát âm
    }
  };

  const checkChallenge = () => {
    if (!currentCard?.word) return;
    if (challengeInput.toLowerCase().trim() === currentCard.word.toLowerCase().trim()) {
      setIsChallengeSuccess(true);
      if (onAwardXP) onAwardXP(15); // Thưởng 15 XP khi gõ đúng từ thử thách
    } else {
      setIsChallengeSuccess(false);
    }
  };

  // 1. Giao diện khi hoàn thành buổi học
  if (sessionQueue.length === 0 && totalSessionCardsCount > 0) {
    return (
      <div className="max-w-md mx-auto mt-6 md:mt-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-150 dark:border-slate-800 relative overflow-hidden">
          {/* Confetti ambient background */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full filter blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-2xl animate-pulse" />

          <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
            <Award className="text-emerald-500 animate-bounce" size={32} />
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-1.5">Tuyệt vời! Hoàn thành!</h2>
          <p className="text-slate-550 dark:text-slate-400 mb-6 leading-relaxed font-semibold text-xs md:text-sm">Bạn đã hoàn thành phiên học Flashcard AI hôm nay một cách xuất sắc.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700">
              <span className="block text-xl font-black text-slate-800 dark:text-white">{completedCount}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Từ đã học</span>
            </div>
            <div className="bg-indigo-50/50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20">
              <span className="block text-xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                <Zap size={16} fill="currentColor" /> +{xpEarned}
              </span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Kinh nghiệm</span>
            </div>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-102 active:scale-95 text-sm"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // 2. Giao diện khi danh sách ban đầu rỗng hoặc dữ liệu bị lỗi
  if (!currentCard || !currentCard.word) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-200 dark:border-red-900/50">
        <h2 className="text-xl font-bold text-red-500 mb-3 flex items-center justify-center gap-2">
          <AlertCircle size={20} /> Không có dữ liệu thẻ học!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">JSON AI sinh ra không có trường <strong>"word"</strong> hoặc danh sách thẻ trống.</p>
        <button onClick={onExit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-1">
      {/* Progress display & Controls */}
      <div className="flex flex-col gap-2 mb-4 px-2">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {/* Toggle Auto Pronounce */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 dark:text-slate-400 select-none mr-2">
              <input 
                type="checkbox" 
                checked={autoPronounce} 
                onChange={() => setAutoPronounce(!autoPronounce)}
                className="w-3.5 h-3.5 text-indigo-600 bg-slate-100 rounded border-slate-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-650"
              />
              Tự phát âm 🔊
            </label>

            <span className="font-extrabold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full text-xs border border-amber-100/50 dark:border-amber-500/10">
              ⏳ Còn lại: {sessionQueue.length} thẻ
            </span>

            <span className="font-extrabold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full text-xs border border-indigo-100/50 dark:border-indigo-500/10">
              🎯 Tiến độ: {completedCount} / {totalSessionCardsCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300"
            style={{ width: `${totalSessionCardsCount > 0 ? (completedCount / totalSessionCardsCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div 
        className="bg-white dark:bg-slate-900 min-h-[360px] md:min-h-[420px] rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-center relative transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden group"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && !target.closest('button')) {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl group-hover:bg-indigo-500/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl group-hover:bg-purple-500/10 transition-colors" />

        {!isFlipped ? (
          // MẶT TRƯỚC (FRONT)
          <div className="text-center animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center py-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4 transition-colors leading-tight">
              {currentCard.word}
            </h1>
            <div className="flex items-center justify-center gap-2">
              {currentCard.pronunciation && (
                <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg font-mono text-sm transition-colors border border-slate-200/50 dark:border-slate-700/50">
                  {currentCard.pronunciation}
                </span>
              )}
              <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-extrabold uppercase tracking-wider text-[10px] shadow-sm">
                {currentCard.partOfSpeech || 'VOCAB'}
              </span>
            </div>
            
            <button 
              onClick={playSpeech}
              className="mt-6 p-2.5 rounded-full bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-55 hover:text-indigo-650 dark:hover:bg-indigo-900/40 text-slate-500 dark:text-slate-400 dark:hover:text-indigo-400 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
              title="Phát âm lại"
            >
              <Volume2 size={20} />
            </button>
          </div>
        ) : (
          // MẶT SAU (BACK)
          <div className="w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col justify-between py-2 min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-snug">{currentCard.meaningVN}</h2>
                <button 
                  onClick={playSpeech}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              {currentCard.definitionEN && (
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold mb-3 transition-colors leading-relaxed">{currentCard.definitionEN}</p>
              )}
              
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 w-full mb-3"></div>

              {currentCard.exampleEN && (
                <div className="border-l-4 border-rose-500 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 rounded-r-xl mb-3 transition-colors shadow-inner">
                  <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm italic font-semibold mb-1 leading-relaxed">"{currentCard.exampleEN}"</p>
                  <p className="text-slate-550 dark:text-slate-400 text-[10px] font-bold">{currentCard.exampleVN}</p>
                </div>
              )}

              {currentCard.usageNote && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl flex gap-2 mb-3 items-start transition-colors border border-emerald-100/50 dark:border-emerald-500/20 text-xs font-semibold leading-relaxed">
                  <span className="text-sm">💡</span>
                  <p>{currentCard.usageNote}</p>
                </div>
              )}
            </div>

            {/* Thử thách nhập lại */}
            <div className="mt-3">
              <label className="flex items-center gap-1.5 font-extrabold text-slate-600 dark:text-slate-350 mb-1.5 transition-colors text-[10px] uppercase tracking-wider">
                ✍️ Thử thách: Gõ lại từ tiếng Anh
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nhập từ..."
                    value={challengeInput}
                    onChange={(e) => {
                       setChallengeInput(e.target.value);
                       setIsChallengeSuccess(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && checkChallenge()}
                    className={`w-full p-2.5 pr-8 border rounded-xl outline-none focus:ring-4 font-bold text-sm transition-all bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100
                      ${isChallengeSuccess === true ? 'border-green-500 focus:ring-green-100 dark:focus:ring-green-900/10' : ''}
                      ${isChallengeSuccess === false ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/10' : ''}
                      ${isChallengeSuccess === null ? 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/10' : ''}
                    `}
                  />
                  {isChallengeSuccess === true && (
                    <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                  )}
                  {isChallengeSuccess === false && (
                    <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500" size={16} />
                  )}
                </div>
                <button 
                  onClick={checkChallenge}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs"
                >
                  Check
                </button>
              </div>
            </div>

            {/* SRS glowing evaluation buttons */}
            <div className="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <p className="text-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                Mức độ ghi nhớ? (Gõ phím 1 - 4)
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('again'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🔴</span>
                  <span className="text-[10px] font-extrabold">Quên (1)</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('hard'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-655 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-100 dark:border-amber-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🟡</span>
                  <span className="text-[10px] font-extrabold">Khó (2)</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('good'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/30 border border-green-100 dark:border-green-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🟢</span>
                  <span className="text-[10px] font-extrabold">Thuộc (3)</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('easy'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/30 border border-blue-100 dark:border-blue-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🔵</span>
                  <span className="text-[10px] font-extrabold">Dễ (4)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wide uppercase pointer-events-none select-none opacity-60 group-hover:opacity-90 transition-opacity">
          Bấm Space hoặc click để lật thẻ
        </div>
      </div>
    </div>
  );
};