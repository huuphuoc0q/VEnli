// // // src/components/FlashcardSetup.tsx
// // import React, { useState, useMemo } from 'react';
// // import { Copy, Play, ArrowLeft, Check, Sparkles } from 'lucide-react';
// // import { FlashcardEntry, WordEntry } from '../types';

// // interface FlashcardSetupProps {
// //   wordsToLearn: WordEntry[]; // <-- Thêm prop này để nhận danh sách từ
// //   onBack: () => void;
// //   onStartPlay: (data: FlashcardEntry[]) => void;
// // }

// // export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
// //   const [jsonInput, setJsonInput] = useState('');
// //   const [error, setError] = useState<string | null>(null);
// //   const [copied, setCopied] = useState(false);

// //   // Tự động tạo Prompt dựa trên danh sách từ được truyền vào
// //   const promptText = useMemo(() => {
// //     const wordListText = wordsToLearn
// //       .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
// //       .join('\n');

// //     return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

// // Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
// // [
// //   {
// //     "word": "[Từ tiếng Anh]",
// //     "pronunciation": "[Phiên âm IPA]",
// //     "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
// //     "meaningVN": "[Nghĩa tiếng Việt ngắn gọn (có thể dựa trên nghĩa tôi cung cấp)]",
// //     "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
// //     "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó (có thể dùng ví dụ của tôi hoặc tạo câu chuẩn hơn)]",
// //     "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
// //     "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
// //   }
// // ]

// // Danh sách từ của tôi:
// // ${wordListText}`;
// //   }, [wordsToLearn]);

// //   const handleCopyPrompt = () => {
// //     navigator.clipboard.writeText(promptText).then(() => {
// //       setCopied(true);
// //       setTimeout(() => setCopied(false), 2000);
// //     });
// //   };

// //   const handleStart = () => {
// //     try {
// //       const parsedData = JSON.parse(jsonInput);
// //       if (!Array.isArray(parsedData) || parsedData.length === 0) {
// //         throw new Error("Dữ liệu phải là một mảng JSON.");
// //       }
// //       if (!parsedData[0].word || !parsedData[0].meaningVN) {
// //          throw new Error("JSON thiếu các trường bắt buộc. Hãy kiểm tra lại kết quả của AI.");
// //       }
// //       setError(null);
// //       onStartPlay(parsedData);
// //     } catch (err: any) {
// //       setError("JSON không hợp lệ. Vui lòng kiểm tra lại lỗi cú pháp: " + err.message);
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
// //       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
// //         <ArrowLeft size={18} className="mr-2" /> Quay lại
// //       </button>

// //       <div className="flex items-center justify-between mb-8">
// //         <div>
// //           <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
// //             <Sparkles className="text-indigo-500" /> Setup Flashcard AI
// //           </h2>
// //           <p className="text-slate-500">
// //             Bạn đang chuẩn bị học bộ <strong className="text-indigo-600">{wordsToLearn.length} từ vựng</strong>.
// //           </p>
// //         </div>
// //       </div>

// //       <div className="mb-8">
// //         <div className="flex items-center justify-between mb-2">
// //           <label className="font-semibold text-slate-700">Bước 1: Copy Prompt & Gửi cho AI</label>
// //           <button 
// //             onClick={handleCopyPrompt}
// //             className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
// //           >
// //             {copied ? <Check size={16} /> : <Copy size={16} />}
// //             {copied ? "Đã copy" : "Copy Prompt"}
// //           </button>
// //         </div>
// //         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap h-40 overflow-y-auto">
// //           {promptText}
// //         </div>
// //       </div>

// //       <div className="mb-6">
// //         <label className="font-semibold text-slate-700 block mb-2">Bước 2: Dán kết quả JSON từ AI vào đây</label>
// //         <textarea
// //           value={jsonInput}
// //           onChange={(e) => setJsonInput(e.target.value)}
// //           placeholder="[\n  {\n    'word': '...'\n  }\n]"
// //           className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm"
// //         />
// //         {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
// //       </div>

// //       <button
// //         onClick={handleStart}
// //         disabled={!jsonInput.trim()}
// //         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
// //       >
// //         <Play fill="currentColor" size={20} /> Bắt đầu học
// //       </button>
// //     </div>
// //   );
// // };
// // src/components/FlashcardSetup.tsx
// import React, { useState, useMemo } from 'react';
// import { Copy, Play, ArrowLeft, Check, Sparkles, BookOpen, PenTool } from 'lucide-react';
// import { WordEntry, StudyMode } from '../types';

