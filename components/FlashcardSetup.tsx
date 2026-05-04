// // // // // src/components/FlashcardSetup.tsx
// // // // import React, { useState, useMemo } from 'react';
// // // // import { Copy, Play, ArrowLeft, Check, Sparkles } from 'lucide-react';
// // // // import { FlashcardEntry, WordEntry } from '../types';

// // // // interface FlashcardSetupProps {
// // // //   wordsToLearn: WordEntry[]; // <-- Thêm prop này để nhận danh sách từ
// // // //   onBack: () => void;
// // // //   onStartPlay: (data: FlashcardEntry[]) => void;
// // // // }

// // // // export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
// // // //   const [jsonInput, setJsonInput] = useState('');
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [copied, setCopied] = useState(false);

// // // //   // Tự động tạo Prompt dựa trên danh sách từ được truyền vào
// // // //   const promptText = useMemo(() => {
// // // //     const wordListText = wordsToLearn
// // // //       .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
// // // //       .join('\n');

// // // //     return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

// // // // Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
// // // // [
// // // //   {
// // // //     "word": "[Từ tiếng Anh]",
// // // //     "pronunciation": "[Phiên âm IPA]",
// // // //     "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
// // // //     "meaningVN": "[Nghĩa tiếng Việt ngắn gọn (có thể dựa trên nghĩa tôi cung cấp)]",
// // // //     "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
// // // //     "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó (có thể dùng ví dụ của tôi hoặc tạo câu chuẩn hơn)]",
// // // //     "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
// // // //     "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
// // // //   }
// // // // ]

// // // // Danh sách từ của tôi:
// // // // ${wordListText}`;
// // // //   }, [wordsToLearn]);

// // // //   const handleCopyPrompt = () => {
// // // //     navigator.clipboard.writeText(promptText).then(() => {
// // // //       setCopied(true);
// // // //       setTimeout(() => setCopied(false), 2000);
// // // //     });
// // // //   };

// // // //   const handleStart = () => {
// // // //     try {
// // // //       const parsedData = JSON.parse(jsonInput);
// // // //       if (!Array.isArray(parsedData) || parsedData.length === 0) {
// // // //         throw new Error("Dữ liệu phải là một mảng JSON.");
// // // //       }
// // // //       if (!parsedData[0].word || !parsedData[0].meaningVN) {
// // // //          throw new Error("JSON thiếu các trường bắt buộc. Hãy kiểm tra lại kết quả của AI.");
// // // //       }
// // // //       setError(null);
// // // //       onStartPlay(parsedData);
// // // //     } catch (err: any) {
// // // //       setError("JSON không hợp lệ. Vui lòng kiểm tra lại lỗi cú pháp: " + err.message);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
// // // //       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
// // // //         <ArrowLeft size={18} className="mr-2" /> Quay lại
// // // //       </button>

// // // //       <div className="flex items-center justify-between mb-8">
// // // //         <div>
// // // //           <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
// // // //             <Sparkles className="text-indigo-500" /> Setup Flashcard AI
// // // //           </h2>
// // // //           <p className="text-slate-500">
// // // //             Bạn đang chuẩn bị học bộ <strong className="text-indigo-600">{wordsToLearn.length} từ vựng</strong>.
// // // //           </p>
// // // //         </div>
// // // //       </div>

// // // //       <div className="mb-8">
// // // //         <div className="flex items-center justify-between mb-2">
// // // //           <label className="font-semibold text-slate-700">Bước 1: Copy Prompt & Gửi cho AI</label>
// // // //           <button 
// // // //             onClick={handleCopyPrompt}
// // // //             className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
// // // //           >
// // // //             {copied ? <Check size={16} /> : <Copy size={16} />}
// // // //             {copied ? "Đã copy" : "Copy Prompt"}
// // // //           </button>
// // // //         </div>
// // // //         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap h-40 overflow-y-auto">
// // // //           {promptText}
// // // //         </div>
// // // //       </div>

// // // //       <div className="mb-6">
// // // //         <label className="font-semibold text-slate-700 block mb-2">Bước 2: Dán kết quả JSON từ AI vào đây</label>
// // // //         <textarea
// // // //           value={jsonInput}
// // // //           onChange={(e) => setJsonInput(e.target.value)}
// // // //           placeholder="[\n  {\n    'word': '...'\n  }\n]"
// // // //           className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm"
// // // //         />
// // // //         {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
// // // //       </div>

