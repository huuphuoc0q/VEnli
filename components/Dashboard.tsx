import React, { useMemo } from 'react';
import { WordEntry, AppSettings } from '../types';
import { Zap, Flame, Award, BookOpen, Clock, Calendar, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';
import { getUserStats, getXPForNextLevel } from '../services/gamificationService';
import { getDueWordsCount } from '../services/srsService';

interface DashboardProps {
  words: WordEntry[];
  streak: number;
  userXPState: { xp: number; level: number };
  settings?: AppSettings;
  onNavigate: (view: any) => void;
  onSyncFirebase?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  words,
  streak,
  userXPState,
  settings,
  onNavigate,
  onSyncFirebase
}) => {
  // 1. Tải chỉ số Gamification từ prop
  const stats = userXPState;
  const xpNeeded = getXPForNextLevel(stats.level);
  const xpPercentage = Math.min(100, Math.round((stats.xp / xpNeeded) * 100));

  // 2. Tính toán thống kê từ vựng
  const dueCount = useMemo(() => getDueWordsCount(words), [words]);
  const masteredCount = useMemo(() => words.filter(w => w.srsLevel && w.srsLevel >= 5).length, [words]);
  
  // 3. Phân bố cấp độ SRS
  const srsDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // Cấp độ 1 đến 5
    words.forEach(w => {
      const lvl = w.srsLevel || 1;
      if (lvl >= 1 && lvl <= 5) {
        dist[lvl - 1] += 1;
      }
    });
    return dist;
  }, [words]);

  // 4. Biểu đồ nạp từ trong 7 ngày gần nhất
  const last7DaysAdditions = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`; // Định dạng 'sv' yyyy-mm-dd
      
      return {
        dateStr,
        label: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        count: 0
      };
    }).reverse();

    words.forEach(w => {
      const wDate = new Date(w.timestamp);
      const year = wDate.getFullYear();
      const month = String(wDate.getMonth() + 1).padStart(2, '0');
      const date = String(wDate.getDate()).padStart(2, '0');
      const wDateStr = `${year}-${month}-${date}`;
      
      const dayMatch = days.find(d => d.dateStr === wDateStr);
      if (dayMatch) {
        dayMatch.count += 1;
      }
    });

    return days;
  }, [words]);

  const maxAdditions = useMemo(() => {
    const maxVal = Math.max(...last7DaysAdditions.map(d => d.count));
    return maxVal === 0 ? 5 : maxVal; // Fallback để vẽ biểu đồ trống
  }, [last7DaysAdditions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Phần Chào & Profile Thăng cấp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Khung Level & XP */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 rounded-2xl p-4 md:p-5 text-white relative overflow-hidden shadow-lg shadow-indigo-500/5 group">
          {/* Decorative Background Circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full filter blur-xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl" />

          <div className="relative flex flex-col justify-between h-full min-h-[120px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-white/10 text-indigo-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/5">
                  Học viên Tự Học
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight mt-2">
                  Chào mừng bạn quay lại!
                </h2>
                <p className="text-indigo-205 text-xs mt-0.5 font-semibold">Hôm nay là một ngày tuyệt vời để học từ mới.</p>
              </div>
              
              <div className="flex items-center justify-center bg-white/10 w-12 h-12 rounded-xl border border-white/10 shadow-md">
                <div className="text-center">
                  <span className="block text-xl font-black text-white">{stats.level}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wide text-indigo-200">Level</span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-[11px] font-bold text-indigo-100">
                <span className="flex items-center gap-1"><Zap size={12} fill="currentColor" className="text-amber-300" /> Tiến trình XP</span>
                <span>{stats.xp} / {xpNeeded} XP</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 border border-white/5 p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <p className="text-[9px] text-indigo-200 font-semibold italic">Còn {xpNeeded - stats.xp} XP nữa để thăng cấp {stats.level + 1}!</p>
            </div>
          </div>
        </div>

        {/* Khung Streak hoạt động */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Chuỗi Streak</h3>
            <span className="text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-1.5 rounded-lg border border-orange-100/50 dark:border-orange-500/20">
              <Flame size={18} fill="currentColor" />
            </span>
          </div>

          <div className="my-3 text-center flex flex-col items-center">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 filter drop-shadow-sm select-none">
              {streak}
            </div>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Ngày học liên tiếp</span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
              {streak > 0 ? "Tuyệt vời! Hãy giữ vững ngọn lửa học tập này." : "Học ngay hôm nay để kích hoạt Streak!"}
            </p>
          </div>
        </div>

      </div>

      {/* 2. Thống kê nhanh & Các Lối tắt học */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Số từ vựng */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full filter blur-md" />
          <span className="block text-xl font-black text-slate-800 dark:text-white">{words.length}</span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1"><BookOpen size={11} /> Tổng số từ</span>
        </div>

        {/* Cần ôn tập SRS */}
        <div 
          onClick={() => onNavigate('srsPlay')}
          className={`rounded-2xl p-4 border shadow-sm relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-md ${
            dueCount > 0 
              ? 'bg-amber-50/30 dark:bg-amber-500/5 border-amber-200/50 dark:border-amber-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800/80'
          }`}
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full filter blur-md" />
          <span className={`block text-xl font-black ${dueCount > 0 ? 'text-amber-605 dark:text-amber-400' : 'text-slate-800 dark:text-white'}`}>{dueCount}</span>
          <span className="text-slate-450 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1"><Clock size={11} /> Cần ôn hôm nay</span>
        </div>

        {/* Đã thuộc lòng */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full filter blur-md" />
          <span className="block text-xl font-black text-slate-800 dark:text-white">{masteredCount}</span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-500" /> Đã thuộc lòng</span>
        </div>

        {/* Đồng bộ Firebase */}
        <div 
          onClick={onSyncFirebase}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm relative overflow-hidden group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md transition-all active:scale-95"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full filter blur-md" />
          <span className="block text-xs font-black text-slate-800 dark:text-white flex items-center gap-1 mt-0.5">
            {settings?.firebaseEnabled ? "Đám mây 🟢" : "Nội bộ 🔴"}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
            <RefreshCw size={11} className="group-hover:rotate-180 transition-transform duration-500" /> Sync Firebase
          </span>
        </div>

      </div>

      {/* 2.5 Minigames Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Trung tâm Ôn tập & Trò chơi</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Luyện phản xạ nhanh qua game ghép từ vựng sinh động</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('matchingPlay')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Zap size={13} fill="currentColor" /> Chơi Ghép Từ (+15 XP)
          </button>
        </div>
      </div>

      {/* 3. Phần vẽ Biểu đồ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Biểu đồ 1: Số lượng từ thêm mới 7 ngày */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-0.5 flex items-center gap-1.5">
            <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={18} />
            Tiến trình nạp từ vựng
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-4">Số từ vựng thêm mới trong 7 ngày gần đây</p>

          <div className="h-36 flex items-end justify-between px-1 pt-4 relative">
            
            {/* Grid Line Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
              <div className="border-t border-slate-800 dark:border-white w-full h-px" />
              <div className="border-t border-slate-800 dark:border-white w-full h-px" />
              <div className="border-t border-slate-800 dark:border-white w-full h-px" />
            </div>

            {last7DaysAdditions.map((day, idx) => {
              const heightPercentage = Math.max(8, Math.round((day.count / maxAdditions) * 100));

              return (
                <div key={idx} className="flex flex-col items-center flex-1 group relative">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full mb-1.5 bg-slate-800 dark:bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow z-10 whitespace-nowrap">
                    {day.count} từ
                  </div>

                  {/* Visual Bar */}
                  <div 
                    className="w-6 rounded-t bg-gradient-to-t from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-500 shadow-sm transition-all duration-500 hover:brightness-110"
                    style={{ height: `${(heightPercentage / 100) * 100}px` }}
                  />

                  {/* Label */}
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-2">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Biểu đồ 2: Cấu trúc bộ nhớ SRS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 shadow-sm">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-0.5 flex items-center gap-1.5">
            <Award className="text-amber-500" size={18} />
            Mức độ ghi nhớ (SRS)
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-4">Phân loại kho từ vựng theo cấp độ Anki</p>

          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((level) => {
              const count = srsDistribution[level - 1];
              const maxSrsCount = Math.max(...srsDistribution) || 1;
              const barPercentage = Math.round((count / maxSrsCount) * 100);

              const getLevelName = (lvl: number) => {
                switch (lvl) {
                  case 1: return "🔴 Cần học (Hộp 1)";
                  case 2: return "🟡 Nhận diện (Hộp 2)";
                  case 3: return "🟢 Nhớ tốt (Hộp 3)";
                  case 4: return "🔵 Nhanh nhạy (Hộp 4)";
                  case 5: return "🌟 Thuộc lòng (Hộp 5)";
                  default: return "";
                }
              };

              return (
                <div key={level} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-650 dark:text-slate-400">
                    <span>{getLevelName(level)}</span>
                    <span>{count} từ</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        level === 1 ? 'bg-red-500' :
                        level === 2 ? 'bg-amber-500' :
                        level === 3 ? 'bg-green-500' :
                        level === 4 ? 'bg-blue-500' :
                        'bg-purple-600'
                      }`}
                      style={{ width: `${barPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
