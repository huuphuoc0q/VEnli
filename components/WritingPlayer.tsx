import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Clock, Send, Loader2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { VSTEPExam, VSTEPWritingTask, VSTEPWritingSubmission, VSTEPWritingFeedback } from '../types';
import { gradeWritingTask } from '../services/vstepService';

interface WritingPlayerProps {
  exam: VSTEPExam;
  onComplete: (submissions: VSTEPWritingSubmission[], feedbacks: VSTEPWritingFeedback[]) => void;
  onExit: () => void;
}

export const WritingPlayer: React.FC<WritingPlayerProps> = ({ exam, onComplete, onExit }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [submissions, setSubmissions] = useState<VSTEPWritingSubmission[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  const [feedbacks, setFeedbacks] = useState<VSTEPWritingFeedback[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const currentTask: VSTEPWritingTask = exam.sections.writing[currentTaskIndex];

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

  const wordCount = currentContent.split(/\s+/).filter(w => w.length > 0).length;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
    // Auto-resize
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  };

  const handleSaveDraft = () => {
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    if (existingIndex >= 0) {
      // Update existing
      const updated = [...submissions];
      updated[existingIndex] = {
        taskId: currentTaskIndex,
        content: currentContent,
        wordCount,
        submittedAt: Date.now()
      };
      setSubmissions(updated);
    } else {
      // Add new
      setSubmissions(prev => [...prev, {
        taskId: currentTaskIndex,
        content: currentContent,
        wordCount,
        submittedAt: Date.now()
      }]);
    }
  };

  const handleNext = async () => {
    // Save current draft first
    handleSaveDraft();

    if (currentTaskIndex < exam.sections.writing.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      // Load saved content if exists
      const saved = submissions.find(s => s.taskId === currentTaskIndex + 1);
      setCurrentContent(saved?.content || '');
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    // Save current draft first
    handleSaveDraft();

    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      // Load saved content
      const saved = submissions.find(s => s.taskId === currentTaskIndex - 1);
      setCurrentContent(saved?.content || '');
    }
  };

  const handleFinish = async () => {
    setIsGrading(true);

    try {
      // Grade both tasks
      const task1Submission = submissions.find(s => s.taskId === 0)?.content || '';
      const task2Submission = submissions.find(s => s.taskId === 1)?.content || '';

      const results: VSTEPWritingFeedback[] = [];

      if (task1Submission) {
        const result1 = await gradeWritingTask(exam.sections.writing[0], task1Submission);
        results.push(result1.feedback);
      } else {
        results.push({
          score: 0,
          feedback: 'Chưa nộp bài',
          strengths: [],
          improvements: [],
          bandEstimate: 'N/A'
        });
      }

      if (task2Submission) {
        const result2 = await gradeWritingTask(exam.sections.writing[1], task2Submission);
        results.push(result2.feedback);
      } else {
        results.push({
          score: 0,
          feedback: 'Chưa nộp bài',
          strengths: [],
          improvements: [],
          bandEstimate: 'N/A'
        });
      }

      setFeedbacks(results);
      setShowResult(true);
    } catch (error) {
      console.error('Lỗi chấm điểm:', error);
      // Show results anyway without AI feedback
      setFeedbacks([
        { score: 0, feedback: 'Lỗi chấm điểm', strengths: [], improvements: [], bandEstimate: 'N/A' },
        { score: 0, feedback: 'Lỗi chấm điểm', strengths: [], improvements: [], bandEstimate: 'N/A' }
      ]);
      setShowResult(true);
    } finally {
      setIsGrading(false);
    }
  };

  const handleSubmit = () => {
    onComplete(submissions, feedbacks);
  };

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Kết quả phần Viết</h2>

          {isGrading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Đang chấm điểm bằng AI...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Task {idx + 1}: {exam.sections.writing[idx].taskType}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{fb.score}</span>
                      <span className="text-slate-500 dark:text-slate-400">/15</span>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 mb-3">{fb.feedback}</p>

                  {fb.strengths.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-green-600 mb-1">✓ Điểm mạnh:</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {fb.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fb.improvements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">⚠ Cần cải thiện:</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {fb.improvements.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-orange-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isGrading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors mt-6 disabled:opacity-50"
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
              Phần Viết - Task {currentTaskIndex + 1}: {currentTask.taskType}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Task {currentTaskIndex + 1}/{exam.sections.writing.length}
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

      {/* Task */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <FileText className="text-indigo-600 dark:text-indigo-400 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{currentTask.taskType}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{currentTask.requirements}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <p className="text-green-700 font-medium">
            Giới hạn từ: {currentTask.wordLimit} từ
          </p>
          <p className="text-sm text-green-600 mt-1">
            Số từ hiện tại: <span className={`font-semibold ${wordCount > currentTask.wordLimit ? 'text-red-600' : wordCount >= currentTask.wordLimit * 0.8 ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'}`}>
              {wordCount}
            </span>
          </p>
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <textarea
          ref={textAreaRef}
          value={currentContent}
          onChange={handleContentChange}
          placeholder="Viết bài của bạn ở đây..."
          className="w-full min-h-[300px] p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 dark:text-slate-300 leading-relaxed"
        />

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
          >
            💾 Lưu nháp
          </button>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {wordCount} / {currentTask.wordLimit} từ
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentTaskIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Task trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {currentTaskIndex < exam.sections.writing.length - 1 ? (
            <>Task tiếp theo <ArrowRight size={18} /></>
          ) : (
            <>Hoàn thành & Chấm điểm <Send size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};