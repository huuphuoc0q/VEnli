// // // // import React from 'react';
// // // // import { WordEntry } from '../types';
// // // // import { Volume2, Trash2, Clock } from 'lucide-react';

// // // // interface VocabCardProps {
// // // //   entry: WordEntry;
// // // //   onDelete: (id: string) => void;
// // // // }

// // // // export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete }) => {
// // // //   const playAudio = () => {
// // // //     const utterance = new SpeechSynthesisUtterance(entry.word);
// // // //     utterance.lang = 'en-US';
// // // //     window.speechSynthesis.speak(utterance);
// // // //   };

// // // //   return (
// // // //     <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 group relative flex flex-col h-full">
// // // //       <div className="flex justify-between items-start mb-3">
// // // //         <div>
// // // //           <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{entry.word}</h3>
// // // //           <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md uppercase tracking-wide border border-indigo-100">
// // // //             {entry.type}
// // // //           </span>
// // // //         </div>
// // // //         <button
// // // //           onClick={playAudio}
// // // //           className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
// // // //           title="Listen"
// // // //         >
// // // //           <Volume2 size={20} />
// // // //         </button>
// // // //       </div>

// // // //       <div className="space-y-4 flex-grow">
// // // //         <div>
// // // //           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Meaning</p>
// // // //           <p className="text-lg text-slate-800 font-medium leading-normal">{entry.meaning}</p>
// // // //         </div>

// // // //         {entry.example && (
// // // //           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic relative">
// // // //              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
// // // //             <p className="text-slate-600 text-sm leading-relaxed pr-6">"{entry.example}"</p>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
// // // //         <div className="flex items-center text-slate-400 text-xs font-medium">
// // // //           <Clock size={12} className="mr-1.5" />
// // // //           {new Date(entry.timestamp).toLocaleDateString()}
// // // //         </div>
// // // //         <button
// // // //           onClick={() => onDelete(entry.id)}
// // // //           className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-1.5 transition-colors"
// // // //           title="Delete"
// // // //         >
// // // //           <Trash2 size={16} />
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };
// // // import React from 'react';
// // // import { WordEntry } from '../types';
// // // import { Volume2, Trash2, Clock } from 'lucide-react';

// // // interface VocabCardProps {
// // //   entry: WordEntry;
// // //   onDelete: (id: string) => void;
// // // }

// // // export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete }) => {
// // //   const playAudio = () => {
// // //     const utterance = new SpeechSynthesisUtterance(entry.word);
// // //     utterance.lang = 'en-US';
// // //     window.speechSynthesis.speak(utterance);
// // //   };

// // //   return (
// // //     <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 group relative flex flex-col h-full">
// // //       <div className="flex justify-between items-start mb-3">
// // //         <div>
// // //           <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{entry.word}</h3>
// // //           <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md uppercase tracking-wide border border-indigo-100">
// // //             {entry.type}
// // //           </span>
// // //         </div>
// // //         <button
// // //           onClick={playAudio}
// // //           className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
// // //           title="Listen"
// // //         >
// // //           <Volume2 size={20} />
// // //         </button>
// // //       </div>

// // //       <div className="space-y-4 flex-grow">
// // //         <div>
// // //           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Meaning</p>
// // //           <p className="text-lg text-slate-800 font-medium leading-normal">{entry.meaning}</p>
// // //         </div>

// // //         {entry.example && (
// // //           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic relative">
// // //              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
// // //             <p className="text-slate-600 text-sm leading-relaxed pr-6">"{entry.example}"</p>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
// // //         <div className="flex items-center text-slate-400 text-xs font-medium">
// // //           <Clock size={12} className="mr-1.5" />
// // //           {new Date(entry.timestamp).toLocaleDateString()}
// // //         </div>
// // //         <button
// // //           onClick={() => onDelete(entry.id)}
// // //           className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-1.5 transition-colors"
// // //           title="Delete"
// // //         >
// // //           <Trash2 size={16} />
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };
// // import React from 'react';
// // import { WordEntry } from '../types';
// // import { Volume2, Trash2, Clock } from 'lucide-react';

// // interface VocabCardProps {
// //   entry: WordEntry;
// //   onDelete: (id: string) => void;
// // }