// // // //       <button
// // // //         onClick={handleStart}
// // // //         disabled={!jsonInput.trim()}
// // // //         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
// // // //       >
// // // //         <Play fill="currentColor" size={20} /> Bắt đầu học
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // };
// // // // src/components/FlashcardSetup.tsx
// // // import React, { useState, useMemo } from 'react';
// // // import { Copy, Play, ArrowLeft, Check, Sparkles, BookOpen, PenTool } from 'lucide-react';
// // // import { WordEntry, StudyMode } from '../types';

// // // interface FlashcardSetupProps {
// // //   wordsToLearn: WordEntry[];
// // //   onBack: () => void;
// // //   // Trả về data (any vì có thể là mảng Flashcard, Story object, hoặc mảng FillBlank) và chế độ tương ứng
// // //   onStartPlay: (data: any, mode: StudyMode) => void;
// // // }

// // // export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
// // //   const [jsonInput, setJsonInput] = useState('');
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [copied, setCopied] = useState(false);
// // //   const [selectedMode, setSelectedMode] = useState<StudyMode>('flashcard');

// // //   const wordListText = useMemo(() => {
// // //     return wordsToLearn
// // //       .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
// // //       .join('\n');
// // //   }, [wordsToLearn]);

// // //   // Tạo Prompt tương ứng với chế độ được chọn
// // //   const promptText = useMemo(() => {
// // //     if (selectedMode === 'flashcard') {
// // //       return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

// // // Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
// // // [
// // //   {
// // //     "word": "[Từ tiếng Anh]",
// // //     "pronunciation": "[Phiên âm IPA]",
// // //     "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
// // //     "meaningVN": "[Nghĩa tiếng Việt ngắn gọn]",
// // //     "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
// // //     "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó]",
// // //     "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
// // //     "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
// // //   }
// // // ]

// // // Danh sách từ của tôi:
// // // ${wordListText}`;
// // //     } 
    
// // //     if (selectedMode === 'story') {
// // //       return `Hãy đóng vai một chuyên gia ngôn ngữ. Viết một câu chuyện ngắn thú vị (khoảng 150-250 từ) bằng tiếng Anh sử dụng TẤT CẢ các từ vựng trong danh sách dưới đây để tôi học ngữ cảnh.

// // // Cấu trúc JSON yêu cầu (chỉ trả về JSON object, không kèm text giải thích):
// // // {
// // //   "title": "[Tên câu chuyện bằng tiếng Anh]",
// // //   "content_EN": "[Nội dung câu chuyện tiếng Anh. Bạn HÃY BỌC các từ vựng mục tiêu trong thẻ <mark>từ vựng</mark> để tôi dễ nhận biết]",
// // //   "content_VN": "[Bản dịch tiếng Việt cực kỳ mượt mà của câu chuyện trên]",
// // //   "vocabulary_used": [Mảng chứa các từ vựng tiếng Anh đã sử dụng]
// // // }

// // // Danh sách từ của tôi:
// // // ${wordListText}`;
// // //     }

// // //     return `Hãy tạo một bài tập điền từ vào chỗ trống (Fill in the blanks) để tôi ôn tập danh sách ${wordsToLearn.length} từ vựng dưới đây.

// // // Cấu trúc JSON yêu cầu (chỉ trả về mảng JSON, không kèm text giải thích):
// // // [
// // //   {
// // //     "question": "[Một câu tiếng Anh có chứa ngữ cảnh, nhưng vị trí của từ vựng mục tiêu bị thay thế bằng '________']",
// // //     "answer": "[Từ vựng đúng để điền vào chỗ trống]",
// // //     "hintVN": "[Gợi ý nghĩa tiếng Việt của câu hoặc của từ cần điền]"
// // //   }
// // // ]

// // // Danh sách từ của tôi:
// // // ${wordListText}`;

// // //   }, [selectedMode, wordsToLearn, wordListText]);

// // //   const handleCopyPrompt = () => {
// // //     navigator.clipboard.writeText(promptText).then(() => {
// // //       setCopied(true);
// // //       setTimeout(() => setCopied(false), 2000);
// // //     });
// // //   };

