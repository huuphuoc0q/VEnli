import React from 'react';
import { Trophy, CheckCircle, XCircle, Star, RefreshCw, Home, FileText, Headphones, PenTool, Mic } from 'lucide-react';
import type { VSTEPExam, VSTEPScore as VSTEPScoreType, VSTEPWritingFeedback } from '../types';

interface VSTEPScoreResultProps {
  exam: VSTEPExam;
  score: VSTEPScoreType;
  onRetake: () => void;
  onExit: () => void;
}

export const VSTEPScoreResult: React.FC<VSTEPScoreResultProps> = ({ exam, score, onRetake, onExit }) => {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      B1: 'bg-green-500',
      B2: 'bg-blue-500',
      C1: 'bg-purple-500',
      C2: 'bg-orange-500'
    };
    return colors[level] || 'bg-slate-50 dark:bg-slate-7000';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Kết quả thi VSTEP</h2>
        <p className="text-slate-500 dark:text-slate-400">Cấp độ: <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getLevelColor(exam.level)}`}>{exam.level}</span></p>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Band điểm</p>
            <p className="text-4xl font-bold text-indigo-600">{score.overall.band}</p>
          </div>
          <div className={`px-6 py-3 rounded-xl ${
            score.overall.passed
              ? 'bg-green-100 text-green-700 border-2 border-green-500'
              : 'bg-red-100 text-red-700 border-2 border-red-500'
          }`}>
            <p className="text-lg font-bold">
              {score.overall.passed ? '✓ ĐẠT CHUẨN' : '✕ CHƯA ĐẠT'}
            </p>
          </div>
        </div>

        {/* Section Scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* Listening */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Headphones size={20} className="text-indigo-600" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nghe</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {score.listening.correct}/{score.listening.total}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{score.listening.score}%</p>
          </div>

          {/* Reading */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={20} className="text-indigo-600" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Đọc</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {score.reading.correct}/{score.reading.total}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{score.reading.score}%</p>
          </div>

          {/* Writing */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <PenTool size={20} className="text-indigo-600" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Viết</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {score.writing.totalScore}/30
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Task 1: {score.writing.task1.score}/15 | Task 2: {score.writing.task2.score}/15
            </p>
          </div>

          {/* Speaking */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Mic size={20} className="text-indigo-600" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nói</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {score.speaking.totalScore}/30
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tự đánh giá: {score.speaking.task1} | {score.speaking.task2} | {score.speaking.task3}
            </p>
          </div>
        </div>
      </div>

      {/* Writing Feedback */}
      {(score.writing.task1.feedback || score.writing.task2.feedback) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PenTool size={20} className="text-indigo-600" />
            Nhận xét phần Viết (AI)
          </h3>
          <div className="space-y-4">
            {score.writing.task1.feedback && (
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="font-medium text-green-800">Task 1: {exam.sections.writing[0]?.taskType}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{score.writing.task1.feedback}</p>
              </div>
            )}
            {score.writing.task2.feedback && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-medium text-blue-800">Task 2: {exam.sections.writing[1]?.taskType}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{score.writing.task2.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
        >
          <RefreshCw size={18} />
          Làm lại đề
        </button>
        <button
          onClick={onExit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          <Home size={18} />
          Về trang chủ
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-slate-400 text-sm mt-6">
        * Đây là đề thi thử do AI tạo. Kết quả chỉ mang tính tham khảo.
      </p>
    </div>
  );
};