// interface FlashcardSetupProps {
//   wordsToLearn: WordEntry[];
//   onBack: () => void;
//   // Trả về data (any vì có thể là mảng Flashcard, Story object, hoặc mảng FillBlank) và chế độ tương ứng
//   onStartPlay: (data: any, mode: StudyMode) => void;
// }

// export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
//   const [jsonInput, setJsonInput] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [selectedMode, setSelectedMode] = useState<StudyMode>('flashcard');

//   const wordListText = useMemo(() => {
//     return wordsToLearn
//       .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
//       .join('\n');
//   }, [wordsToLearn]);

//   // Tạo Prompt tương ứng với chế độ được chọn
//   const promptText = useMemo(() => {
//     if (selectedMode === 'flashcard') {
//       return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

// Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
// [
//   {
//     "word": "[Từ tiếng Anh]",
//     "pronunciation": "[Phiên âm IPA]",
//     "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
//     "meaningVN": "[Nghĩa tiếng Việt ngắn gọn]",
//     "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
//     "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó]",
//     "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
//     "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
//   }
// ]

// Danh sách từ của tôi:
// ${wordListText}`;
//     } 
    
//     if (selectedMode === 'story') {
//       return `Hãy đóng vai một chuyên gia ngôn ngữ. Viết một câu chuyện ngắn thú vị (khoảng 150-250 từ) bằng tiếng Anh sử dụng TẤT CẢ các từ vựng trong danh sách dưới đây để tôi học ngữ cảnh.

// Cấu trúc JSON yêu cầu (chỉ trả về JSON object, không kèm text giải thích):
// {
//   "title": "[Tên câu chuyện bằng tiếng Anh]",
//   "content_EN": "[Nội dung câu chuyện tiếng Anh. Bạn HÃY BỌC các từ vựng mục tiêu trong thẻ <mark>từ vựng</mark> để tôi dễ nhận biết]",
//   "content_VN": "[Bản dịch tiếng Việt cực kỳ mượt mà của câu chuyện trên]",
//   "vocabulary_used": [Mảng chứa các từ vựng tiếng Anh đã sử dụng]
// }

// Danh sách từ của tôi:
// ${wordListText}`;
//     }

//     return `Hãy tạo một bài tập điền từ vào chỗ trống (Fill in the blanks) để tôi ôn tập danh sách ${wordsToLearn.length} từ vựng dưới đây.

// Cấu trúc JSON yêu cầu (chỉ trả về mảng JSON, không kèm text giải thích):
// [
//   {
//     "question": "[Một câu tiếng Anh có chứa ngữ cảnh, nhưng vị trí của từ vựng mục tiêu bị thay thế bằng '________']",
//     "answer": "[Từ vựng đúng để điền vào chỗ trống]",
//     "hintVN": "[Gợi ý nghĩa tiếng Việt của câu hoặc của từ cần điền]"
//   }
// ]

// Danh sách từ của tôi:
// ${wordListText}`;

//   }, [selectedMode, wordsToLearn, wordListText]);