// // //   const handleStart = () => {
// // //     try {
// // //       // REGEX: Làm sạch chuỗi JSON, loại bỏ các markdown (```json ... ```) mà AI hay thêm vào
// // // const cleanJsonString = jsonInput.replace(/
// // // http://googleusercontent.com/immersive_entry_chip/0
// // // src/components/FlashcardSetup.tsx
// // import React, { useState, useMemo } from 'react';
// // import { Copy, Play, ArrowLeft, Check, Sparkles, BookOpen, PenTool } from 'lucide-react';
// // import { WordEntry, StudyMode } from '../types';

// // interface FlashcardSetupProps {
// //   wordsToLearn: WordEntry[];
// //   onBack: () => void;
// //   onStartPlay: (data: any, mode: StudyMode) => void;
// // }

// // export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
// //   const [jsonInput, setJsonInput] = useState('');
// //   const [error, setError] = useState<string | null>(null);
// //   const [copied, setCopied] = useState(false);
// //   const [selectedMode, setSelectedMode] = useState<StudyMode>('flashcard');

// //   const wordListText = useMemo(() => {
// //     return wordsToLearn
// //       .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
// //       .join('\n');
// //   }, [wordsToLearn]);

// //   const promptText = useMemo(() => {
// //     if (selectedMode === 'flashcard') {
// //       return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

// // Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
// // [
// //   {
// //     "word": "[Từ tiếng Anh]",
// //     "pronunciation": "[Phiên âm IPA]",
// //     "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
// //     "meaningVN": "[Nghĩa tiếng Việt ngắn gọn]",
// //     "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
// //     "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó]",
// //     "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
// //     "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
// //   }
// // ]

// // Danh sách từ của tôi:
// // ${wordListText}`;
// //     } 
    
// //     if (selectedMode === 'story') {
// //       return `Hãy đóng vai một chuyên gia ngôn ngữ. Viết một câu chuyện ngắn thú vị (khoảng 150-250 từ) bằng tiếng Anh sử dụng TẤT CẢ các từ vựng trong danh sách dưới đây để tôi học ngữ cảnh.

// // Cấu trúc JSON yêu cầu (chỉ trả về JSON object, không kèm text giải thích):
// // {
// //   "title": "[Tên câu chuyện bằng tiếng Anh]",
// //   "content_EN": "[Nội dung câu chuyện tiếng Anh. Bạn HÃY BỌC các từ vựng mục tiêu trong thẻ <mark>từ vựng</mark> để tôi dễ nhận biết]",
// //   "content_VN": "[Bản dịch tiếng Việt cực kỳ mượt mà của câu chuyện trên]",
// //   "vocabulary_used": [Mảng chứa các từ vựng tiếng Anh đã sử dụng]
// // }

// // Danh sách từ của tôi:
// // ${wordListText}`;
// //     }

// //     return `Hãy tạo một bài tập điền từ vào chỗ trống (Fill in the blanks) để tôi ôn tập danh sách ${wordsToLearn.length} từ vựng dưới đây.

// // Cấu trúc JSON yêu cầu (chỉ trả về mảng JSON, không kèm text giải thích):
// // [
// //   {
// //     "question": "[Một câu tiếng Anh có chứa ngữ cảnh, nhưng vị trí của từ vựng mục tiêu bị thay thế bằng '________']",
// //     "answer": "[Từ vựng đúng để điền vào chỗ trống]",
// //     "hintVN": "[Gợi ý nghĩa tiếng Việt của câu hoặc của từ cần điền]"
// //   }
// // ]

// // Danh sách từ của tôi:
// // ${wordListText}`;

// //   }, [selectedMode, wordsToLearn, wordListText]);

// //   const handleCopyPrompt = () => {
// //     navigator.clipboard.writeText(promptText).then(() => {
// //       setCopied(true);
// //       setTimeout(() => setCopied(false), 2000);
// //     });
// //   };

// //   const handleStart = () => {
// //     try {
// //       // Đã dùng Regex an toàn hơn cho VS Code
// //       const cleanJsonString = jsonInput.replace(/```(json)?|```/g, '').trim();
// //       const parsedData = JSON.parse(cleanJsonString);

// //       if (selectedMode === 'story') {
// //         if (!parsedData.title || !parsedData.content_EN) throw new Error("JSON thiếu title hoặc content_EN.");
// //       } else if (selectedMode === 'flashcard') {
// //         if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Flashcard JSON phải là mảng chứa các object có trường 'word'.");
// //       } else {
// //         if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Fill Blank JSON phải là mảng chứa các object có trường 'question'.");
// //       }

