import React, { useState, useEffect } from 'react';
import { X, Volume2, Award, Zap, CheckCircle2 } from 'lucide-react';
import { WordEntry, AppSettings } from '../types';
import { speak } from '../services/ttsService';
import { calculateNextSRS } from '../services/srsService';

interface SRSPlayerProps {
  words: WordEntry[];
  onExit: (targetView?: 'dashboard' | 'list') => void;
  onUpdateSRS: (
    wordId: string, 
    srsLevel: number, 
    nextReview: number, 
    srsInterval: number, 
    difficulty: 'again' | 'hard' | 'good' | 'easy'
  ) => void;
  settings?: AppSettings;
  onAwardXP?: (xp: number) => void;
}

export const SRSPlayer: React.FC<SRSPlayerProps> = ({
  words,
  onExit,
  onUpdateSRS,
  settings,
  onAwardXP
}) => {
  const [dueWords, setDueWords] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    // Lọc ra các từ đến hạn ôn tập (nextReview <= now)
    const now = Date.now();
    const filtered = words.filter(w => !w.nextReview || w.nextReview <= now);
    
    // Xáo trộn ngẫu nhiên danh sách ôn tập để tăng khả năng ghi nhớ
    setDueWords(filtered.sort(() => Math.random() - 0.5));
  }, [words]);

  const currentWord = dueWords[currentIndex];

  // Tự phát âm khi mở thẻ hoặc chuyển thẻ ở mặt trước
  useEffect(() => {
    if (currentWord && !isFlipped) {
      speak(currentWord.word, {
        ttsRate: settings?.ttsRate,
        ttsPitch: settings?.ttsPitch,
        ttsVoiceName: settings?.ttsVoiceName
      });
    }
  }, [currentIndex, isFlipped, currentWord?.word]);

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;

    // Tính toán thông số SRS tiếp theo
    const { srsLevel, srsInterval, nextReview } = calculateNextSRS(
      difficulty,
      currentWord.srsLevel,
      currentWord.srsInterval
    );

    // Cập nhật trạng thái từ vựng ở component cha
    onUpdateSRS(currentWord.id, srsLevel, nextReview, srsInterval, difficulty);

    // Cộng điểm XP thưởng
    const xpReward = difficulty === 'again' ? 2 : difficulty === 'easy' ? 10 : 6;
    if (onAwardXP) onAwardXP(xpReward);
    setXpEarned(prev => prev + xpReward);

    setReviewedCount(prev => prev + 1);

    // Chuyển sang thẻ tiếp theo với hiệu ứng lật mượt
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 200);
  };

  const playSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentWord?.word) {
      speak(currentWord.word, {
        ttsRate: settings?.ttsRate,
        ttsPitch: settings?.ttsPitch,
        ttsVoiceName: settings?.ttsVoiceName
      });
    }
  };

  // 1. Giao diện khi hoàn thành buổi ôn tập
  if (currentIndex >= dueWords.length && dueWords.length > 0) {
    return (
      <div className="max-w-md mx-auto mt-6 md:mt-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-150 dark:border-slate-800 relative overflow-hidden">
          {/* Confetti-like ambient colors */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full filter blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-2xl animate-pulse" />

          <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
            <Award className="text-emerald-500 animate-bounce" size={32} />
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-1.5">Tuyệt vời! Hoàn thành!</h2>
          <p className="text-slate-550 dark:text-slate-400 mb-6 leading-relaxed font-semibold text-xs md:text-sm">Bạn đã vượt qua thử thách ôn tập ngắt quãng hôm nay một cách xuất sắc.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700">
              <span className="block text-xl font-black text-slate-800 dark:text-white">{reviewedCount}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Từ đã ôn</span>
            </div>
            <div className="bg-indigo-50/50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20">
              <span className="block text-xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                <Zap size={16} fill="currentColor" /> +{xpEarned}
              </span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Kinh nghiệm</span>
            </div>
          </div>

          <button
            onClick={() => onExit('list')}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-102 active:scale-95 text-sm"
          >
            Quay lại Sổ Từ Vựng
          </button>
        </div>
      </div>
    );
  }

  // 2. Giao diện khi không có từ nào cần ôn tập hôm nay
  if (dueWords.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-6 md:mt-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight mb-1.5">Đã hoàn thành ôn tập!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-semibold text-xs md:text-sm">Hôm nay không có từ vựng nào đến hạn ôn tập SRS. Hãy tiếp tục lưu thêm từ mới hoặc ôn bài cũ nhé!</p>
          
          <button
            onClick={() => onExit()}
            className="w-full bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold hover:shadow-lg transition-all text-sm active:scale-95"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-1">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={() => onExit()} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all">
          <X size={20} />
        </button>
        
        <span className="font-extrabold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3.5 py-1 rounded-full text-xs tracking-wider flex items-center gap-1.5 border border-amber-100/50 dark:border-amber-500/10">
          ⏳ SRS: {currentIndex + 1} / {dueWords.length}
        </span>
      </div>

      {/* Card Container */}
      <div
        className="bg-white dark:bg-slate-900 min-h-[300px] md:min-h-[340px] rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-center relative transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Glow rings in card */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl" />

        {!isFlipped ? (
          // MẶT TRƯỚC (FRONT)
          <div className="text-center animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center py-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4 transition-colors leading-tight">
              {currentWord.word}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border border-amber-100 dark:border-amber-500/20">
                {currentWord.type}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-extrabold">
                Cấp {currentWord.srsLevel || 1}/5
              </span>
            </div>
            
            <button 
              onClick={playSpeech}
              className="mt-6 p-2.5 rounded-full bg-slate-50 dark:bg-slate-800/85 hover:bg-indigo-55 hover:text-indigo-600 dark:hover:bg-indigo-900/40 text-slate-400 dark:text-slate-500 dark:hover:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50 transition-all active:scale-95"
            >
              <Volume2 size={20} />
            </button>
          </div>
        ) : (
          // MẶT SAU (BACK)
          <div className="w-full animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between py-2 min-h-[250px]">
            <div>
              <div className="flex justify-between items-start mb-1.5">
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-snug">{currentWord.meaning}</h2>
                <button 
                  onClick={playSpeech}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              
              <div className="border-t border-dashed border-slate-100 dark:border-slate-800/80 w-full my-2.5"></div>

              {currentWord.example && (
                <div className="border-l-4 border-amber-400 bg-slate-50/60 dark:bg-slate-850/50 p-3 rounded-r-xl mb-3 shadow-inner transition-colors">
                  <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm italic leading-relaxed pr-2">"{currentWord.example}"</p>
                </div>
              )}
            </div>

            {/* SRS Glowing Response Buttons */}
            <div className="mt-4">
              <p className="text-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Mức độ ghi nhớ?</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('again'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🔴</span>
                  <span className="text-[10px] font-extrabold">Quên</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('hard'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-655 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-100 dark:border-amber-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🟡</span>
                  <span className="text-[10px] font-extrabold">Khó</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('good'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/30 border border-green-100 dark:border-green-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🟢</span>
                  <span className="text-[10px] font-extrabold">Thuộc</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDifficulty('easy'); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/30 border border-blue-100 dark:border-blue-900/20 transition-all duration-200 hover:scale-103 active:scale-95"
                >
                  <span className="text-lg mb-0.5">🔵</span>
                  <span className="text-[10px] font-extrabold">Rất Dễ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wide uppercase pointer-events-none select-none opacity-60 group-hover:opacity-90 transition-opacity">
          Click vào thẻ để lật mặt
        </div>
      </div>
    </div>
  );
};
