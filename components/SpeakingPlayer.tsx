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

  const startPreparation = () => {
    setTimeLeft(currentTask.preparationTime * 60);
    setPhase('prep');
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

    // Save current
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Kết quả phần Nói</h2>

          <div className="space-y-4">
            {exam.sections.speaking.map((task, idx) => {
              const submission = submissions.find(s => s.taskId === idx);
              return (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Part {idx + 1}: {task.taskType}</h3>
                    {submission ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} /> Đã nộp
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Chưa nộp</span>
                    )}
                  </div>
                  {submission && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Ghi chú của bạn:</p>
                      <p className="text-slate-800 dark:text-slate-100">{submission.responseText || '(Không có ghi chú)'}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Mẹo để đạt điểm cao:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Phát âm rõ ràng, ngữ điệu tự nhiên</li>
              <li>• Trả lời đủ ý, không quá ngắn</li>
              <li>• Sử dụng từ vựng và cấu trúc đa dạng</li>
              <li>• Kết nối các câu mạch lạc</li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors mt-6"
          >
            Xem kết quả tổng
          </button>
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
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Phần Nói - Part {currentTaskIndex + 1}: {currentTask.taskType}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Part {currentTaskIndex + 1}/{exam.sections.speaking.length}
            </span>
            {timeLeft > 0 && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                timeLeft < 30 ? 'bg-red-100 text-red-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <Clock size={16} />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-4 mb-6">
        <div className={`flex-1 p-4 rounded-xl text-center ${
          phase === 'prep' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-green-100'
        }`}>
          <p className="font-medium text-blue-800">Chuẩn bị</p>
          <p className="text-sm text-blue-600">{currentTask.preparationTime} phút</p>
        </div>
        <div className={`flex-1 p-4 rounded-xl text-center ${
          phase === 'response' ? 'bg-green-100 border-2 border-green-500' : 'bg-slate-100 dark:bg-slate-700'
        }`}>
          <p className="font-medium text-green-800">Trả lời</p>
          <p className="text-sm text-green-600">{currentTask.responseTime} phút</p>
        </div>
      </div>

      {/* Task Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-start gap-4">
          <Mic className="text-indigo-600 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{currentTask.taskType}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{currentTask.instructions}</p>
          </div>
        </div>

        {/* Tips */}
        {currentTask.tips && currentTask.tips.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-yellow-600" />
              <span className="font-medium text-yellow-800">Mẹo</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {currentTask.tips.map((tip, idx) => (
                <li key={idx}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Response */}
        {currentTask.sampleResponse && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={18} className="text-blue-600" />
              <span className="font-medium text-blue-800">Mẫu câu trả lời</span>
            </div>
            <p className="text-sm text-blue-700">{currentTask.sampleResponse}</p>
          </div>
        )}
      </div>

      {/* Preparation/Response Area */}
      {phase === 'prep' ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Chuẩn bị ý tưởng của bạn (không trả lời to):</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú ngắn gọn ý tưởng của bạn..."
            className="w-full h-40 p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
          />
          <button
            onClick={startResponse}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors mt-4"
          >
            Bắt đầu trả lời
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600 dark:text-slate-400">
              {isRecording ? 'Đang ghi âm... Hãy nói to rõ ràng' : 'Ghi âm đã dừng'}
            </p>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isRecording
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isRecording ? <><Pause size={18} /> Dừng</> : <><Play size={18} /> Bắt đầu</>}
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi lại câu trả lời của bạn (hoặc ghi chú nhanh)..."
            className="w-full h-40 p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
          />

          <button
            onClick={handleStopRecording}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors mt-4"
          >
            Hoàn thành & Nộp bài
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentTaskIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Part trước
        </button>
        <button
          onClick={handleNext}
          disabled={phase === 'prep'}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentTaskIndex < exam.sections.speaking.length - 1 ? (
            <>Part tiếp theo <ArrowRight size={18} /></>
          ) : (
            'Hoàn thành'
          )}
        </button>
      </div>
    </div>
  );
};