// //       setError(null);
// //       onStartPlay(parsedData, selectedMode);
// //     } catch (err: any) {
// //       setError("JSON không hợp lệ. Vui lòng kiểm tra lại cấu trúc: " + err.message);
// //     }
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
// //       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
// //         <ArrowLeft size={18} className="mr-2" /> Quay lại
// //       </button>

// //       <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
// //         <Sparkles className="text-indigo-500" /> Setup AI Learning
// //       </h2>
// //       <p className="text-slate-500 mb-6">
// //         Chuẩn bị học bộ <strong className="text-indigo-600">{wordsToLearn.length} từ vựng</strong>. Hãy chọn chế độ học bạn muốn:
// //       </p>

// //       {/* Tabs Chế độ học */}
// //       <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
// //         <button 
// //           onClick={() => setSelectedMode('flashcard')}
// //           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'flashcard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
// //         >
// //           <Copy size={16} /> Lật thẻ (Flashcard)
// //         </button>
// //         <button 
// //           onClick={() => setSelectedMode('story')}
// //           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'story' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
// //         >
// //           <BookOpen size={16} /> Ngữ cảnh (Story)
// //         </button>
// //         <button 
// //           onClick={() => setSelectedMode('fillblank')}
// //           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'fillblank' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
// //         >
// //           <PenTool size={16} /> Điền từ (Fill Blanks)
// //         </button>
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
// //           placeholder="Dán JSON vào đây (có thể dán cả cụm chứa ```json)..."
// //           className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm"
// //         />
// //         {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
// //       </div>

// //       <button
// //         onClick={handleStart}
// //         disabled={!jsonInput.trim()}
// //         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
// //       >
// //         <Play fill="currentColor" size={20} /> Khởi động
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
//       const cleanJsonString = jsonInput.replace(/```(json)?|```/g, '').trim();
//       const parsedData = JSON.parse(cleanJsonString);

//       if (selectedMode === 'story') {
//         if (!parsedData.title || !parsedData.content_EN) throw new Error("JSON thiếu title hoặc content_EN.");
//       } else if (selectedMode === 'flashcard') {
//         if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Flashcard JSON phải là mảng chứa các object có trường 'word'.");
//       } else {
//         if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Fill Blank JSON phải là mảng chứa các object có trường 'question'.");
//       }

//       setError(null);
//       onStartPlay(parsedData, selectedMode);
//     } catch (err: any) {
//       setError("JSON không hợp lệ. Vui lòng kiểm tra lại cấu trúc: " + err.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
//       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 font-medium transition-colors">
//         <ArrowLeft size={18} className="mr-2" /> Quay lại
//       </button>

//       <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
//         <Sparkles className="text-indigo-500" /> Setup AI Learning
//       </h2>
//       <p className="text-slate-500 dark:text-slate-400 mb-6">
//         Chuẩn bị học bộ <strong className="text-indigo-600 dark:text-indigo-400">{wordsToLearn.length} từ vựng</strong>. Hãy chọn chế độ học bạn muốn:
//       </p>

//       {/* Tabs Chế độ học */}
//       <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-8 transition-colors">
//         <button 
//           onClick={() => setSelectedMode('flashcard')}
//           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'flashcard' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
//         >
//           <Copy size={16} /> Lật thẻ (Flashcard)
//         </button>
//         <button 
//           onClick={() => setSelectedMode('story')}
//           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'story' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
//         >
//           <BookOpen size={16} /> Ngữ cảnh (Story)
//         </button>
//         <button 
//           onClick={() => setSelectedMode('fillblank')}
//           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedMode === 'fillblank' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
//         >
//           <PenTool size={16} /> Điền từ (Fill Blanks)
//         </button>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-2">
//           <label className="font-semibold text-slate-700 dark:text-slate-300">Bước 1: Copy Prompt & Gửi cho AI</label>
//           <button 
//             onClick={handleCopyPrompt}
//             className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors"
//           >
//             {copied ? <Check size={16} /> : <Copy size={16} />}
//             {copied ? "Đã copy" : "Copy Prompt"}
//           </button>
//         </div>
//         <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 font-mono whitespace-pre-wrap h-40 overflow-y-auto transition-colors">
//           {promptText}
//         </div>
//       </div>

