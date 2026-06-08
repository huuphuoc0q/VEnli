import React, { useState, useEffect, useMemo } from 'react';
import { WordEntry, AppSettings } from '../types';
import { X, Play, Clock, RotateCcw, Award, Zap, HelpCircle } from 'lucide-react';

interface MatchingGameProps {
  words: WordEntry[];
  onExit: () => void;
  onAwardXP: (amount: number) => void;
  settings?: AppSettings;
}

interface CardItem {
  id: string; // unique for grid key: e.g. "en-123" or "vn-123"
  text: string;
  matchId: string; // original WordEntry id
  type: 'english' | 'vietnamese';
}

const FALLBACK_VOCAB = [
  { word: "Infrastructure", meaning: "Cơ sở hạ tầng" },
  { word: "Proficiency", meaning: "Sự thành thạo, năng lực" },
  { word: "Curriculum", meaning: "Chương trình học" },
  { word: "Assessment", meaning: "Sự đánh giá, bài kiểm tra" },
  { word: "Collaboration", meaning: "Sự hợp tác" },
  { word: "Efficiency", meaning: "Hiệu suất, hiệu quả" },
  { word: "Innovation", meaning: "Sự đổi mới, sáng tạo" },
  { word: "Cognitive", meaning: "Thuộc về nhận thức" },
  { word: "Hypothesis", meaning: "Giả thuyết" },
  { word: "Empirical", meaning: "Thực nghiệm, dựa trên kinh nghiệm" }
];

