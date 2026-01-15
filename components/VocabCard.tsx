import React from 'react';
import { WordEntry } from '../types';
import { Volume2, Trash2, Clock } from 'lucide-react';

interface VocabCardProps {
  entry: WordEntry;
  onDelete: (id: string) => void;
}

export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete }) => {
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(entry.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 group relative flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{entry.word}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md uppercase tracking-wide border border-indigo-100">
            {entry.type}
          </span>
        </div>
        <button
          onClick={playAudio}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Listen"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Meaning</p>
          <p className="text-lg text-slate-800 font-medium leading-normal">{entry.meaning}</p>
        </div>

        {entry.example && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic relative">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
            <p className="text-slate-600 text-sm leading-relaxed pr-6">"{entry.example}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center text-slate-400 text-xs font-medium">
          <Clock size={12} className="mr-1.5" />
          {new Date(entry.timestamp).toLocaleDateString()}
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-1.5 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
