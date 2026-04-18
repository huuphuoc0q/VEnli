// // src/components/StoryPlayer.tsx
// import React, { useState } from 'react';
// import { X, BookOpen, Languages, Sparkles } from 'lucide-react';
// import { StoryEntry } from '../types';

// interface StoryPlayerProps {
//   story: StoryEntry;
//   onExit: () => void;
// }

// export const StoryPlayer: React.FC<StoryPlayerProps> = ({ story, onExit }) => {
//   const [showTranslate, setShowTranslate] = useState(false);

//   return (
//     <div className="max-w-3xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="flex items-center justify-between mb-6 px-2">
//         <button onClick={onExit} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-200 transition-colors">
//           <X size={24} />
//         </button>
//         <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-full">
//           <BookOpen size={18} /> Story Mode
//         </div>
//       </div>

//       <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-8 text-center">
//           {story.title}
//         </h1>

//         <div className="flex justify-end mb-6">
//           <button 
//             onClick={() => setShowTranslate(!showTranslate)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
//               showTranslate ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//             }`}
//           >
//             <Languages size={18} /> {showTranslate ? "Tắt Dịch" : "Hiện Bản Dịch"}
//           </button>
//         </div>

//         {/* Nội dung Tiếng Anh (Render HTML để nhận thẻ <mark>) */}
//         <div 
//           className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-medium text-lg md:text-xl mb-8 prose-mark:bg-indigo-100 prose-mark:text-indigo-800 prose-mark:px-1.5 prose-mark:rounded-md"
//           dangerouslySetInnerHTML={{ __html: story.content_EN }}
//         />

//         {/* Bản dịch Tiếng Việt */}
//         {showTranslate && (
//           <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//             <div className="border-t border-dashed border-slate-200 my-8"></div>
//             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Bản dịch (Vietnamese)</h3>
//             <p className="text-slate-600 leading-relaxed text-lg italic">
//               {story.content_VN}
//             </p>
//           </div>
//         )}

//         {/* Danh sách từ vựng ôn tập */}
//         <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-100">
//           <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2 mb-4">
//             <Sparkles size={16} className="text-amber-500" /> Target Vocabulary
//           </h3>
//           <div className="flex flex-wrap gap-2">
//           {/* Sửa dòng dưới đây: Thêm (story.vocabulary_used || []) */}
//           {(story.vocabulary_used || []).map((vocab, idx) => (
//             <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold shadow-sm">
//               {vocab}
//             </span>
//           ))}
//         </div>
//           {/* <div className="flex flex-wrap gap-2">
//             {story.vocabulary_used.map((vocab, idx) => (
//               <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold shadow-sm">
//                 {vocab}
//               </span>
//             ))}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };
// src/components/StoryPlayer.tsx
import React, { useState } from 'react';
import { X, BookOpen, Languages, Sparkles } from 'lucide-react';
import { StoryEntry } from '../types';

interface StoryPlayerProps {
  story: StoryEntry;
  onExit: () => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({ story, onExit }) => {
  const [showTranslate, setShowTranslate] = useState(false);

  return (
    // Đã tăng max-w-3xl lên max-w-5xl để có đủ không gian rộng rãi cho 2 cột
    <div className="max-w-5xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-200 transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-full">
          <BookOpen size={18} /> Story Mode
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-8 text-center">
          {story.title}
        </h1>

        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setShowTranslate(!showTranslate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showTranslate ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Languages size={18} /> {showTranslate ? "Chỉ hiện Tiếng Anh" : "Đọc Song Ngữ"}
          </button>
        </div>

        {/* BỐ CỤC GRID: Tự động chia 2 cột trên màn hình lớn nếu bật dịch */}
        <div className={`grid grid-cols-1 ${showTranslate ? 'lg:grid-cols-2 gap-10' : 'gap-0'}`}>
          
          {/* CỘT TRÁI: Nội dung Tiếng Anh */}
          <div className={`prose prose-lg max-w-none text-slate-700 leading-relaxed font-medium text-lg md:text-xl prose-mark:bg-indigo-100 prose-mark:text-indigo-800 prose-mark:px-1.5 prose-mark:rounded-md ${showTranslate ? 'lg:border-r lg:border-dashed lg:border-slate-200 lg:pr-10' : ''}`}>
            {showTranslate && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Original (English)</h3>}
            <div dangerouslySetInnerHTML={{ __html: story.content_EN }} />
          </div>

          {/* CỘT PHẢI: Bản dịch Tiếng Việt */}
          {showTranslate && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Bản dịch (Vietnamese)</h3>
              {/* Đã sửa: Dùng dangerouslySetInnerHTML để render thẻ <mark> màu vàng nhạt */}
              <div 
                className="prose prose-lg max-w-none text-slate-600 leading-relaxed text-lg md:text-xl italic prose-mark:bg-amber-100 prose-mark:text-amber-800 prose-mark:px-1.5 prose-mark:rounded-md"
                dangerouslySetInnerHTML={{ __html: story.content_VN }}
              />
            </div>
          )}
        </div>

        {/* Danh sách từ vựng ôn tập */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber-500" /> Target Vocabulary
          </h3>
          <div className="flex flex-wrap gap-2">
            {(story.vocabulary_used || []).map((vocab, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                {vocab}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};