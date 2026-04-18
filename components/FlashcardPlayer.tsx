// // src/components/FlashcardPlayer.tsx
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, ArrowRight, X } from 'lucide-react';
// import { FlashcardEntry } from '../types';

// interface FlashcardPlayerProps {
//   cards: FlashcardEntry[];
//   onExit: () => void;
// }

// export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ cards, onExit }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [challengeInput, setChallengeInput] = useState('');
//   const [isChallengeSuccess, setIsChallengeSuccess] = useState<boolean | null>(null);

//   const currentCard = cards[currentIndex];

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Bỏ qua phím Space nếu đang gõ trong ô input thử thách
//       if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
//         e.preventDefault();
//         setIsFlipped(prev => !prev);
//       }
//       if (e.code === 'ArrowRight' && document.activeElement?.tagName !== 'INPUT') {
//         handleNext();
//       }
//       if (e.code === 'ArrowLeft' && document.activeElement?.tagName !== 'INPUT') {
//         handlePrev();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [currentIndex, cards.length]);

//   const handleNext = () => {
//     setIsFlipped(false);
//     setChallengeInput('');
//     setIsChallengeSuccess(null);
//     setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : prev));
//   };

//   const handlePrev = () => {
//     setIsFlipped(false);
//     setChallengeInput('');
//     setIsChallengeSuccess(null);
//     setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
//   };

//   const checkChallenge = () => {
//     if (challengeInput.toLowerCase().trim() === currentCard.word.toLowerCase()) {
//       setIsChallengeSuccess(true);
//     } else {
//       setIsChallengeSuccess(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-4">
//       <div className="flex items-center justify-between mb-6 px-2">
//         <button onClick={onExit} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-200 transition-colors">
//           <X size={24} />
//         </button>
//         <span className="font-bold text-slate-400">
//           {currentIndex + 1} / {cards.length}
//         </span>
//       </div>

//       {/* Card Container */}
//       <div 
//         className="bg-white min-h-[400px] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative transition-all duration-300 ease-in-out cursor-pointer"
//         onClick={(e) => {
//           // Không lật thẻ nếu đang click vào ô input hoặc nút kiểm tra
//           const target = e.target as HTMLElement;
//           if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
//             setIsFlipped(!isFlipped);
//           }
//         }}
//       >
//         {!isFlipped ? (
//           // MẶT TRƯỚC (FRONT)
//           <div className="text-center animate-in fade-in zoom-in-95 duration-200">
//             <h1 className="text-6xl font-extrabold text-[#1f2937] tracking-tight mb-6">
//               {currentCard.word}
//             </h1>
//             <div className="flex items-center justify-center gap-3">
//               {currentCard.pronunciation && (
//                 <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-mono text-lg">
//                   {currentCard.pronunciation}
//                 </span>
//               )}
//               <span className="px-3 py-1 bg-[#6366f1] text-white rounded-lg font-bold uppercase tracking-wider text-sm">
//                 {currentCard.partOfSpeech}
//               </span>
//             </div>
//           </div>
//         ) : (
//           // MẶT SAU (BACK)
//           <div className="w-full animate-in fade-in zoom-in-95 duration-200">
//             <h2 className="text-4xl font-bold text-[#6366f1] mb-2">{currentCard.meaningVN}</h2>
//             <p className="text-slate-500 text-lg mb-6">{currentCard.definitionEN}</p>
            
//             <div className="border-t border-dashed border-slate-200 w-full mb-6"></div>

//             <div className="border-l-4 border-rose-500 bg-slate-50 p-5 rounded-r-xl mb-6">
//               <p className="text-slate-800 text-lg italic mb-2">"{currentCard.exampleEN}"</p>
//               <p className="text-slate-500">{currentCard.exampleVN}</p>
//             </div>

//             {currentCard.usageNote && (
//               <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex gap-3 mb-6 items-start">
//                 <span className="text-xl">💡</span>
//                 <p className="font-medium text-sm leading-relaxed">{currentCard.usageNote}</p>
//               </div>
//             )}

//             <div className="border-t border-dashed border-slate-200 w-full mb-6"></div>

//             {/* Thử thách */}
//             <div className="mt-auto">
//               <label className="flex items-center gap-2 font-bold text-slate-700 mb-3">
//                 ✍️ Thử thách: Gõ lại từ tiếng Anh
//               </label>
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   placeholder="Nhập từ..."
//                   value={challengeInput}
//                   onChange={(e) => {
//                      setChallengeInput(e.target.value);
//                      setIsChallengeSuccess(null);
//                   }}
//                   onKeyDown={(e) => e.key === 'Enter' && checkChallenge()}
//                   className={`flex-1 p-3 border rounded-xl outline-none focus:ring-2 font-medium text-lg transition-colors
//                     ${isChallengeSuccess === true ? 'border-green-500 focus:ring-green-200' : ''}
//                     ${isChallengeSuccess === false ? 'border-red-500 focus:ring-red-200' : ''}
//                     ${isChallengeSuccess === null ? 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200' : ''}
//                   `}
//                 />
//                 <button 
//                   onClick={checkChallenge}
//                   className="bg-[#6366f1] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
//                 >
//                   Kiểm tra
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Chỉ dẫn bên dưới thẻ */}
//         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-400 text-sm font-medium flex items-center gap-2">
//           🖱️ Click hoặc Space để lật
//         </div>
//       </div>

