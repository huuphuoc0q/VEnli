import React from 'react';
import { Command, CornerDownLeft, X } from 'lucide-react';

export const ShortcutsGuide: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 hidden md:flex flex-col gap-2 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium">
        <span className="flex items-center gap-1">
          <Command size={12} /> + K
        </span>
        <span>to focus</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium">
        <span className="flex items-center gap-1">
          <CornerDownLeft size={12} />
        </span>
        <span>to save</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium">
        <span className="flex items-center gap-1">
          Esc
        </span>
        <span>to clear</span>
      </div>
    </div>
  );
};