//   const handleCopyPrompt = () => {
//     navigator.clipboard.writeText(promptText).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const handleStart = () => {
//     try {
//       // REGEX: Làm sạch chuỗi JSON, loại bỏ các markdown (```json ... ```) mà AI hay thêm vào
// const cleanJsonString = jsonInput.replace(/
// http://googleusercontent.com/immersive_entry_chip/0
// src/components/FlashcardSetup.tsx
import React, { useState, useMemo } from 'react';
import { Copy, Play, ArrowLeft, Check, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { WordEntry, StudyMode } from '../types';

interface FlashcardSetupProps {
  wordsToLearn: WordEntry[];
  onBack: () => void;
  onStartPlay: (data: any, mode: StudyMode) => void;
}

export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StudyMode>('flashcard');

  const wordListText = useMemo(() => {
    return wordsToLearn
      .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
      .join('\n');
  }, [wordsToLearn]);

  const promptText = useMemo(() => {
    if (selectedMode === 'flashcard') {
      return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
[
  {
    "word": "[Từ tiếng Anh]",
    "pronunciation": "[Phiên âm IPA]",
    "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
    "meaningVN": "[Nghĩa tiếng Việt ngắn gọn]",
    "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
    "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó]",
    "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
    "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
  }
]

Danh sách từ của tôi:
${wordListText}`;
    } 
    
    if (selectedMode === 'story') {
      return `Hãy đóng vai một chuyên gia ngôn ngữ. Viết một câu chuyện ngắn thú vị (khoảng 150-250 từ) bằng tiếng Anh sử dụng TẤT CẢ các từ vựng trong danh sách dưới đây để tôi học ngữ cảnh.

Cấu trúc JSON yêu cầu (chỉ trả về JSON object, không kèm text giải thích):
{
  "title": "[Tên câu chuyện bằng tiếng Anh]",
  "content_EN": "[Nội dung câu chuyện tiếng Anh. Bạn HÃY BỌC các từ vựng mục tiêu trong thẻ <mark>từ vựng</mark> để tôi dễ nhận biết]",
  "content_VN": "[Bản dịch tiếng Việt cực kỳ mượt mà của câu chuyện trên]",
  "vocabulary_used": [Mảng chứa các từ vựng tiếng Anh đã sử dụng]
}

Danh sách từ của tôi:
${wordListText}`;
    }

    return `Hãy tạo một bài tập điền từ vào chỗ trống (Fill in the blanks) để tôi ôn tập danh sách ${wordsToLearn.length} từ vựng dưới đây.

Cấu trúc JSON yêu cầu (chỉ trả về mảng JSON, không kèm text giải thích):
[
  {
    "question": "[Một câu tiếng Anh có chứa ngữ cảnh, nhưng vị trí của từ vựng mục tiêu bị thay thế bằng '________']",
    "answer": "[Từ vựng đúng để điền vào chỗ trống]",
    "hintVN": "[Gợi ý nghĩa tiếng Việt của câu hoặc của từ cần điền]"
  }
]

Danh sách từ của tôi:
${wordListText}`;

  }, [selectedMode, wordsToLearn, wordListText]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStart = () => {
    try {
      // Đã dùng Regex an toàn hơn cho VS Code
      const cleanJsonString = jsonInput.replace(/```(json)?|```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);

      if (selectedMode === 'story') {
        if (!parsedData.title || !parsedData.content_EN) throw new Error("JSON thiếu title hoặc content_EN.");
      } else if (selectedMode === 'flashcard') {
        if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Flashcard JSON phải là mảng chứa các object có trường 'word'.");
      } else {
        if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Fill Blank JSON phải là mảng chứa các object có trường 'question'.");
      }

      setError(null);
      onStartPlay(parsedData, selectedMode);
    } catch (err: any) {
      setError("JSON không hợp lệ. Vui lòng kiểm tra lại cấu trúc: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Quay lại
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <Sparkles className="text-indigo-500" /> Setup AI Learning
      </h2>
      <p className="text-slate-500 mb-6">
        Chuẩn bị học bộ <strong className="text-indigo-600">{wordsToLearn.length} từ vựng</strong>. Hãy chọn chế độ học bạn muốn:
      </p>

      {/* Tabs Chế độ học */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
        <button 
          onClick={() => setSelectedMode('flashcard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'flashcard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Copy size={16} /> Lật thẻ (Flashcard)
        </button>
        <button 
          onClick={() => setSelectedMode('story')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'story' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={16} /> Ngữ cảnh (Story)
        </button>
        <button 
          onClick={() => setSelectedMode('fillblank')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'fillblank' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <PenTool size={16} /> Điền từ (Fill Blanks)
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-slate-700">Bước 1: Copy Prompt & Gửi cho AI</label>
          <button 
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Đã copy" : "Copy Prompt"}
          </button>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap h-40 overflow-y-auto">
          {promptText}
        </div>
      </div>

      <div className="mb-6">
        <label className="font-semibold text-slate-700 block mb-2">Bước 2: Dán kết quả JSON từ AI vào đây</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Dán JSON vào đây (có thể dán cả cụm chứa ```json)..."
          className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm"
        />
        {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
      </div>

      <button
        onClick={handleStart}
        disabled={!jsonInput.trim()}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
      >
        <Play fill="currentColor" size={20} /> Khởi động
      </button>
    </div>
  );
};