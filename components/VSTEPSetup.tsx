import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2, FileText, Headphones, PenTool, Mic, RefreshCw, Clock, Keyboard } from 'lucide-react';
import type { VSTEPLevel, VSTEPExam } from '../types';
import { generateVSTEPExam, loadExamFromStorage, hasCachedExam, clearCachedExam } from '../services/vstepService';
import { ManualVSTEPSetup } from './ManualVSTEPSetup';

interface VSTEPSetupProps {
  onBack: () => void;
  onStartExam: (exam: VSTEPExam) => void;
}

export const VSTEPSetup: React.FC<VSTEPSetupProps> = ({ onBack, onStartExam }) => {
  const [selectedLevel, setSelectedLevel] = useState<VSTEPLevel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedExam, setCachedExam] = useState<VSTEPExam | null>(null);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    // Kiểm tra đề đã lưu
    const saved = loadExamFromStorage();
    if (saved) {
      setCachedExam(saved);
      setSelectedLevel(saved.level);
    }
  }, []);

  const levels: { level: VSTEPLevel; label: string; desc: string; color: string }[] = [
    { level: 'B1', label: 'B1 - Threshold', desc: 'Có thể hiểu các vấn đề quen thuộc, giao tiếp trong công việc và cuộc sống hàng ngày.', color: 'bg-green-500' },
    { level: 'B2', label: 'B2 - Vantage', desc: 'Có thể tương tác lưu loát với người bản ngữ, thảo luận các chủ đề trừu tượng.', color: 'bg-blue-500' },
    { level: 'C1', label: 'C1 - Advanced', desc: 'Có thể diễn đạt linh hoạt, hiểu nội dung phức tạp, sử dụng ngôn ngữ chuyên sâu.', color: 'bg-purple-500' },
    { level: 'C2', label: 'C2 - Proficiency', desc: 'Hiểu hoàn toàn mọi loại ngôn ngữ, diễn đạt tự nhiên như người bản ngữ.', color: 'bg-orange-500' }
  ];

  const handleGenerate = async () => {
    if (!selectedLevel) return;

    setIsGenerating(true);
    setError(null);

    try {
      const exam = await generateVSTEPExam(selectedLevel);
      onStartExam(exam);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đề thi');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseCached = () => {
    if (cachedExam) {
      onStartExam(cachedExam);
    }
  };

  const handleDeleteCached = () => {
    clearCachedExam();
    setCachedExam(null);
    setSelectedLevel(null);
  };

  const examStructure = [
    { icon: Headphones, label: 'Nghe', time: '45 phút', parts: '2 phần, 20-24 câu' },
    { icon: FileText, label: 'Đọc', time: '60 phút', parts: '3 phần, 40-44 câu' },
    { icon: PenTool, label: 'Viết', time: '60 phút', parts: '2 bài viết' },
    { icon: Mic, label: 'Nói', time: '12 phút', parts: '3 phần' }
  ];

  // Format ngày tạo đề
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show manual input mode
  if (manualMode) {
    return (
      <ManualVSTEPSetup
        onBack={() => setManualMode(false)}
        onStartExam={onStartExam}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Thi thử VSTEP</h2>
          <p className="text-slate-500 dark:text-slate-400">Chọn cấp độ và bắt đầu làm bài</p>
        </div>
      </div>

      {/* Cached exam notice */}
      {cachedExam && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Đề đã lưu (không cần API)</p>
                <p className="text-sm text-amber-600">
                  Cấp độ: {cachedExam.level} | Tạo lúc: {formatDate(cachedExam.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteCached}
              className="text-amber-600 hover:text-amber-800 text-sm"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Cấu trúc thi */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Cấu trúc đề thi VSTEP</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {examStructure.map((item) => (
            <div key={item.label} className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <item.icon className="w-8 h-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
              <p className="font-semibold text-slate-800 dark:text-slate-100">{item.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{item.parts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chọn cấp độ */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Chọn cấp độ mong muốn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((item) => (
            <button
              key={item.level}
              onClick={() => setSelectedLevel(item.level)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedLevel === item.level
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.label}</span>
                {selectedLevel === item.level && (
                  <Check size={18} className="ml-auto text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-4 mt-8">
        {/* Nút dùng đề cũ (nếu có) */}
        {cachedExam && (
          <button
            onClick={handleUseCached}
            className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <RefreshCw size={18} className="animate-pulse" />
            Tiếp tục đề cũ (Miễn phí - Không cần API)
          </button>
        )}

        {/* Nút tạo đề mới */}
        <button
          onClick={handleGenerate}
          disabled={!selectedLevel || isGenerating}
          className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.99] ${
            selectedLevel && !isGenerating
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800/50'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-white" size={18} />
              Đang tạo đề thi mới...
            </span>
          ) : (
            'Tạo đề thi mới'
          )}
        </button>

        <div className="flex items-center justify-center gap-2 py-1">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Hoặc</span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
        </div>

        {/* Button to switch to manual input */}
        <button
          onClick={() => setManualMode(true)}
          className="w-full py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-xs hover:scale-[1.01] active:scale-[0.99]"
        >
          <Keyboard size={16} />
          Hoặc nhập JSON thủ công
        </button>
      </div>

      <p className="text-center text-slate-450 dark:text-slate-500 text-xs font-semibold italic mt-4">
        Đề thi sẽ được lưu để dùng lại sau (không tốn API)
      </p>
    </div>
  );
};