export const MatchingGame: React.FC<MatchingGameProps> = ({
  words,
  onExit,
  onAwardXP,
  settings
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [solvedMatches, setSolvedMatches] = useState<string[]>([]); // holds matchId
  const [failedPair, setFailedPair] = useState<string[]>([]); // holds CardItem id
  
  // Game Stats
  const [movesCount, setMovesCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Initialize Game
  const initGame = () => {
    // 1. Get words to play
    let playWords: { word: string; meaning: string; id: string }[] = [];
    
    // Use user words if they have enough, otherwise fill/fallback
    const userWords = words.map(w => ({ word: w.word, meaning: w.meaning, id: w.id }));
    
    if (userWords.length >= 6) {
      // Pick 6 random words from user vocabulary
      const shuffled = [...userWords].sort(() => 0.5 - Math.random());
      playWords = shuffled.slice(0, 6);
    } else {
      // Fill the rest with fallback vocabulary
      playWords = [...userWords];
      const remainingCount = 6 - playWords.length;
      
      const filteredFallback = FALLBACK_VOCAB.filter(
        fv => !userWords.some(uw => uw.word.toLowerCase() === fv.word.toLowerCase())
      );
      
      const shuffledFallback = [...filteredFallback].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < remainingCount && i < shuffledFallback.length; i++) {
        playWords.push({
          word: shuffledFallback[i].word,
          meaning: shuffledFallback[i].meaning,
          id: `fallback-${i}-${Date.now()}`
        });
      }
    }

    // 2. Map words to 12 cards
    const cardItems: CardItem[] = [];
    playWords.forEach(w => {
      cardItems.push({
        id: `en-${w.id}`,
        text: w.word,
        matchId: w.id,
        type: 'english'
      });
      cardItems.push({
        id: `vn-${w.id}`,
        text: w.meaning,
        matchId: w.id,
        type: 'vietnamese'
      });
    });

    // 3. Shuffle cards
    const shuffledCards = cardItems.sort(() => 0.5 - Math.random());
    setCards(shuffledCards);
    
    // 4. Reset stats
    setSelectedCard(null);
    setSolvedMatches([]);
    setFailedPair([]);
    setMovesCount(0);
    setTimeElapsed(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  // Start game on mount
  useEffect(() => {
    initGame();
  }, [words]);

  // Timer Effect
  useEffect(() => {
    let timerId: any;
    if (gameStarted && !gameFinished) {
      timerId = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [gameStarted, gameFinished]);

  // Handle Card Click
  const handleCardClick = (card: CardItem) => {
    // Ignore if already matched or selected or animation is running
    if (solvedMatches.includes(card.matchId)) return;
    if (selectedCard?.id === card.id) return;
    if (failedPair.length > 0) return;

    if (!selectedCard) {
      // First card selected
      setSelectedCard(card);
    } else {
      // Second card selected
      const isMatch = selectedCard.type !== card.type && selectedCard.matchId === card.matchId;

      if (isMatch) {
        // Success match
        const newSolvedMatches = [...solvedMatches, card.matchId];
        setSolvedMatches(newSolvedMatches);
        setSelectedCard(null);
        setMovesCount(prev => prev + 1);

        // Check if game complete
        if (newSolvedMatches.length === cards.length / 2) {
          console.log("[MatchingGame] Game completed! Awarding 15 XP. Solved matches:", newSolvedMatches.length);
          setGameFinished(true);
          onAwardXP(15); // Award 15 XP for completing the matching game!
        }
      } else {
        // Mismatch
        setFailedPair([selectedCard.id, card.id]);
        setMovesCount(prev => prev + 1);
        setSelectedCard(null);

        // Clear mismatch styling after 900ms
        setTimeout(() => {
          setFailedPair([]);
        }, 900);
      }
    }
  };

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeElapsed]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-500 pb-12">
      {/* Styles Injection for Shake and Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .scale-102 {
          transform: scale(1.025);
        }
        .scale-98 {
          transform: scale(0.975);
        }
      `}</style>

      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl py-3.5 px-4 sm:px-5 border border-slate-150 dark:border-slate-800/80 shadow-md flex items-center justify-between backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-650 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/10">
            <Zap size={20} fill="currentColor" className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 dark:text-white">Minigame Ghep Tu</h2>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Luyen phan xa tu vung sieu nhanh</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-505 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-150 dark:border-slate-800 shadow-sm text-center">
          <span className="block text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Tien trinh</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">{solvedMatches.length} / {cards.length / 2} Cap</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-150 dark:border-slate-800 shadow-sm text-center">
          <span className="block text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Luot ghep</span>
          <span className="text-sm font-black text-slate-805 dark:text-white">{movesCount}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-150 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <span className="text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Thoi gian</span>
          <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">{formattedTime}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {!gameFinished && cards.length > 0 && (
        <div className="w-full bg-slate-200 dark:bg-slate-855 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-300/10">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(solvedMatches.length / (cards.length / 2)) * 100}%` }}
          />
        </div>
      )}

      {/* Game Area */}
      {!gameFinished ? (
        <div className="bg-slate-100/40 dark:bg-slate-900/30 rounded-3xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/60 backdrop-blur-sm min-h-[340px] flex items-center justify-center transition-all">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            {cards.map(card => {
              const isSelected = selectedCard?.id === card.id;
              const isSolved = solvedMatches.includes(card.matchId);
              const isFailed = failedPair.includes(card.id);
              const isEnglish = card.type === 'english';

              let cardStyle = "";
              if (isSolved) {
                cardStyle = "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/15 dark:to-teal-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/5 scale-98 opacity-70 cursor-default pointer-events-none line-through decoration-emerald-500/30";
              } else if (isFailed) {
                cardStyle = "bg-gradient-to-br from-rose-500/20 to-red-500/10 dark:from-rose-500/30 dark:to-red-500/15 border-rose-500 text-rose-650 dark:text-rose-455 animate-shake";
              } else if (isSelected) {
                cardStyle = isEnglish
                  ? "bg-gradient-to-br from-indigo-500/20 to-blue-500/10 dark:from-indigo-500/30 dark:to-blue-500/15 border-indigo-500 ring-2 ring-indigo-500/50 text-indigo-700 dark:text-indigo-300 scale-102 shadow-lg shadow-indigo-500/20"
                  : "bg-gradient-to-br from-purple-500/20 to-pink-500/10 dark:from-purple-500/30 dark:to-pink-500/15 border-purple-500 ring-2 ring-purple-500/50 text-purple-700 dark:text-purple-300 scale-102 shadow-lg shadow-purple-500/20";
              } else {
                // Default unselected state
                cardStyle = isEnglish
                  ? "bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-850/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/15 hover:shadow-md hover:scale-102"
                  : "bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-850/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-700 hover:bg-purple-50/10 dark:hover:bg-purple-950/15 hover:shadow-md hover:scale-102";
              }

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isSolved}
                  className={`min-h-[86px] sm:min-h-[96px] rounded-2xl text-xs sm:text-sm font-bold p-3 flex flex-col items-center justify-center text-center transition-all duration-300 border active:scale-95 break-words shadow-sm cursor-pointer ${cardStyle}`}
                >
                  <span className="leading-snug">{card.text}</span>
                  {isSolved && (
                    <span className="text-[9px] font-extrabold text-emerald-500 mt-1.5 uppercase tracking-wider">* Da khop</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Winner Celebration Screen */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-150 dark:border-slate-800 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300 max-w-xl mx-auto relative overflow-hidden">
          {/* Sparkles effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
            <div className="absolute top-10 left-10 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            <div className="absolute top-20 right-20 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-300" />
            <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping delay-700" />
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-emerald-500 rounded-full animate-ping delay-1000" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20 mb-1">
            <Award size={42} className="animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-650 to-pink-500 bg-clip-text text-transparent">Chien Thang!</h3>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider">Da ghep thanh cong tat ca tu vung</p>
          </div>

          <div className="max-w-sm mx-auto bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 space-y-3.5 text-xs text-slate-655 dark:text-slate-400 font-semibold shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-550">Thoi gian hoan thanh:</span>
              <span className="text-slate-800 dark:text-white font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800 shadow-sm">{formattedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-550">Tong so luot ghep:</span>
              <span className="text-slate-805 dark:text-white font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800 shadow-sm">{movesCount} luot</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-855 pt-3 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              <span className="flex items-center gap-1.5"><Zap size={14} fill="currentColor" className="text-amber-500 animate-pulse" /> Diem thuong:</span>
              <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-3 py-1 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm">+15 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={initGame}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold transition-all text-xs active:scale-95 hover:shadow-sm"
            >
              <RotateCcw size={14} /> Choi lai
            </button>
            <button
              onClick={onExit}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-655 hover:to-purple-750 text-white py-3 rounded-xl font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-xs"
            >
              Quay lai Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Instructions / Help */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 sm:p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 flex gap-3 text-[11px] text-slate-555 dark:text-slate-400 font-semibold leading-relaxed transition-colors">
        <HelpCircle className="text-indigo-500 flex-shrink-0 mt-0.5" size={14} />
        <p>
          <strong>Huong dan choi:</strong> Ban chi can nhan chon mot the tieng Anh va the nghia tieng Viet tuong ung de ghep cap. Cac cap ghep dung se hien thi mau xanh la va co dinh. Nhan ngay <strong>+15 XP</strong> sau khi ghep chinh xac ca 6 cap tu!
        </p>
      </div>
    </div>
  );
};