// // export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete }) => {
// //   const playAudio = () => {
// //     const utterance = new SpeechSynthesisUtterance(entry.word);
// //     utterance.lang = 'en-US';
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   // Hàm thiết lập bảng màu thông minh dựa trên từ loại (Part of Speech)
// //   const getColorScheme = (type: string) => {
// //     switch (type.toLowerCase()) {
// //       case 'noun': // Xanh dương
// //         return { border: 'border-l-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'hover:text-blue-600 hover:bg-blue-50' };
// //       case 'verb': // Đỏ hồng
// //         return { border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'hover:text-rose-600 hover:bg-rose-50' };
// //       case 'adjective': // Xanh ngọc
// //         return { border: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'hover:text-emerald-600 hover:bg-emerald-50' };
// //       case 'adverb': // Cam
// //         return { border: 'border-l-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'hover:text-amber-600 hover:bg-amber-50' };
// //       case 'preposition': // Tím
// //         return { border: 'border-l-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-200', icon: 'hover:text-violet-600 hover:bg-violet-50' };
// //       case 'phrase': // Xanh mòng két
// //         return { border: 'border-l-teal-500', badge: 'bg-teal-50 text-teal-700 border-teal-200', icon: 'hover:text-teal-600 hover:bg-teal-50' };
// //       case 'idiom': // Hồng đậm
// //         return { border: 'border-l-fuchsia-500', badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', icon: 'hover:text-fuchsia-600 hover:bg-fuchsia-50' };
// //       default: // Xám trung tính cho các từ loại khác
// //         return { border: 'border-l-slate-400', badge: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'hover:text-slate-600 hover:bg-slate-100' };
// //     }
// //   };

// //   const colors = getColorScheme(entry.type);

// //   // return (
// //   //   // Thêm border-l-[5px], màu viền động, và hiệu ứng nổi (hover:-translate-y-1)
// //   //   <div className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 border-l-[5px] hover:-translate-y-1 group relative flex flex-col h-full ${colors.border}`}>
// //   //     <div className="flex justify-between items-start mb-3">
// //   //       <div>
// //   //         <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{entry.word}</h3>
// //   //         {/* Áp dụng màu nhãn động */}
// //   //         <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-md uppercase tracking-wide border ${colors.badge}`}>
// //   //           {entry.type}
// //   //         </span>
// //   //       </div>
// //   //       {/* Áp dụng hiệu ứng hover động cho nút phát âm */}
// //   //       <button
// //   //         onClick={playAudio}
// //   //         className={`p-2 text-slate-400 rounded-full transition-colors ${colors.icon}`}
// //   //         title="Listen"
// //   //       >
// //   //         <Volume2 size={20} />
// //   //       </button>
// //   //     </div>

// //   //     <div className="space-y-4 flex-grow">
// //   //       <div>
// //   //         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Meaning</p>
// //   //         <p className="text-lg text-slate-800 font-medium leading-normal">{entry.meaning}</p>
// //   //       </div>

// //   //       {entry.example && (
// //   //         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic relative">
// //   //            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
// //   //           <p className="text-slate-600 text-sm leading-relaxed pr-6">"{entry.example}"</p>
// //   //         </div>
// //   //       )}
// //   //     </div>

// //   //     <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
// //   //       <div className="flex items-center text-slate-400 text-xs font-medium">
// //   //         <Clock size={12} className="mr-1.5" />
// //   //         {new Date(entry.timestamp).toLocaleDateString()}
// //   //       </div>
// //   //       <button
// //   //         onClick={() => onDelete(entry.id)}
// //   //         className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-1.5 transition-colors"
// //   //         title="Delete"
// //   //       >
// //   //         <Trash2 size={16} />
// //   //       </button>
// //   //     </div>
// //   //   </div>
// //   // );
// //   // src/components/VocabCard.tsx
// // // ... (giữ nguyên phần getColorScheme)
// //   return (
// //     <div className={`bg-white dark:bg-slate-850 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700/50 border-l-[5px] hover:-translate-y-1 group relative flex flex-col h-full ${colors.border}`}>
// //       <div className="flex justify-between items-start mb-3">
// //         <div>
// //           <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{entry.word}</h3>
// //           <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-md uppercase tracking-wide border ${colors.badge} dark:bg-opacity-10`}>
// //             {entry.type}
// //           </span>
// //         </div>
// //         <button onClick={playAudio} className={`p-2 text-slate-400 dark:text-slate-500 rounded-full transition-colors ${colors.icon}`}>
// //           <Volume2 size={20} />
// //         </button>
// //       </div>

// //       <div className="space-y-4 flex-grow">
// //         <div>
// //           <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Meaning</p>
// //           <p className="text-lg text-slate-800 dark:text-slate-200 font-medium leading-normal">{entry.meaning}</p>
// //         </div>
// //         {/* ... các phần còn lại thêm dark: phù hợp */}
// //       </div>
// //     </div>
// //   );
// // };
// import React from 'react';
// import { WordEntry } from '../types';
// import { Volume2, Trash2, Clock } from 'lucide-react';

// interface VocabCardProps {
//   entry: WordEntry;
//   onDelete: (id: string) => void;
// }

