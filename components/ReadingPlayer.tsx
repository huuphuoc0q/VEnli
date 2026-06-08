import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Clock, FileWarning } from 'lucide-react';
import type { VSTEPExam, VSTEPReadingPart } from '../types';

interface ReadingPlayerProps {
  exam: VSTEPExam;
  onComplete: (answers: Record<number, number>) => void;
  onExit: () => void;
}

export const ReadingPlayer: React.FC<ReadingPlayerProps> = ({ exam, onComplete, onExit }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút

  const currentPart: VSTEPReadingPart = exam.sections.reading[currentPartIndex];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentPartIndex < exam.sections.reading.length - 1) {
      setCurrentPartIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const allQuestions = exam.sections.reading.flatMap(p => p.questions);
  const answeredCount = Object.keys(answers).length;

  if (!currentPart) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-sm border border-slate-150 dark:border-slate-800 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileWarning size={32} />
        </div>
        <h2 className="text-2xl font-black text-rose-600 mb-2">Không tải được dữ liệu phần Đọc</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          Có thể API đang quá tải hoặc quá trình khởi tạo đề thi gặp sự cố. Vui lòng thử lại.
        </p>
        <button
          onClick={onExit}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 text-xs"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-150 dark:border-slate-800 transition-colors">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Kết quả phần thi Đọc</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {allQuestions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={idx} className={`p-5 rounded-2xl border transition-colors duration-300 ${
                  isCorrect 
                    ? 'bg-emerald-500/5 border-emerald-500/15 dark:border-emerald-500/20' 
                    : 'bg-rose-500/5 border-rose-500/15 dark:border-rose-500/20'
                }`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-rose-500 dark:text-rose-455 mt-0.5 flex-shrink-0" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 mb-2 leading-snug">Câu {idx + 1}: {q.question}</p>
                      <div className="space-y-1.5 text-xs md:text-sm">
                        <p className="text-slate-500 dark:text-slate-400">✓ Đáp án đúng: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{q.options[q.correctAnswer]}</span></p>
                        {userAnswer !== undefined && (
                          <p className="text-slate-500 dark:text-slate-400">✗ Bạn chọn: <span className={`font-extrabold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{q.options[userAnswer]}</span></p>
                        )}
                        {q.explanation && (
                          <p className="text-slate-550 dark:text-slate-450 mt-2 text-xs italic">💡 Giải thích: {q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 py-3.5 border border-slate-250 dark:border-slate-850 text-slate-655 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-2xl font-bold transition-all duration-300 text-xs active:scale-95"
            >
              Xem lại bài làm
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 text-xs"
            >
              Chuyển sang phần tiếp theo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl py-2.5 px-4 shadow-sm border border-slate-150 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              ✕
            </button>
            <h2 className="text-base md:text-lg font-black text-slate-800 dark:text-white">
              Đọc - Part {currentPart.partNumber}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">
              Đã làm: {answeredCount}/{allQuestions.length} câu
            </span>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-colors ${
              timeLeft < 300 
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-350 border-slate-200/50 dark:border-slate-850'
            }`}>
              <Clock size={14} className={timeLeft < 300 ? 'animate-pulse' : ''} />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Passage text */}
        {currentPart.content && (
          <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-4.5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors md:h-[calc(100vh-9.5rem)] md:overflow-y-auto no-scrollbar">
            {currentPart.title && (
              <h3 className="font-black text-base md:text-lg text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-850 pb-3 leading-snug">
                {currentPart.title}
              </h3>
            )}
            <div className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line">
              {currentPart.content}
            </div>
          </div>
        )}

        {/* Right column: Questions */}
        <div className={`${currentPart.content ? 'md:col-span-6' : 'md:col-span-12'} space-y-4 md:h-[calc(100vh-9.5rem)] md:overflow-y-auto no-scrollbar`}>
          {/* Grammar Header for Part 5 (if no content) */}
          {currentPart.partNumber === 5 && !currentPart.content && (
            <div className="bg-indigo-550/5 dark:bg-indigo-500/5 border border-indigo-500/15 dark:border-indigo-500/20 rounded-2xl p-5 text-sm mb-4">
              <h3 className="font-black text-indigo-750 dark:text-indigo-400">Part 5: Từ vựng & Ngữ pháp</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium leading-relaxed">Chọn đáp án đúng nhất (A, B, C hoặc D) cho mỗi câu hỏi dưới đây.</p>
            </div>
          )}

          {currentPart.questions.map((q, idx) => {
            let globalIdx = 0;
            for (let i = 0; i < currentPartIndex; i++) {
              globalIdx += exam.sections.reading[i].questions.length;
            }
            globalIdx += idx;

            const currentAnswer = answers[globalIdx];

            return (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors space-y-4">
                <p className="font-extrabold text-slate-800 dark:text-slate-100 leading-snug text-xs md:text-sm">
                  <span className="text-indigo-650 dark:text-indigo-400 font-black mr-2">{globalIdx + 1}.</span> 
                  {q.question}
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((option, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    const isSelected = currentAnswer === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(globalIdx, optIdx)}
                        className={`py-2 px-3 rounded-xl text-left text-xs md:text-sm font-semibold transition-all duration-300 border flex items-center gap-3 active:scale-[0.98] ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'border-slate-205 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/10'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {letter}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentPartIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-slate-250 dark:border-slate-850 text-slate-655 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs active:scale-95"
        >
          <ArrowLeft size={16} />
          Phần trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs"
        >
          {currentPartIndex < exam.sections.reading.length - 1 ? (
            <>Tiếp tục phần sau <ArrowRight size={16} /></>
          ) : (
            'Nộp bài phần thi Đọc'
          )}
        </button>
      </div>
    </div>
  );
};