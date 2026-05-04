import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Volume2, Pause, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { VSTEPExam, VSTEPListeningPart, VSTEPListeningQuestion } from '../types';

interface ListeningPlayerProps {
  exam: VSTEPExam;
  onComplete: (answers: Record<number, number>) => void;
  onExit: () => void;
}

export const ListeningPlayer: React.FC<ListeningPlayerProps> = ({ exam, onComplete, onExit }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 phút

 const currentPart = exam.sections.listening[currentPartIndex];
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    if (currentPart?.transcript) {
      const utterance = new SpeechSynthesisUtterance(currentPart.transcript);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      // Chỉnh âm độ xuống một xíu nghe sẽ trầm và "người" hơn
      utterance.pitch = 0.95; 

      // Hàm chọn giọng xịn nhất
      const setBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Ưu tiên 1: Các giọng đọc online/premium của Google hoặc Microsoft (nghe rất tự nhiên)
        const bestVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
        );

        // Ưu tiên 2: Bất kỳ giọng tiếng Anh Mỹ nào
        const fallbackVoice = voices.find(v => v.lang === 'en-US');

        if (bestVoice) {
          utterance.voice = bestVoice;
        } else if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      };

      // Do trình duyệt load danh sách giọng bất đồng bộ, phải bắt sự kiện này
      if (window.speechSynthesis.getVoices().length > 0) {
        setBestVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setBestVoice;
      }

      utterance.onend = () => setIsPlaying(false);
      utteranceRef.current = utterance;
    }

    return () => window.speechSynthesis.cancel();
  }, [currentPartIndex, currentPart?.transcript]);
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
    if (currentPartIndex < exam.sections.listening.length - 1) {
      setCurrentPartIndex(prev => prev + 1);
      setShowTranscript(false);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(prev => prev - 1);
      setShowTranscript(false);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };
const toggleAudio = () => {
    if (!utteranceRef.current) return;

    if (isPlaying) {
      // Đang phát thì tạm dừng
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      // Nếu đang bị pause thì cho chạy tiếp, ngược lại thì đọc từ đầu
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel(); // Xóa hàng đợi cũ để chắc chắn không bị kẹt
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  };
  const allQuestions = exam.sections.listening.flatMap(p => p.questions);
  const answeredCount = Object.keys(answers).length;
if (!currentPart) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border border-slate-200 dark:border-slate-700 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Không có dữ liệu phần Nghe</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Bạn chưa nhập JSON cho phần thi này hoặc dữ liệu bị lỗi.</p>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          Bỏ qua & Chuyển phần tiếp theo
        </button>
      </div>
    );
  }
  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-600 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Kết quả phần Nghe</h2>

          <div className="space-y-4">
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
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 dark:text-slate-200 rounded-xl font-medium transition-colors"
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-600 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300">
              ✕
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Phần Nghe - Part {currentPart.partNumber}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {answeredCount}/{allQuestions.length} câu
            </span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 dark:text-slate-200'
            }`}>
              <Clock size={16} />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 font-medium">{currentPart.instructions}</p>
      </div>

      {/* Transcript (simulated audio) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-600 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">Bảng nghe (Transcript)</h3>
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Tạm dừng' : 'Phát'}
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 max-h-64 overflow-y-auto">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {currentPart.transcript || 'Audio đang được phát...'}
          </p>
        </div>

        {isPlaying && (
          <div className="mt-4 flex items-center gap-2 text-indigo-600">
            <Volume2 size={18} className="animate-pulse" />
            <span className="text-sm font-medium">Đang phát...</span>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {currentPart.questions.map((q, idx) => {
          // Tính global index cho answer - để tránh bị trùng giữa các part
  const questionGlobalIdx = exam.sections.listening
    .slice(0, currentPartIndex)
    .reduce((acc, p) => acc + p.questions.length, 0) + currentPart.questions.indexOf(q);
          const currentAnswer = answers[questionGlobalIdx];

          return (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-600">
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{questionGlobalIdx + 1}.</span> {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswer(questionGlobalIdx, optIdx)}
                    className={`p-3 rounded-lg text-left transition-all border ${
                      currentAnswer === optIdx
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
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
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Phần trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {currentPartIndex < exam.sections.listening.length - 1 ? (
            <>Phần tiếp theo <ArrowRight size={18} /></>
          ) : (
            'Hoàn thành'
          )}
        </button>
      </div>
    </div>
  );
};