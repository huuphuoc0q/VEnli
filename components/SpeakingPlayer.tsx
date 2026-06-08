import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Clock, Mic, Volume2, Lightbulb, CheckCircle, Play, Pause } from 'lucide-react';
import type { VSTEPExam, VSTEPSpeakingTask, VSTEPSpeakingSubmission } from '../types';

interface SpeakingPlayerProps {
  exam: VSTEPExam;
  onComplete: (submissions: VSTEPSpeakingSubmission[]) => void;
  onExit: () => void;
}

export const SpeakingPlayer: React.FC<SpeakingPlayerProps> = ({ exam, onComplete, onExit }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [submissions, setSubmissions] = useState<VSTEPSpeakingSubmission[]>([]);
  const [notes, setNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<'prep' | 'response'>('prep');
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentTask: VSTEPSpeakingTask = exam.sections.speaking[currentTaskIndex];

  // Timer for preparation and response
  useEffect(() => {
    if (timeLeft <= 0) {
      if (phase === 'prep') {
        setPhase('response');
        setTimeLeft(currentTask.responseTime * 60);
      } else {
        handleNext();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, phase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startResponse = () => {
    setPhase('response');
    setTimeLeft(currentTask.responseTime * 60);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Save submission
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    const newSubmission: VSTEPSpeakingSubmission = {
      taskId: currentTaskIndex,
      responseText: notes,
      submittedAt: Date.now()
    };

    if (existingIndex >= 0) {
      const updated = [...submissions];
      updated[existingIndex] = newSubmission;
      setSubmissions(updated);
    } else {
      setSubmissions(prev => [...prev, newSubmission]);
    }
  };

  const handleNext = () => {
    setIsRecording(false);
    handleStopRecording();

    if (currentTaskIndex < exam.sections.speaking.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setNotes('');
      setPhase('prep');
      setTimeLeft(0);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      const saved = submissions.find(s => s.taskId === currentTaskIndex - 1);
      setNotes(saved?.responseText || '');
      setPhase('response');
      setTimeLeft(0);
    }
  };

  const handleSubmit = () => {
    onComplete(submissions);
  };

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Kết quả phần thi Nói</h2>

          <div className="space-y-4">
            {exam.sections.speaking.map((task, idx) => {
              const submission = submissions.find(s => s.taskId === idx);
              return (
                <div key={idx} className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-slate-700 dark:text-slate-350 text-sm">Part {idx + 1}: {task.taskType}</h3>
                    {submission ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                        <CheckCircle size={14} /> Đã nộp
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-150 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg">Chưa nộp</span>
                    )}
                  </div>
                  {submission && (
                    <div className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-colors">
                      <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Ghi chú của bạn:</p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line font-medium leading-relaxed">{submission.responseText || '(Không có ghi chú)'}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="mt-6 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-550/15 dark:border-amber-550/20 rounded-2xl p-5 text-sm">
            <h4 className="font-extrabold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
              <Lightbulb size={18} />
              Mẹo nói điểm cao:
            </h4>
            <ul className="text-xs md:text-sm text-amber-700 dark:text-amber-300/90 space-y-2 font-medium leading-relaxed">
              <li className="flex items-start gap-2"><span>•</span> <span>Phát âm to, rõ ràng và giữ nhịp độ nói tự nhiên, tránh ngắc ngứ.</span></li>
              <li className="flex items-start gap-2"><span>•</span> <span>Không trả lời quá ngắn (như "yes/no"), hãy mở rộng ý bằng cách thêm thông tin phụ hoặc giải thích.</span></li>
              <li className="flex items-start gap-2"><span>•</span> <span>Sử dụng từ vựng đa dạng và các liên từ kết nối câu chặt chẽ.</span></li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 text-sm mt-6"
          >
            Xem kết quả tổng kết
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl py-2.5 px-4 shadow-sm border border-slate-150 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              ✕
            </button>
            <h2 className="text-base md:text-lg font-black text-slate-800 dark:text-white">
              Nói - Part {currentTaskIndex + 1}/{exam.sections.speaking.length}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft > 0 && (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-colors ${
                timeLeft < 30 
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                  : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-350 border-slate-200/50 dark:border-slate-850'
              }`}>
                <Clock size={14} className={timeLeft < 30 ? 'animate-pulse' : ''} />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase indicator tabs */}
      <div className="flex gap-4">
        <div className={`flex-1 p-3 rounded-2xl border text-center transition-all duration-300 ${
          phase === 'prep' 
            ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-indigo-500/35 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-500/5' 
            : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-650'
        }`}>
          <p className="font-black text-xs uppercase tracking-wider mb-0.5">Chuẩn bị ý tưởng</p>
          <p className="text-xs font-bold opacity-80">{currentTask.preparationTime} phút</p>
        </div>
        <div className={`flex-1 p-3 rounded-2xl border text-center transition-all duration-300 ${
          phase === 'response' 
            ? 'bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/35 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5' 
            : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-650'
        }`}>
          <p className="font-black text-xs uppercase tracking-wider mb-0.5">Trả lời chính thức</p>
          <p className="text-xs font-bold opacity-80">{currentTask.responseTime} phút</p>
        </div>
      </div>

      {/* Task Info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4.5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Mic size={24} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800 dark:text-white leading-snug">{currentTask.taskType}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed whitespace-pre-line font-medium">{currentTask.instructions}</p>
          </div>
        </div>

        {/* Tips */}
        {currentTask.tips && currentTask.tips.length > 0 && (
          <div className="bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/15 dark:border-amber-500/20 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Lightbulb size={16} />
              <span>Gợi ý cách nói</span>
            </div>
            <ul className="text-xs md:text-sm text-slate-600 dark:text-slate-350 space-y-1 font-medium leading-relaxed">
              {currentTask.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Response */}
        {currentTask.sampleResponse && (
          <div className="bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/15 dark:border-indigo-500/20 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
              <Volume2 size={16} />
              <span>Bài nói mẫu tham khảo</span>
            </div>
            <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">{currentTask.sampleResponse}</p>
          </div>
        )}
      </div>

      {/* Preparation/Response Area */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        {phase === 'prep' ? (
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Nháp nhanh ý tưởng:</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi lại các từ khóa, ý chính..."
              className="w-full h-32 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:ring-4 focus:ring-indigo-150 dark:focus:ring-indigo-900/40 focus:border-indigo-500 transition-all font-medium leading-relaxed text-sm"
            />
            <button
              onClick={startResponse}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Mic size={18} />
              Bắt đầu ghi âm bài nói
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-150 dark:border-slate-850">
              {/* Record Button Pulse */}
              <div className="relative flex items-center justify-center mb-2">
                {isRecording && (
                  <span className="absolute w-14 h-14 rounded-full bg-red-500/20 animate-ping"></span>
                )}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-90 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                      : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                  }`}
                >
                  {isRecording ? <Pause size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {isRecording ? 'Đang ghi âm...' : 'Đã tạm dừng'}
              </p>
            </div>

            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Viết lại bài nói:</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gõ lại nội dung bài nói tại đây..."
              className="w-full h-32 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:ring-4 focus:ring-indigo-150 dark:focus:ring-indigo-900/40 focus:border-indigo-500 transition-all font-medium leading-relaxed text-sm"
            />

            <button
              onClick={handleStopRecording}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-550 to-indigo-650 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md active:scale-98 transition-all text-sm"
            >
              Lưu bài nói & Đóng ghi âm
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentTaskIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-slate-250 dark:border-slate-850 text-slate-650 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs active:scale-95"
        >
          <ArrowLeft size={16} />
          Part trước
        </button>
        <button
          onClick={handleNext}
          disabled={phase === 'prep'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentTaskIndex < exam.sections.speaking.length - 1 ? (
            <>Tiếp tục Part tiếp theo <ArrowRight size={16} /></>
          ) : (
            'Hoàn thành phần thi Nói'
          )}
        </button>
      </div>
    </div>
  );
};