//       {/* Điều hướng */}
//       <div className="flex items-center justify-between mt-16 px-4">
//         <button 
//           onClick={handlePrev}
//           disabled={currentIndex === 0}
//           className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
//         >
//           <ArrowLeft size={20} /> Trở lại
//         </button>
//         <button 
//           onClick={handleNext}
//           disabled={currentIndex === cards.length - 1}
//           className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
//         >
//           Tiếp theo <ArrowRight size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };
// src/components/FlashcardPlayer.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { FlashcardEntry } from '../types';

interface FlashcardPlayerProps {
  cards: FlashcardEntry[];
  onExit: () => void;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ cards, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [challengeInput, setChallengeInput] = useState('');
  const [isChallengeSuccess, setIsChallengeSuccess] = useState<boolean | null>(null);

  // --- LỚP BẢO VỆ CHỐNG SẬP MÀN HÌNH TRẮNG ---
  const currentCard = cards && cards.length > 0 ? cards[currentIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
      if (e.code === 'ArrowRight' && document.activeElement?.tagName !== 'INPUT') {
        handleNext();
      }
      if (e.code === 'ArrowLeft' && document.activeElement?.tagName !== 'INPUT') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards?.length]);

  const handleNext = () => {
    if (!cards) return;
    setIsFlipped(false);
    setChallengeInput('');
    setIsChallengeSuccess(null);
    setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setChallengeInput('');
    setIsChallengeSuccess(null);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const checkChallenge = () => {
    if (!currentCard?.word) return;
    if (challengeInput.toLowerCase().trim() === currentCard.word.toLowerCase()) {
      setIsChallengeSuccess(true);
    } else {
      setIsChallengeSuccess(false);
    }
  };

  // Nếu không có dữ liệu hợp lệ, hiển thị thông báo lỗi thân thiện thay vì sập web
  if (!currentCard || !currentCard.word) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center bg-white p-10 rounded-2xl shadow-sm border border-red-100">
        <h2 className="text-2xl font-bold text-red-500 mb-4">⚠️ Dữ liệu AI trả về bị lỗi!</h2>
        <p className="text-slate-600 mb-8">JSON bạn dán vào không có trường <strong>"word"</strong> hoặc sai cấu trúc.</p>
        <button onClick={onExit} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
          Quay lại kiểm tra
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-200 transition-colors">
          <X size={24} />
        </button>
        <span className="font-bold text-slate-400">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Card Container */}
      <div 
        className="bg-white min-h-[400px] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative transition-all duration-300 ease-in-out cursor-pointer"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {!isFlipped ? (
          // MẶT TRƯỚC (FRONT)
          <div className="text-center animate-in fade-in zoom-in-95 duration-200">
            <h1 className="text-6xl font-extrabold text-[#1f2937] tracking-tight mb-6">
              {currentCard.word}
            </h1>
            <div className="flex items-center justify-center gap-3">
              {currentCard.pronunciation && (
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-mono text-lg">
                  {currentCard.pronunciation}
                </span>
              )}
              <span className="px-3 py-1 bg-[#6366f1] text-white rounded-lg font-bold uppercase tracking-wider text-sm">
                {currentCard.partOfSpeech || 'VOCAB'}
              </span>
            </div>
          </div>
        ) : (
          // MẶT SAU (BACK)
          <div className="w-full animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-4xl font-bold text-[#6366f1] mb-2">{currentCard.meaningVN}</h2>
            <p className="text-slate-500 text-lg mb-6">{currentCard.definitionEN}</p>
            
            <div className="border-t border-dashed border-slate-200 w-full mb-6"></div>

            {currentCard.exampleEN && (
              <div className="border-l-4 border-rose-500 bg-slate-50 p-5 rounded-r-xl mb-6">
                <p className="text-slate-800 text-lg italic mb-2">"{currentCard.exampleEN}"</p>
                <p className="text-slate-500">{currentCard.exampleVN}</p>
              </div>
            )}

            {currentCard.usageNote && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex gap-3 mb-6 items-start">
                <span className="text-xl">💡</span>
                <p className="font-medium text-sm leading-relaxed">{currentCard.usageNote}</p>
              </div>
            )}

            <div className="border-t border-dashed border-slate-200 w-full mb-6"></div>

            {/* Thử thách */}
            <div className="mt-auto">
              <label className="flex items-center gap-2 font-bold text-slate-700 mb-3">
                ✍️ Thử thách: Gõ lại từ tiếng Anh
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nhập từ..."
                  value={challengeInput}
                  onChange={(e) => {
                     setChallengeInput(e.target.value);
                     setIsChallengeSuccess(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && checkChallenge()}
                  className={`flex-1 p-3 border rounded-xl outline-none focus:ring-2 font-medium text-lg transition-colors
                    ${isChallengeSuccess === true ? 'border-green-500 focus:ring-green-200' : ''}
                    ${isChallengeSuccess === false ? 'border-red-500 focus:ring-red-200' : ''}
                    ${isChallengeSuccess === null ? 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200' : ''}
                  `}
                />
                <button 
                  onClick={checkChallenge}
                  className="bg-[#6366f1] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  Kiểm tra
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-400 text-sm font-medium flex items-center gap-2">
          🖱️ Click hoặc Space để lật
        </div>
      </div>

      {/* Điều hướng */}
      <div className="flex items-center justify-between mt-16 px-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          <ArrowLeft size={20} /> Trở lại
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          Tiếp theo <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};