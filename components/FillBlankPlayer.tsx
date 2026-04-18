// src/components/FillBlankPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { FillBlankEntry } from '../types';

interface FillBlankPlayerProps {
  questions: FillBlankEntry[];
  onExit: () => void;
}

export const FillBlankPlayer: React.FC<FillBlankPlayerProps> = ({ questions, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    // Reset state khi chuyển câu
    setInputAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIndex]);

  const handleCheck = () => {
    if (!inputAnswer.trim()) return;
    if (inputAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => setCurrentIndex(prev => prev < questions.length - 1 ? prev + 1 : prev);
  const handlePrev = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);

  return (
    <div className="max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-200 transition-colors">
          <X size={24} />
        </button>
        <span className="font-bold text-slate-400 bg-white px-4 py-1.5 rounded-full shadow-sm">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white min-h-[400px] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative">
        
        <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-6">Fill in the blank</h2>
        
        {/* <p className="text-2xl md:text-3xl text-slate-800 font-medium leading-relaxed mb-10">
          {currentQ.question.split('________').map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span className="inline-block mx-2 w-32 border-b-2 border-slate-300"></span>
              )}
            </React.Fragment>
          ))}
        </p> */}
<p className="text-2xl md:text-3xl text-slate-800 font-medium leading-relaxed mb-10">
          {/* Sửa dòng dưới đây: Thêm (currentQ?.question || '') */}
          {(currentQ?.question || '').split('________').map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span className="inline-block mx-2 w-32 border-b-2 border-slate-300"></span>
              )}
            </React.Fragment>
          ))}
        </p>
        {showHint && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-8 flex items-start gap-3 animate-in fade-in">
            <Lightbulb className="flex-shrink-0 text-amber-500" size={20} />
            <p className="font-medium">{currentQ.hintVN}</p>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type the missing word..."
                value={inputAnswer}
                onChange={(e) => {
                  setInputAnswer(e.target.value);
                  setIsCorrect(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                disabled={isCorrect === true}
                className={`w-full p-4 rounded-xl border-2 outline-none font-bold text-lg transition-all ${
                  isCorrect === true ? 'border-green-500 bg-green-50 text-green-700' :
                  isCorrect === false ? 'border-red-500 bg-red-50 text-red-700' :
                  'border-slate-200 focus:border-indigo-500 text-slate-800'
                }`}
              />
              {isCorrect === true && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={24} />}
              {isCorrect === false && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={24} />}
            </div>

            {isCorrect !== true ? (
              <button 
                onClick={handleCheck}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md"
              >
                Kiểm tra
              </button>
            ) : (
               <button 
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 justify-center"
              >
                Tiếp tục <ArrowRight size={20} />
              </button>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowHint(true)}
              className="text-slate-400 hover:text-amber-500 text-sm font-bold flex items-center gap-1 mx-auto transition-colors"
            >
              <Lightbulb size={16} /> Nhận gợi ý
            </button>
          </div>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="flex items-center justify-between mt-8 px-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-0 transition-all"
        >
          <ArrowLeft size={20} /> Câu trước
        </button>
      </div>
    </div>
  );
};