//       <div className="mb-6">
//         <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Bước 2: Dán kết quả JSON từ AI vào đây</label>
//         <textarea
//           value={jsonInput}
//           onChange={(e) => setJsonInput(e.target.value)}
//           placeholder="Dán JSON vào đây (có thể dán cả cụm chứa ```json)..."
//           className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm dark:text-slate-200"
//         />
//         {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-medium">⚠️ {error}</p>}
//       </div>

//       <button
//         onClick={handleStart}
//         disabled={!jsonInput.trim()}
//         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
//       >
//         <Play fill="currentColor" size={20} /> Khởi động
//       </button>
//     </div>
//   );
// };
import React, { useState, useMemo } from 'react';
import { Play, ArrowLeft, Sparkles, BookOpen, PenTool, Loader2, Layers, Copy, Check, ClipboardPaste, Wand2, Zap } from 'lucide-react';
import { WordEntry, StudyMode } from '../types';
// Import hàm AI mới tạo
import { generateStudyMaterial } from '../services/aiService';

interface FlashcardSetupProps {
  wordsToLearn: WordEntry[];
  onBack: () => void;
  onStartPlay: (data: any, mode: StudyMode) => void;
}

export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<StudyMode>('flashcard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [inputMode, setInputMode] = useState<'auto' | 'manual'>('auto');

  const wordListText = useMemo(() => {
    return wordsToLearn
      .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
      .join('\n');
  }, [wordsToLearn]);

  // Tạo prompt để user copy gửi cho AI bên ngoài
  const promptText = useMemo(() => {
    const topicContext = topic ? `Topic: "${topic}".` : "No specific topic provided, use general contexts suitable for language learners.";

    if (selectedMode === 'flashcard') {
      return `Act as an expert English teacher and linguist for Vietnamese learners:

Your task is to analyze the following vocabulary based on the topic: ${topicContext}

Vocabulary list:
${wordListText}

STRICT REQUIREMENTS:
- Highlight the target word naturally in the example sentence (optional but recommended).
- Return EXACTLY one object for EACH word in the list (no missing or extra words).
- Ensure all explanations are clear, accurate, and suitable for learners at B1–C1 level.
- Use simple but precise English for definitions (avoid overly complex wording).
- Vietnamese translations must be natural, correct, and easy to understand.

EXAMPLE REQUIREMENTS:
- The example sentence MUST be realistic and meaningful.
- PRIORITIZE contexts related to:
  + C++ programming
  + Information Technology
  + Teaching / Education
- If not possible, use a practical real-life situation.
- The example must clearly demonstrate how the word is used in context (not just a generic sentence).

USAGE NOTE REQUIREMENTS:
- Provide at least ONE of the following:
  + A useful collocation
  + A synonym or contrast (if helpful)
  + A memory tip (easy way to remember the word)
- Keep it concise but practical.

LANGUAGE QUALITY:
- Avoid unnatural or forced sentences.
- Ensure correct grammar, collocation, and word usage.
- Use varied sentence structures across examples.

OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
[
  {
    "word": "[Từ tiếng Anh]",
    "pronunciation": "[Phiên âm IPA]",
    "partOfSpeech": "[Loại từ]",
    "meaningVN": "[Nghĩa tiếng Việt]",
    "definitionEN": "[Định nghĩa tiếng Anh]",
    "exampleEN": "[Ví dụ tiếng Anh. Bắt buộc: Ưu tiên ngữ cảnh Lập trình C++, Công nghệ thông tin, hoặc Sư phạm giảng dạy]",
    "exampleVN": "[Dịch nghĩa ví dụ]",
    "usageNote": "[Mẹo nhớ từ, từ đồng nghĩa hoặc collocation phổ biến]"
  }
]`;
    }

    if (selectedMode === 'story') {
      return `Act as a professional storyteller and English linguist for Vietnamese learners.

Write a short, engaging, and meaningful story in English (150–250 words) based on the topic: ${topicContext}

Vocabulary list:
${wordListText}

STRICT REQUIREMENTS:
- You MUST use ALL the vocabulary words provided (no missing words).
- Each word must be used in a grammatically correct and natural way.
- Do NOT force unnatural or awkward sentences just to include vocabulary.
- The story must have a clear structure: beginning → development → ending.
- Ensure logical flow, coherence, and smooth transitions between sentences.
- Use varied sentence structures (simple, compound, complex).
- Prefer natural collocations and realistic contexts.

VOCABULARY HIGHLIGHT RULE:
- Wrap EACH target word with <mark>...</mark> exactly as written in the list.
- Do NOT change the form of the word unless absolutely necessary for grammar (keep it recognizable).

LANGUAGE QUALITY:
- Writing level: B2–C1 (natural, expressive, and learner-friendly).
- Avoid repetition and unnatural phrasing.
- Make the story interesting, not just educational.

TRANSLATION REQUIREMENT:
- Translate the story into Vietnamese naturally and fluently.
- Do NOT translate word-by-word; prioritize meaning and readability.

OUTPUT FORMAT (STRICT JSON OBJECT, NO EXTRA TEXT):
{
  "title": "[Tên câu chuyện]",
  "content_EN": "[Nội dung tiếng Anh với các từ được bọc trong <mark>...</mark>]",
  "content_VN": "[Bản dịch tiếng Việt mượt mà, tự nhiên]",
  "vocabulary_used": [Các từ đã dùng]
}`;
    }

    return `Act as an expert English teacher for Vietnamese learners.

Create high-quality fill-in-the-blank exercises based on the topic: ${topicContext}

Vocabulary list:
${wordListText}

STRICT REQUIREMENTS:
- Generate EXACTLY one question for EACH word in the list (no missing or extra).
- Each sentence must be natural, meaningful, and context-rich (level B1–B2+).
- The sentence should reflect real-life, academic, or professional situations.
- PRIORITIZE contexts related to the given topic. If applicable, prefer:
  + Information Technology / Programming
  + Education / Teaching
- Replace ONLY the target word with "________".
- Do NOT create vague, overly simple, or artificial sentences.
- Ensure each sentence provides enough context for learners to infer the answer logically.
- Use a variety of sentence structures (avoid repetition).

WORD USAGE RULES:
- Use the correct grammatical form of the word.
- Do NOT change the word into a completely different form (keep it recognizable).
- Each word must be used exactly once.

WORD HINT REQUIREMENTS:
- Provide a helpful hint in Vietnamese.
- Include:
  + Part of speech (e.g., Danh từ, Động từ, Tính từ...)
  + Meaning in Vietnamese
  + OPTIONAL: first letter or word pattern (but do NOT make it too obvious)
- The hint must guide the learner without directly revealing the answer.

TRANSLATION REQUIREMENTS:
- Translate the sentence into natural Vietnamese.
- Keep "________" unchanged in the translated sentence.
- Ensure the translation reflects the correct meaning of the original sentence.

OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
[
  {
    "question": "[Câu tiếng Anh với '________']",
    "answer": "[Từ đúng để điền]",
    "wordHint": "[Gợi ý: từ loại + nghĩa + gợi ý thêm nếu cần]",
    "sentenceTranslation": "[Bản dịch tiếng Việt, giữ nguyên '________']"
  }
]`;
  }, [selectedMode, topic, wordListText]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanJsonString = text.replace(/```(json)?|```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);

      if (selectedMode === 'story') {
        if (!parsedData.title || !parsedData.content_EN) throw new Error("JSON thiếu title hoặc content_EN.");
      } else if (selectedMode === 'flashcard') {
        if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Flashcard JSON phải là mảng có trường 'word'.");
      } else {
        if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Fill Blank JSON phải là mảng có trường 'question'.");
      }

      setJsonInput(cleanJsonString);
      setPasted(true);
      setError(null);
      setTimeout(() => setPasted(false), 2000);
    } catch (err: any) {
      setError("Lỗi paste JSON: " + err.message);
    }
  };

  const handleStartFromJson = () => {
    try {
      const cleanJsonString = jsonInput.replace(/```(json)?|```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);

      if (selectedMode === 'story') {
        if (!parsedData.title || !parsedData.content_EN) throw new Error("JSON thiếu title hoặc content_EN.");
      } else if (selectedMode === 'flashcard') {
        if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Flashcard JSON phải là mảng có trường 'word'.");
      } else {
        if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Fill Blank JSON phải là mảng có trường 'question'.");
      }

      setError(null);
      onStartPlay(parsedData, selectedMode);
    } catch (err: any) {
      setError("JSON không hợp lệ: " + err.message);
    }
  };

  const handleStartAI = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // 1-Click: Gửi thẳng list từ cho AI và chờ kết quả
      const parsedData = await generateStudyMaterial(wordListText, selectedMode, topic);
      
      // Kiểm tra an toàn dữ liệu
      if (selectedMode === 'story') {
        if (!parsedData.title || !parsedData.content_EN) throw new Error("Dữ liệu AI trả về thiếu nội dung truyện.");
      } else if (selectedMode === 'flashcard') {
        if (!Array.isArray(parsedData) || !parsedData[0]?.word) throw new Error("Dữ liệu Flashcard AI trả về không đúng chuẩn.");
      } else {
        if (!Array.isArray(parsedData) || !parsedData[0]?.question) throw new Error("Dữ liệu bài tập AI trả về không đúng chuẩn.");
      }

      // Đẩy thẳng vào màn hình học
      onStartPlay(parsedData, selectedMode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
      <button
        onClick={onBack}
        disabled={isGenerating}
        className="flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 font-bold transition-colors disabled:opacity-50"
      >
        <ArrowLeft size={18} className="mr-2" /> Quay lại
      </button>

      <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
            AI Study Generator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Chuẩn bị tạo bài học cho <span className="text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md">{wordsToLearn.length} từ vựng</span>
          </p>
      </div>

      {/* Toggle Auto / Manual */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-6">
        <button
          onClick={() => setInputMode('auto')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${inputMode === 'auto' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Zap size={18} /> AI Tự động
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${inputMode === 'manual' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Wand2 size={18} /> Copy + Paste JSON
        </button>
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
          🎯 Chủ đề (để trống nếu muốn ngẫu nhiên)
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ví dụ: Bóng đá, Lập trình C++, TOEIC..."
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium transition-all"
          disabled={isGenerating}
        />
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setSelectedMode('flashcard')}
          disabled={isGenerating}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'flashcard' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200 dark:hover:border-slate-700'}`}
        >
          <Layers size={24} className={selectedMode === 'flashcard' ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="font-bold text-sm">Flashcard</span>
        </button>
        <button
          onClick={() => setSelectedMode('story')}
          disabled={isGenerating}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'story' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200 dark:hover:border-slate-700'}`}
        >
          <BookOpen size={24} className={selectedMode === 'story' ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="font-bold text-sm">Story</span>
        </button>
        <button
          onClick={() => setSelectedMode('fillblank')}
          disabled={isGenerating}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'fillblank' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200 dark:hover:border-slate-700'}`}
        >
          <PenTool size={24} className={selectedMode === 'fillblank' ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="font-bold text-sm">Fill Blanks</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* AUTO MODE */}
      {inputMode === 'auto' && (
        <button
          onClick={handleStartAI}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white py-5 rounded-2xl font-extrabold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={28} />
              AI đang soạn bài học...
            </>
          ) : (
            <>
              <Play fill="currentColor" size={28} />
              Tạo bài học & Bắt đầu ngay
            </>
          )}
        </button>
      )}

      {/* MANUAL MODE */}
      {inputMode === 'manual' && (
        <div className="space-y-4">
          {/* Copy Prompt */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Copy size={16} className="text-indigo-500" /> Bước 1: Copy Prompt
              </label>
              <button
                onClick={handleCopyPrompt}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-bold transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Đã copy!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Copy prompt → gửi AI (ChatGPT, Claude...) → copy kết quả JSON
            </p>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono whitespace-pre-wrap h-24 overflow-y-auto">
              {promptText}
            </div>
          </div>

          {/* Paste JSON */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ClipboardPaste size={16} className="text-indigo-500" /> Bước 2: Dán JSON
              </label>
              <button
                onClick={handlePasteJson}
                disabled={isGenerating || pasted}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-bold transition-colors"
              >
                {pasted ? <Check size={14} /> : <ClipboardPaste size={14} />}
                {pasted ? "Đã dán!" : "Dán"}
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Dán JSON (hoặc ```json ... ```) vào đây"
              className="w-full h-24 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none font-mono text-xs transition-all"
              disabled={isGenerating}
            />
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartFromJson}
            disabled={isGenerating || !jsonInput.trim()}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white py-4 rounded-2xl font-extrabold text-lg shadow-md hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <Play fill="currentColor" size={24} />
            Bắt đầu học với JSON
          </button>
        </div>
      )}
    </div>
  );
};