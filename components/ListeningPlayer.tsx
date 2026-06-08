import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Volume2, Pause, Play, CheckCircle, XCircle, Clock, VolumeX } from 'lucide-react';
import type { VSTEPExam, AppSettings } from '../types';

interface ListeningPlayerProps {
  exam: VSTEPExam;
  onComplete: (answers: Record<number, number>) => void;
  onExit: () => void;
  settings?: AppSettings;
}

export const ListeningPlayer: React.FC<ListeningPlayerProps> = ({ 
  exam, 
  onComplete, 
  onExit,
  settings 
}) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 phút

  const currentPart = exam.sections.listening[currentPartIndex];
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Luôn giải phóng trạng thái pause trước khi hủy phát âm để tránh lock speech engine
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);

    if (currentPart?.transcript) {
      const utterance = new SpeechSynthesisUtterance(currentPart.transcript);
      utterance.lang = 'en-US';
      
      utterance.rate = (settings?.ttsRate ?? 0.9);
      utterance.pitch = (settings?.ttsPitch ?? 0.95); 

      const setBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        
        if (settings?.ttsVoiceName) {
          const userVoice = voices.find(v => v.name === settings.ttsVoiceName);
          if (userVoice) {
            utterance.voice = userVoice;
            return;
          }
        }

        const bestVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
        );

        const fallbackVoice = voices.find(v => v.lang === 'en-US');

        if (bestVoice) {
          utterance.voice = bestVoice;
        } else if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setBestVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setBestVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utteranceRef.current = utterance;
    }

    return () => {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    };
  }, [currentPartIndex, currentPart?.transcript, settings]);

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
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      // Đảm bảo giải phóng trạng thái pause trên Chrome trước khi phát mới hoặc tiếp tục
      window.speechSynthesis.resume();
      
      if (isPaused) {
        setIsPaused(false);
      } else {
        // Hủy phát âm hiện tại và phát lại từ đầu
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  };

  const allQuestions = exam.sections.listening.flatMap(p => p.questions);
  const answeredCount = Object.keys(answers).length;

  if (!currentPart) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <VolumeX size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Không có dữ liệu phần Nghe</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">Đề thi chưa có dữ liệu hợp lệ cho kỹ năng Nghe hoặc định dạng không đúng.</p>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 text-sm"
        >
          Bỏ qua & Chuyển sang phần tiếp theo
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-250 dark:border-slate-800 transition-colors">
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6">Kết quả phần thi Nghe</h2>

          <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2">
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
                      <XCircle className="text-rose-500 dark:text-rose-450 mt-0.5 flex-shrink-0" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 mb-3 leading-snug">Câu {idx + 1}: {q.question}</p>
                      <div className="space-y-1.5 text-xs md:text-sm">
                        <p className="text-slate-500 dark:text-slate-400">✓ Đáp án đúng: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{q.options[q.correctAnswer]}</span></p>
                        {userAnswer !== undefined && (
                          <p className="text-slate-500 dark:text-slate-400">✗ Lựa chọn của bạn: <span className={`font-extrabold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{q.options[userAnswer]}</span></p>
                        )}
                        {q.explanation && (
                          <div className="bg-white dark:bg-slate-900/60 p-3.5 rounded-xl mt-3 text-slate-500 dark:text-slate-400 text-xs italic border border-slate-200 dark:border-slate-800">
                            💡 Giải thích: {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 py-3.5 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-2xl font-bold transition-all duration-300 text-xs active:scale-95"
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
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <style>{`
        @keyframes bounceBar {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .animate-bar-1 { animation: bounceBar 0.8s ease-in-out infinite; }
        .animate-bar-2 { animation: bounceBar 0.8s ease-in-out infinite 0.15s; }
        .animate-bar-3 { animation: bounceBar 0.8s ease-in-out infinite 0.3s; }
        .animate-bar-4 { animation: bounceBar 0.8s ease-in-out infinite 0.45s; }
      `}</style>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl py-2.5 px-4 shadow-sm border border-slate-250 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              ✕
            </button>
            <h2 className="text-base md:text-lg font-black text-slate-800 dark:text-white">
              Nghe - Part {currentPart.partNumber}
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

      {/* Instructions */}
      <div className="bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/15 dark:border-indigo-500/20 rounded-2xl p-4 text-xs md:text-sm">
        <p className="text-indigo-850 dark:text-indigo-350 font-bold flex items-center gap-2 leading-relaxed">
          <span>🔊</span> 
          <span><strong>Hướng dẫn:</strong> {currentPart.instructions}</span>
        </p>
      </div>

      {/* Media Player Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-250 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-90 ${
                isPlaying 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/20'
              }`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div>
              <h4 className="text-sm font-black text-slate-700 dark:text-slate-300">Bản ghi âm giả lập (AI)</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic mt-0.5">
                {isPlaying ? 'Đang phát Audio thi thử...' : 'Nhấn nút để bắt đầu phát Audio'}
              </p>
            </div>
          </div>

          {/* Bouncing Audio Visualizer */}
          <div className="flex items-end gap-1.5 h-7 px-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 w-24 justify-center">
            {isPlaying ? (
              <>
                <div className="w-1 bg-indigo-500 rounded-full animate-bar-1"></div>
                <div className="w-1 bg-indigo-500 rounded-full animate-bar-2"></div>
                <div className="w-1 bg-indigo-500 rounded-full animate-bar-3"></div>
                <div className="w-1 bg-indigo-500 rounded-full animate-bar-4"></div>
              </>
            ) : (
              <>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Transcript Box */}
        <div className="bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs md:text-sm font-medium">
            {currentPart.transcript || 'Audio đang được chuẩn bị phát...'}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {currentPart.questions.map((q, idx) => {
          const questionGlobalIdx = exam.sections.listening
            .slice(0, currentPartIndex)
            .reduce((acc, p) => acc + p.questions.length, 0) + currentPart.questions.indexOf(q);
          const currentAnswer = answers[questionGlobalIdx];

          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-250 dark:border-slate-800 shadow-sm transition-colors space-y-4">
              <p className="font-extrabold text-slate-800 dark:text-slate-200 leading-snug text-sm md:text-base">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-black">{questionGlobalIdx + 1}.</span> 
                {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  const isSelected = currentAnswer === optIdx;
                  
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(questionGlobalIdx, optIdx)}
                      className={`py-2 px-3.5 rounded-xl text-left text-xs md:text-sm font-semibold transition-all duration-300 border flex items-center gap-3 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/10'
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

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPartIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-655 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs active:scale-95"
        >
          <ArrowLeft size={16} />
          Phần trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs"
        >
          {currentPartIndex < exam.sections.listening.length - 1 ? (
            <>Tiếp tục phần sau <ArrowRight size={16} /></>
          ) : (
            'Nộp bài phần thi Nghe'
          )}
        </button>
      </div>
    </div>
  );
};