import React from 'react';
import { WordEntry, AppSettings } from '../types';
import { Volume2, Trash2, Clock, CheckCircle, Pencil } from 'lucide-react';
import { speak } from '../services/ttsService';

interface VocabCardProps {
  entry: WordEntry;
  onDelete: (id: string) => void;
  onEdit?: (entry: WordEntry) => void;
  settings?: AppSettings;
  onAwardXP?: (xp: number) => void;
}

export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete, onEdit, settings, onAwardXP }) => {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(entry.word, {
      ttsRate: settings?.ttsRate,
      ttsPitch: settings?.ttsPitch,
      ttsVoiceName: settings?.ttsVoiceName
    });
    // Cộng 2 XP khi bấm phát âm
    if (onAwardXP) {
      onAwardXP(2);
    }
  };

  const getColorScheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'noun': 
        return { 
          border: 'border-l-blue-500 dark:border-l-blue-400', 
          badge: 'bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', 
          icon: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400' 
        };
      case 'verb': 
        return { 
          border: 'border-l-rose-500 dark:border-l-rose-400', 
          badge: 'bg-rose-50/55 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', 
          icon: 'hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400' 
        };
      case 'adjective': 
        return { 
          border: 'border-l-emerald-500 dark:border-l-emerald-400', 
          badge: 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', 
          icon: 'hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400' 
        };
      case 'adverb': 
        return { 
          border: 'border-l-amber-500 dark:border-l-amber-400', 
          badge: 'bg-amber-50/50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', 
          icon: 'hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400' 
        };
      case 'preposition': 
        return { 
          border: 'border-l-violet-500 dark:border-l-violet-400', 
          badge: 'bg-violet-50/50 text-violet-700 border-violet-200/50 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20', 
          icon: 'hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-violet-400' 
        };
      case 'phrase': 
        return { 
          border: 'border-l-teal-500 dark:border-l-teal-400', 
          badge: 'bg-teal-50/55 text-teal-700 border-teal-200/50 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', 
          icon: 'hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 dark:hover:text-teal-400' 
        };
      case 'idiom': 
        return { 
          border: 'border-l-fuchsia-500 dark:border-l-fuchsia-400', 
          badge: 'bg-fuchsia-50/50 text-fuchsia-700 border-fuchsia-200/50 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20', 
          icon: 'hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 dark:hover:text-fuchsia-400' 
        };
      default: 
        return { 
          border: 'border-l-slate-400 dark:border-l-slate-500', 
          badge: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', 
          icon: 'hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300' 
        };
    }
  };

  const colors = getColorScheme(entry.type);

  // Hiển thị tiến trình SRS
  const srsLevel = entry.srsLevel || 1;
  const isMastered = srsLevel >= 5;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-150/80 dark:border-slate-800/80 border-l-[4px] group relative flex flex-col h-full ${colors.border}`}>
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{entry.word}</h3>
            {isMastered && (
              <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" title="Đã thuộc lòng" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded border ${colors.badge}`}>
              {entry.type}
            </span>
            
            {/* SRS Progress Dot Indicator */}
            <div className="flex gap-0.5" title={`Cấp độ ghi nhớ: ${srsLevel}/5`}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span 
                  key={lvl} 
                  className={`w-1 h-1 rounded-full ${
                    lvl <= srsLevel 
                      ? 'bg-amber-400' 
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={playAudio}
          className={`p-1.5 text-slate-400 dark:text-slate-500 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${colors.icon}`}
          title="Nghe phát âm"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="space-y-3.5 flex-grow mt-1">
        <div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-0.5">Meaning (VN)</p>
          <p className="text-base text-slate-800 dark:text-slate-200 font-bold leading-snug">{entry.meaning}</p>
        </div>

        {entry.example && (
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-150/50 dark:border-slate-800/40 italic relative transition-colors duration-300">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-0.5 not-italic absolute top-2.5 right-3 select-none">Ex</p>
            <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed pr-5">"{entry.example}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
        <div className="flex items-center text-slate-400 dark:text-slate-400 text-[10px] font-semibold">
          <Clock size={11} className="mr-1.5" />
          {new Date(entry.timestamp).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
              className="text-slate-300 dark:text-slate-450 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg p-1.5 transition-all duration-200"
              title="Sửa từ"
            >
              <Pencil size={14} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            className="text-slate-300 dark:text-slate-450 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg p-1.5 transition-all duration-200"
            title="Xóa từ"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};