// export const VocabCard: React.FC<VocabCardProps> = ({ entry, onDelete }) => {
//   const playAudio = () => {
//     const utterance = new SpeechSynthesisUtterance(entry.word);
//     utterance.lang = 'en-US';
//     window.speechSynthesis.speak(utterance);
//   };

//   // Cập nhật bảng màu hỗ trợ cả Light Mode và Dark Mode
//   const getColorScheme = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'noun': 
//         return { border: 'border-l-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', icon: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400' };
//       case 'verb': 
//         return { border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', icon: 'hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400' };
//       case 'adjective': 
//         return { border: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', icon: 'hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400' };
//       case 'adverb': 
//         return { border: 'border-l-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', icon: 'hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400' };
//       case 'preposition': 
//         return { border: 'border-l-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20', icon: 'hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-violet-400' };
//       case 'phrase': 
//         return { border: 'border-l-teal-500', badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', icon: 'hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 dark:hover:text-teal-400' };
//       case 'idiom': 
//         return { border: 'border-l-fuchsia-500', badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20', icon: 'hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 dark:hover:text-fuchsia-400' };
//       default: 
//         return { border: 'border-l-slate-400 dark:border-l-slate-600', badge: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', icon: 'hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300' };
//     }
//   };

//   const colors = getColorScheme(entry.type);

//   return (
//     <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700/80 border-l-[5px] hover:-translate-y-1 group relative flex flex-col h-full ${colors.border}`}>
//       <div className="flex justify-between items-start mb-3">
//         <div>
//           <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{entry.word}</h3>
//           <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-md uppercase tracking-wide border ${colors.badge}`}>
//             {entry.type}
//           </span>
//         </div>
//         <button
//           onClick={playAudio}
//           className={`p-2 text-slate-400 dark:text-slate-500 rounded-full transition-colors ${colors.icon}`}
//           title="Listen"
//         >
//           <Volume2 size={20} />
//         </button>
//       </div>

//       <div className="space-y-4 flex-grow">
//         <div>
//           <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Meaning</p>
//           <p className="text-lg text-slate-800 dark:text-slate-200 font-medium leading-normal">{entry.meaning}</p>
//         </div>

//         {entry.example && (
//           <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 italic relative">
//              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
//             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pr-6">"{entry.example}"</p>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/80">
//         <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-medium">
//           <Clock size={12} className="mr-1.5" />
//           {new Date(entry.timestamp).toLocaleDateString()}
//         </div>
//         <button
//           onClick={() => onDelete(entry.id)}
//           className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded p-1.5 transition-colors"
//           title="Delete"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };
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

  // ĐÃ SỬA LỖI: Thêm dark:border-l-[color] để chống bị ghi đè màu viền
  const getColorScheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'noun': 
        return { border: 'border-l-blue-500 dark:border-l-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', icon: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400' };
      case 'verb': 
        return { border: 'border-l-rose-500 dark:border-l-rose-400', badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', icon: 'hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400' };
      case 'adjective': 
        return { border: 'border-l-emerald-500 dark:border-l-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', icon: 'hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400' };
      case 'adverb': 
        return { border: 'border-l-amber-500 dark:border-l-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', icon: 'hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400' };
      case 'preposition': 
        return { border: 'border-l-violet-500 dark:border-l-violet-400', badge: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20', icon: 'hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-violet-400' };
      case 'phrase': 
        return { border: 'border-l-teal-500 dark:border-l-teal-400', badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', icon: 'hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 dark:hover:text-teal-400' };
      case 'idiom': 
        return { border: 'border-l-fuchsia-500 dark:border-l-fuchsia-400', badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20', icon: 'hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 dark:hover:text-fuchsia-400' };
      default: 
        return { border: 'border-l-slate-400 dark:border-l-slate-500', badge: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', icon: 'hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300' };
    }
  };

  const colors = getColorScheme(entry.type);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700/80 border-l-[5px] hover:-translate-y-1 group relative flex flex-col h-full ${colors.border}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{entry.word}</h3>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-md uppercase tracking-wide border ${colors.badge}`}>
            {entry.type}
          </span>
        </div>
        <button
          onClick={playAudio}
          className={`p-2 text-slate-400 dark:text-slate-500 rounded-full transition-colors ${colors.icon}`}
          title="Listen"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Meaning</p>
          <p className="text-lg text-slate-800 dark:text-slate-200 font-medium leading-normal">{entry.meaning}</p>
        </div>

        {entry.example && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 italic relative">
             <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 not-italic absolute top-3 right-3 select-none">Ex</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pr-6">"{entry.example}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-medium">
          <Clock size={12} className="mr-1.5" />
          {new Date(entry.timestamp).toLocaleDateString()}
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded p-1.5 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};