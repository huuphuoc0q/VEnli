import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Clock, Send, Loader2, FileText, CheckCircle, AlertCircle, Save } from 'lucide-react';
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

  const wordCount = currentContent.trim() === '' ? 0 : currentContent.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
  };

  const handleSaveDraft = () => {
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    const draftData = {
      taskId: currentTaskIndex,
      content: currentContent,
      wordCount,
      submittedAt: Date.now()
    };

    if (existingIndex >= 0) {
      const updated = [...submissions];
      updated[existingIndex] = draftData;
      setSubmissions(updated);
    } else {
      setSubmissions(prev => [...prev, draftData]);
    }
    alert("Đã lưu bản nháp thành công!");
  };

  const handleNext = () => {
    // Silent draft save
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    const draftData = {
      taskId: currentTaskIndex,
      content: currentContent,
      wordCount,
      submittedAt: Date.now()
    };

    let updatedSubmissions = [...submissions];
    if (existingIndex >= 0) {
      updatedSubmissions[existingIndex] = draftData;
    } else {
      updatedSubmissions.push(draftData);
    }
    setSubmissions(updatedSubmissions);

    if (currentTaskIndex < exam.sections.writing.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      const saved = updatedSubmissions.find(s => s.taskId === currentTaskIndex + 1);
      setCurrentContent(saved?.content || '');
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    // Silent draft save
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    const draftData = {
      taskId: currentTaskIndex,
      content: currentContent,
      wordCount,
      submittedAt: Date.now()
    };

    let updatedSubmissions = [...submissions];
    if (existingIndex >= 0) {
      updatedSubmissions[existingIndex] = draftData;
    } else {
      updatedSubmissions.push(draftData);
    }
    setSubmissions(updatedSubmissions);

    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      const saved = updatedSubmissions.find(s => s.taskId === currentTaskIndex - 1);
      setCurrentContent(saved?.content || '');
    }
  };

  const handleFinish = async () => {
    // Silent draft save for last element
    const existingIndex = submissions.findIndex(s => s.taskId === currentTaskIndex);
    const draftData = {
      taskId: currentTaskIndex,
      content: currentContent,
      wordCount,
      submittedAt: Date.now()
    };

    let updatedSubmissions = [...submissions];
    if (existingIndex >= 0) {
      updatedSubmissions[existingIndex] = draftData;
    } else {
      updatedSubmissions.push(draftData);
    }
    setSubmissions(updatedSubmissions);

    setIsGrading(true);
    setShowResult(true);

    try {
      const task1Submission = updatedSubmissions.find(s => s.taskId === 0)?.content || '';
      const task2Submission = updatedSubmissions.find(s => s.taskId === 1)?.content || '';

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
    } catch (error) {
      console.error('Lỗi chấm điểm:', error);
      setFeedbacks([
        { score: 0, feedback: 'Có lỗi xảy ra khi chấm điểm Task 1.', strengths: [], improvements: [], bandEstimate: 'N/A' },
        { score: 0, feedback: 'Có lỗi xảy ra khi chấm điểm Task 2.', strengths: [], improvements: [], bandEstimate: 'N/A' }
      ]);
    } finally {
      setIsGrading(false);
    }
  };

  const handleSubmit = () => {
    onComplete(submissions, feedbacks);
  };

  const progressPercentage = Math.min((wordCount / currentTask.wordLimit) * 100, 100);

  const getProgressColor = () => {
    if (wordCount === 0) return 'bg-slate-200 dark:bg-slate-800';
    if (wordCount < currentTask.wordLimit * 0.5) return 'bg-rose-500';
    if (wordCount < currentTask.wordLimit * 0.8) return 'bg-amber-500';
    if (wordCount <= currentTask.wordLimit * 1.25) return 'bg-emerald-500';
    return 'bg-rose-500'; // Too long
  };

  const getProgressLabelColor = () => {
    if (wordCount === 0) return 'text-slate-400 dark:text-slate-500';
    if (wordCount < currentTask.wordLimit * 0.5) return 'text-rose-600 dark:text-rose-455';
    if (wordCount < currentTask.wordLimit * 0.8) return 'text-amber-600 dark:text-amber-455';
    if (wordCount <= currentTask.wordLimit * 1.25) return 'text-emerald-600 dark:text-emerald-455';
    return 'text-rose-600 dark:text-rose-455';
  };

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Kết quả phần thi Viết</h2>

          {isGrading ? (
            <div className="text-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-indigo-600 dark:text-indigo-400" />
              <div className="space-y-1">
                <p className="font-extrabold text-slate-800 dark:text-slate-200">Đang chấm điểm bằng AI...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold italic">Giám khảo AI đang phân tích từ vựng, ngữ pháp và nội dung bài viết của bạn.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl transition-colors space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                      Task {idx + 1}: {exam.sections.writing[idx].taskType}
                    </h3>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Điểm: {fb.score}/15
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line font-medium">{fb.feedback}</p>

                  {fb.strengths && fb.strengths.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-2">
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">✓ Điểm mạnh:</p>
                      <ul className="text-xs md:text-sm text-slate-550 dark:text-slate-400 space-y-1 font-medium leading-relaxed">
                        {fb.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fb.improvements && fb.improvements.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-2">
                      <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">⚠ Cần cải thiện:</p>
                      <ul className="text-xs md:text-sm text-slate-550 dark:text-slate-400 space-y-1 font-medium leading-relaxed">
                        {fb.improvements.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{s}</span>
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
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 text-sm mt-6 disabled:opacity-50"
          >
            Xem kết quả tổng kết
          </button>
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
              Viết - Task {currentTaskIndex + 1}/{exam.sections.writing.length}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">
              Task {currentTaskIndex + 1}/{exam.sections.writing.length}
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

      {/* Split Screen Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Writing Prompt */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-4.5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors md:h-[calc(100vh-9.5rem)] md:overflow-y-auto no-scrollbar space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-450 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg text-slate-800 dark:text-white leading-snug">{currentTask.taskType}</h3>
              <p className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mt-0.5">Đề bài & Yêu cầu</p>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-850 w-full" />
          <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
            {currentTask.requirements}
          </p>
        </div>

        {/* Right column: Text Editor Area */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-4.5 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors md:h-[calc(100vh-9.5rem)] md:overflow-y-auto no-scrollbar space-y-4 flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            {/* Word Goal Progress Tracker */}
            <div className="bg-slate-50 dark:bg-slate-950/30 rounded-xl py-2 px-3.5 border border-slate-150 dark:border-slate-850 transition-colors">
              <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">Tiến trình viết từ</span>
                <span className={`${getProgressLabelColor()}`}>
                  {wordCount} / {currentTask.wordLimit} từ
                </span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden mb-1">
                <div className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`} style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic">
                {wordCount < currentTask.wordLimit * 0.8 
                  ? 'Hãy tiếp tục viết để đạt ít nhất 80% độ dài quy định.' 
                  : wordCount <= currentTask.wordLimit * 1.25 
                  ? 'Độ dài bài viết lý tưởng! Cố gắng trau chuốt cấu trúc.' 
                  : 'Bài viết đang hơi dài so với mục tiêu. Hãy rút gọn ý.'}
              </p>
            </div>

            {/* Main Input Textarea */}
            <textarea
              ref={textAreaRef}
              value={currentContent}
              onChange={handleContentChange}
              placeholder="Nhập nội dung câu trả lời chính thức của bạn tại đây..."
              className="w-full h-72 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:ring-4 focus:ring-indigo-150 dark:focus:ring-indigo-900/40 focus:border-indigo-500 transition-all font-medium leading-relaxed text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 mt-2">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-450 hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-all active:scale-95"
            >
              <Save size={14} />
              <span>Lưu bản nháp</span>
            </button>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic">Tự động sao lưu nháp khi đổi Task</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentTaskIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-slate-250 dark:border-slate-850 text-slate-655 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs active:scale-95"
        >
          <ArrowLeft size={16} />
          Task trước
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs"
        >
          {currentTaskIndex < exam.sections.writing.length - 1 ? (
            <>Tiếp tục Task sau <ArrowRight size={16} /></>
          ) : (
            <>Nộp bài & Chấm điểm Viết <Send size={14} className="ml-1" /></>
          )}
        </button>
      </div>
    </div>
  );
};