import React from 'react';
import { Trophy, CheckCircle, XCircle, RefreshCw, Home, Headphones, FileText, PenTool, Mic } from 'lucide-react';
import type { VSTEPExam, VSTEPScore as VSTEPScoreType } from '../types';

interface VSTEPScoreResultProps {
  exam: VSTEPExam;
  score: VSTEPScoreType;
  onRetake: () => void;
  onExit: () => void;
}

export const VSTEPScoreResult: React.FC<VSTEPScoreResultProps> = ({ exam, score, onRetake, onExit }) => {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      B1: 'from-green-500 to-emerald-600 shadow-green-500/20',
      B2: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
      C1: 'from-purple-500 to-violet-600 shadow-purple-500/20',
      C2: 'from-orange-500 to-red-600 shadow-orange-500/20'
    };
    return colors[level] || 'from-slate-500 to-slate-600 shadow-slate-500/20';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
          <div className="absolute inset-0.5 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full animate-pulse opacity-75"></div>
          <Trophy className="w-10 h-10 text-white relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Kết quả thi VSTEP</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cấp độ đề thi:</span>
          <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getLevelColor(exam.level)} text-white text-xs font-black shadow-md`}>
            VSTEP {exam.level}
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="text-center sm:text-left">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-extrabold uppercase tracking-wider">Band điểm ước lượng</p>
            <p className="text-6xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-1">{score.overall.band}</p>
          </div>
          <div className={`px-6 py-4 rounded-2xl text-center border font-black flex items-center gap-2 shadow-sm ${
            score.overall.passed
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          }`}>
            <span className="text-xl">
              {score.overall.passed ? '✓' : '✕'}
            </span>
            <span className="text-sm tracking-wider font-extrabold uppercase">
              {score.overall.passed ? 'ĐẠT CHUẨN ĐẦU RA' : 'CHƯA ĐẠT CHUẨN'}
            </span>
          </div>
        </div>

        {/* Section Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Listening */}
          <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <Headphones size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kỹ năng Nghe</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{score.listening.correct}</span>
                <span className="text-slate-400 text-sm font-bold">/{score.listening.total} câu</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                <span>Tỉ lệ chính xác</span>
                <span className="text-indigo-600 dark:text-indigo-400">{score.listening.score}%</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${score.listening.score}%` }}></div>
              </div>
            </div>
          </div>

          {/* Reading */}
          <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kỹ năng Đọc</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{score.reading.correct}</span>
                <span className="text-slate-400 text-sm font-bold">/{score.reading.total} câu</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                <span>Tỉ lệ chính xác</span>
                <span className="text-indigo-600 dark:text-indigo-400">{score.reading.score}%</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${score.reading.score}%` }}></div>
              </div>
            </div>
          </div>

          {/* Writing */}
          <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <PenTool size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kỹ năng Viết</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{score.writing.totalScore}</span>
                <span className="text-slate-400 text-sm font-bold">/30 điểm</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span>Điểm quy đổi</span>
                <span className="text-indigo-600 dark:text-indigo-400">{score.writing.totalScore}/30</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(score.writing.totalScore / 30) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Speaking */}
          <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <Mic size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kỹ năng Nói</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{score.speaking.totalScore}</span>
                <span className="text-slate-400 text-sm font-bold">/30 điểm</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span>Điểm quy đổi</span>
                <span className="text-indigo-600 dark:text-indigo-400">{score.speaking.totalScore}/30</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(score.speaking.totalScore / 30) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Feedback */}
      {(score.writing.task1.feedback || score.writing.task2.feedback) && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 shadow-sm transition-colors space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <PenTool size={18} className="text-indigo-550" />
            Nhận xét phần Viết (AI)
          </h3>
          <div className="border-t border-slate-100 dark:border-slate-850 w-full" />
          
          <div className="space-y-4">
            {score.writing.task1.feedback && (
              <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/15 dark:border-emerald-500/20 rounded-2xl transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">Task 1: {exam.sections.writing[0]?.taskType || 'Email'}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Điểm: {score.writing.task1.score}/15
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed whitespace-pre-line mt-3">{score.writing.task1.feedback}</p>
              </div>
            )}
            {score.writing.task2.feedback && (
              <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/15 dark:border-indigo-500/20 rounded-2xl transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">Task 2: {exam.sections.writing[1]?.taskType || 'Essay'}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Điểm: {score.writing.task2.score}/15
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed whitespace-pre-line mt-3">{score.writing.task2.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 rounded-2xl font-bold transition-all duration-300 active:scale-98 text-sm"
        >
          <RefreshCw size={16} />
          Làm lại đề thi này
        </button>
        <button
          onClick={onExit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 text-sm"
        >
          <Home size={16} />
          Quay về trang chủ
        </button>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-slate-400 dark:text-slate-500 text-[11px] font-semibold italic flex items-center justify-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></span>
        Kết quả thi và nhận xét được đánh giá tự động bởi hệ thống AI Gemini và chỉ mang tính tham khảo.
      </div>
    </div>
  );
};