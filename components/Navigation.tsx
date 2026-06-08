import React from 'react';
import {
  LayoutDashboard, BookOpen, Clock, FileText, Settings,
  Flame, Trophy, Moon, Sun, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';

type ViewMode = 'list' | 'aiSetup' | 'flashcardPlay' | 'storyPlay' | 'fillBlankPlay' | 'srsPlay' | 'dashboard' | 'vstepSetup' | 'vstepListening' | 'vstepReading' | 'vstepWriting' | 'vstepSpeaking' | 'vstepScore' | 'settings' | 'matchingPlay' | 'flashcardQuick';

interface NavigationProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  dueSrsCount: number;
  streak: number;
  level: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  dueSrsCount,
  streak,
  level,
  isDarkMode,
  onToggleTheme,
  isCollapsed,
  onToggleCollapse
}) => {

  const menuItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Tổng quan',
      icon: <LayoutDashboard size={18} />,
      isActive: currentView === 'dashboard',
    },
    {
      id: 'list' as ViewMode,
      label: 'Sổ Từ Vựng',
      icon: <BookOpen size={18} />,
      isActive: currentView === 'list' || currentView === 'aiSetup' || currentView === 'flashcardPlay' || currentView === 'storyPlay' || currentView === 'fillBlankPlay' || currentView === 'matchingPlay',
    },
    {
      id: 'flashcardQuick' as ViewMode,
      label: 'Thẻ Flashcard',
      icon: <Layers size={18} />,
      isActive: currentView === 'flashcardQuick',
    },
    {
      id: 'srsPlay' as ViewMode,
      label: 'SRS Ôn tập',
      icon: <Clock size={18} />,
      isActive: currentView === 'srsPlay',
      badge: dueSrsCount > 0 ? dueSrsCount : null,
    },
    {
      id: 'vstepSetup' as ViewMode,
      label: 'Thi VSTEP',
      icon: <FileText size={18} />,
      isActive: currentView === 'vstepSetup' || currentView === 'vstepListening' || currentView === 'vstepReading' || currentView === 'vstepWriting' || currentView === 'vstepSpeaking' || currentView === 'vstepScore',
    },
    {
      id: 'settings' as ViewMode,
      label: 'Cài đặt',
      icon: <Settings size={18} />,
      isActive: currentView === 'settings',
    }
  ];

  return (
    <>
      {/* 1. SIDEBAR NAVIGATION - Cho màn hình Desktop (md trở lên) */}
      <aside className={`hidden md:flex flex-col ${isCollapsed ? 'w-20 p-4 items-center' : 'w-60 p-5'} bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-800 h-screen sticky top-0 left-0 justify-between transition-all duration-300 ease-in-out z-30`}>

        <div className="space-y-6 w-full flex flex-col items-stretch">
          {/* Logo Brand */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 px-1.5'} cursor-pointer`} onClick={() => onNavigate('dashboard')}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-650 p-2 rounded-xl text-white shadow-md shadow-indigo-500/10 hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen size={18} />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-lg font-black bg-gradient-to-r from-indigo-650 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                  VocabFlow
                </h1>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block -mt-0.5">AI Study Desk</span>
              </div>
            )}
          </div>

          {/* Gamification mini-widget */}
          {!isCollapsed && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-2 transition-colors animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Trophy size={12} className="text-amber-500" /> Cấp độ</span>
                <span className="text-slate-800 dark:text-slate-100 font-black">Level {level}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 border-t border-slate-150 dark:border-slate-800/60 pt-2">
                <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500" /> Hot Streak</span>
                <span className="text-orange-600 dark:text-orange-400 font-black">{streak} ngày</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 w-full">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-extrabold transition-all relative ${item.isActive
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-600/10 hover:bg-indigo-700'
                    : 'text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="animate-in fade-in duration-350">{item.label}</span>}
                </div>
                {item.badge != null && (
                  isCollapsed ? (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-amber-500 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                      {item.badge}
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${item.isActive
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-amber-500 text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Controls Footer */}
        <div className={`pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full flex ${isCollapsed ? 'justify-center' : 'justify-end'} items-center`}>
          {/* Sidebar Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-center gap-1.5"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Thu gọn</span>
              </>
            )}
          </button>
        </div>

      </aside>

      {/* 2. BOTTOM NAVIGATION - Cho Mobile (md trở xuống) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border-t border-slate-150 dark:border-slate-800/80 flex items-center justify-around py-2.5 px-1.5 z-30 transition-colors duration-300 shadow-md">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 py-0.5 px-2 rounded-xl relative transition-all duration-200 ${item.isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'text-slate-450 dark:text-slate-400 font-bold'
              }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge != null && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[7px] font-black leading-none animate-in scale-in duration-300">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] tracking-wide select-none">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
