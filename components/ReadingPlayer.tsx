import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { VSTEPExam, VSTEPReadingPart, VSTEPReadingQuestion } from '../types';

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
      <div className="max-w-3xl mx-auto p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-red-500 mb-2">Không tải được dữ liệu phần Đọc!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Có thể AI đang bị quá tải hoặc quá trình tạo đề thi gặp sự cố. Vui lòng thử lại.
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }
  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Kết quả phần Đọc</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {allQuestions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={idx} className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="text-green-500 dark:text-green-400 mt-0.5" size={20} />
                    ) : (
                      <XCircle className="text-red-500 dark:text-red-400 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-100 mb-2">Câu {idx + 1}: {q.question}</p>
                      <div className="space-y-1 text-sm">
                        <p>✓ Đáp án đúng: <span className="font-semibold text-green-600 dark:text-green-400">{q.options[q.correctAnswer]}</span></p>
                        {userAnswer !== undefined && (
                          <p>✗ Bạn chọn: <span className={`font-semibold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{q.options[userAnswer]}</span></p>
                        )}
                        {q.explanation && (
                          <p className="text-slate-500 dark:text-slate-400 mt-2">💡 {q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
            >
              Xem lại bài
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300">
              ✕
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Phần Đọc - Part {currentPart.partNumber}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {answeredCount}/{allQuestions.length} câu
            </span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              <Clock size={16} />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Content */}
      {currentPart.content && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          {currentPart.title && (
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">{currentPart.title}</h3>
          )}
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {currentPart.content}
            </p>
          </div>
        </div>
      )}

      {/* Grammar/Vocabulary questions for Part 5 */}
      {currentPart.partNumber === 5 && !currentPart.content && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Part 5: Từ vựng & Ngữ pháp</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Chọn đáp án đúng nhất (A, B, C hoặc D) cho mỗi câu.</p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {currentPart.questions.map((q, idx) => {
          // Tính toán global index
          let globalIdx = 0;
          for (let i = 0; i < currentPartIndex; i++) {
            globalIdx += exam.sections.reading[i].questions.length;
          }
          globalIdx += idx;

          const currentAnswer = answers[globalIdx];

          return (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{globalIdx + 1}.</span> {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswer(globalIdx, optIdx)}
                    className={`p-3 rounded-lg text-left transition-all border ${
                      currentAnswer === optIdx
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {/* <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span> */}
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPartIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Phần trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {currentPartIndex < exam.sections.reading.length - 1 ? (
            <>Phần tiếp theo <ArrowRight size={18} /></>
          ) : (
            'Hoàn thành'
          )}
        </button>
      </div>
    </div>
  );
};