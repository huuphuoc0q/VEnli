// // // import React, { useState } from 'react';
// // // import { X, Upload, AlertCircle, FileText } from 'lucide-react';
// // // import { WordEntry } from '../types';

// // // interface ImportModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   onImport: (newWords: WordEntry[]) => void;
// // // }

// // // export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
// // //   const [rawText, setRawText] = useState('');
// // //   // Mặc định chọn ngày hôm nay
// // //   const [targetDate, setTargetDate] = useState(new Date().toLocaleDateString('en-CA'));
// // //   const [error, setError] = useState<string | null>(null);

// // //   if (!isOpen) return null;

// // //   const handleParseAndImport = () => {
// // //     if (!rawText.trim()) {
// // //       setError("Please paste some text to import.");
// // //       return;
// // //     }

// // //     const lines = rawText.split('\n');
// // //     const parsedWords: WordEntry[] = [];
// // //     let failCount = 0;

// // //     // Tính timestamp cho ngày được chọn (đặt giờ là 12:00 trưa để tránh lệch múi giờ)
// // //     const dateObj = new Date(targetDate);
// // //     dateObj.setHours(12, 0, 0, 0); 
// // //     const timestamp = dateObj.getTime();

// // //     lines.forEach(line => {
// // //       const cleanLine = line.trim();
// // //       if (!cleanLine) return;

// // //       // Xóa dấu chấm phẩy ; ở cuối nếu có
// // //       const content = cleanLine.endsWith(';') ? cleanLine.slice(0, -1) : cleanLine;
      
// // //       // Tách theo dấu gạch ngang -
// // //       const parts = content.split('-').map(p => p.trim());

// // //       // Kiểm tra định dạng: Phải có ít nhất 3 phần (Word - Type - Meaning)
// // //       if (parts.length >= 3) {
// // //         parsedWords.push({
// // //           id: crypto.randomUUID(),
// // //           word: parts[0],
// // //           type: parts[1], // Bạn có thể thêm logic chuẩn hóa Type ở đây nếu muốn
// // //           meaning: parts.slice(2).join('-'), // Nối lại phần còn lại nếu nghĩa có chứa dấu -
// // //           example: '',
// // //           timestamp: timestamp, // Sử dụng ngày user chọn
// // //         });
// // //       } else {
// // //         failCount++;
// // //       }
// // //     });

// // //     if (parsedWords.length === 0) {
// // //       setError("No valid lines found. Format: Word - Type - Meaning");
// // //       return;
// // //     }

// // //     onImport(parsedWords);
    
// // //     // Reset form
// // //     setRawText('');
// // //     setError(null);
// // //     onClose();

// // //     if (failCount > 0) {
// // //       alert(`Imported ${parsedWords.length} words. Skipped ${failCount} invalid lines.`);
// // //     }
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
// // //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between p-6 border-b border-slate-100">
// // //           <div>
// // //             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
// // //               <Upload size={24} className="text-indigo-600" />
// // //               Bulk Import
// // //             </h2>
// // //             <p className="text-sm text-slate-500 mt-1">Add multiple words quickly for any specific date.</p>
// // //           </div>
// // //           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
// // //             <X size={24} />
// // //           </button>
// // //         </div>

// // //         {/* Body */}
// // //         <div className="p-6 overflow-y-auto space-y-6">
          
// // //           {/* Date Picker */}
// // //           <div>
// // //             <label className="block text-sm font-semibold text-slate-700 mb-2">
// // //               Import for Date
// // //             </label>
// // //             <input 
// // //               type="date" 
// // //               value={targetDate}
// // //               onChange={(e) => setTargetDate(e.target.value)}
// // //               className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
// // //             />
// // //           </div>

// // //           {/* Text Area */}
// // //           <div>
// // //              <div className="flex justify-between mb-2">
// // //                 <label className="block text-sm font-semibold text-slate-700">
// // //                   Paste Vocabulary List
// // //                 </label>
// // //                 <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
// // //                     Format: Word - Type - Meaning
// // //                 </span>
// // //              </div>
// // //             <textarea
// // //               value={rawText}
// // //               onChange={(e) => setRawText(e.target.value)}
// // //               placeholder={`securely - Adverb - một cách chắc chắn;\nmonitor - Verb - quan sát theo dõi;`}
// // //               className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm leading-relaxed resize-none"
// // //             />
// // //             {error && (
// // //               <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
// // //                 <AlertCircle size={16} />
// // //                 {error}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Footer */}
// // //         <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
// // //           <button 
// // //             onClick={onClose}
// // //             className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
// // //           >
// // //             Cancel
// // //           </button>
// // //           <button 
// // //             onClick={handleParseAndImport}
// // //             className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
// // //           >
// // //             <FileText size={18} />
// // //             Parse & Import
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };
// // import React, { useState } from 'react';
// // import { X, Upload, AlertCircle, FileText, Code } from 'lucide-react';
// // import { WordEntry } from '../types';

// // interface ImportModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onImport: (newWords: WordEntry[]) => void;
// // }

// // export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
// //   const [rawText, setRawText] = useState('');
// //   // Mặc định chọn ngày hôm nay
// //   const [targetDate, setTargetDate] = useState(new Date().toLocaleDateString('sv')); 
// //   const [error, setError] = useState<string | null>(null);

// //   if (!isOpen) return null;

// //   const handleParseAndImport = () => {
// //     if (!rawText.trim()) {
// //       setError("Please paste some text or JSON to import.");
// //       return;
// //     }

// //     const trimmedInput = rawText.trim();
// //     let parsedWords: WordEntry[] = [];
    
// //     // Tính timestamp cho ngày được chọn (đặt giờ là 12:00 trưa)
// //     const dateObj = new Date(targetDate);
// //     dateObj.setHours(12, 0, 0, 0); 
// //     const selectedTimestamp = dateObj.getTime();

// //     // --- CÁCH 1: Xử lý nếu là JSON (Dữ liệu cũ của bạn) ---
// //     // if (trimmedInput.startsWith('[') || trimmedInput.startsWith('{')) {
// //     //   try {
// //     //     const jsonData = JSON.parse(trimmedInput);
        
// //     //     if (Array.isArray(jsonData)) {
// //     //       parsedWords = jsonData.map((item: any) => ({
// //     //         id: crypto.randomUUID(), // Tạo ID mới để tránh trùng
// //     //         word: item.word || '',
// //     //         type: item.type || 'Other',
// //     //         meaning: item.meaning || item.meaningVN || '', // Hỗ trợ cả field cũ
// //     //         example: item.example || '',
// //     //         timestamp: selectedTimestamp // Gán tất cả vào ngày bạn chọn
// //     //       }));
// //     //     }
// //     //   } catch (e) {
// //     //     // Nếu parse JSON lỗi thì thôi, chuyển sang cách 2
// //     //     console.warn("JSON parse failed, trying text mode");
// //     //   }
// //     // }
// // // --- CÁCH 1: Xử lý nếu là JSON (Dữ liệu cũ của bạn) ---
// //     if (trimmedInput.startsWith('[') || trimmedInput.startsWith('{')) {
// //       try {
// //         const jsonData = JSON.parse(trimmedInput);
        
// //         if (Array.isArray(jsonData)) {
// //           parsedWords = jsonData.map((item: any) => ({
// //             id: crypto.randomUUID(), // Tạo ID mới để tránh trùng
// //             word: item.word || '',
// //             type: item.type || 'Other',
// //             meaning: item.meaning || item.meaningVN || '', // Hỗ trợ cả field cũ
// //             example: item.example || '',
// //             // SỬA DÒNG NÀY: Ưu tiên lấy timestamp của JSON, nếu không có mới lấy ngày của Modal
// //             timestamp: item.timestamp ? Number(item.timestamp) : selectedTimestamp
// //           }));
// //         }
// //       } catch (e) {
// //         // Nếu parse JSON lỗi thì thôi, chuyển sang cách 2
// //         console.warn("JSON parse failed, trying text mode");
// //       }
// //     }
// //     // --- CÁCH 2: Xử lý nếu là Văn bản thường (Line-by-line) ---
// //     // Chỉ chạy nếu Cách 1 không ra kết quả nào
// //     if (parsedWords.length === 0) {
// //         const lines = rawText.split('\n');
// //         let failCount = 0;

// //         lines.forEach(line => {
// //         const cleanLine = line.trim();
// //         if (!cleanLine) return;

// //         // Xóa dấu chấm phẩy ; hoặc dấu phẩy , ở cuối nếu có
// //         const content = cleanLine.replace(/[;,]$/, '');
        
// //         // Tách theo dấu gạch ngang -
// //         const parts = content.split('-').map(p => p.trim());

// //         if (parts.length >= 2) {
// //             // Hỗ trợ 2 định dạng:
// //             // 1. Word - Meaning (2 phần)
// //             // 2. Word - Type - Meaning (3 phần)
            
// //             const w = parts[0];
// //             const t = parts.length > 2 ? parts[1] : 'Other'; // Nếu không có type thì để mặc định
// //             const m = parts.length > 2 ? parts.slice(2).join('-') : parts[1];

// //             parsedWords.push({
// //             id: crypto.randomUUID(),
// //             word: w,
// //             type: t, 
// //             meaning: m,
// //             example: '',
// //             timestamp: selectedTimestamp,
// //             });
// //         } else {
// //             failCount++;
// //         }
// //         });
// //     }

// //     if (parsedWords.length === 0) {
// //       setError("Could not parse data. Ensure it's valid JSON or 'Word - Type - Meaning' format.");
// //       return;
// //     }

// //     // Thực hiện Import
// //     onImport(parsedWords);
    
// //     // Reset và đóng modal
// //     setRawText('');
// //     setError(null);
// //     onClose();

// //     alert(`Successfully imported ${parsedWords.length} words into ${targetDate}!`);
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
// //         {/* Header */}
// //         <div className="flex items-center justify-between p-6 border-b border-slate-100">
// //           <div>
// //             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
// //               <Upload size={24} className="text-indigo-600" />
// //               Smart Import
// //             </h2>
// //             <p className="text-sm text-slate-500 mt-1">Supports both JSON data and plain text lists.</p>
// //           </div>
// //           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
// //             <X size={24} />
// //           </button>
// //         </div>

// //         {/* Body */}
// //         <div className="p-6 overflow-y-auto space-y-6">
          
// //           {/* Date Picker */}
// //           <div>
// //             <label className="block text-sm font-semibold text-slate-700 mb-2">
// //               Import to Date
// //             </label>
// //             <input 
// //               type="date" 
// //               value={targetDate}
// //               onChange={(e) => setTargetDate(e.target.value)}
// //               className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 font-medium"
// //             />
// //           </div>

// //           {/* Text Area */}
// //           <div>
// //              <div className="flex justify-between items-end mb-2">
// //                 <label className="block text-sm font-semibold text-slate-700">
// //                   Paste Data Here
// //                 </label>
// //                 <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
// //                     <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
// //                         <FileText size={10} /> Word - Type - Meaning
// //                     </span>
// //                     <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
// //                         <Code size={10} /> JSON Array
// //                     </span>
// //                 </div>
// //              </div>
// //             <textarea
// //               value={rawText}
// //               onChange={(e) => setRawText(e.target.value)}
// //               placeholder={`Paste your JSON data here OR use text format:\n\nsecurely - Adverb - một cách chắc chắn\nmonitor - Verb - quan sát theo dõi`}
// //               className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm leading-relaxed resize-none bg-slate-50"
// //             />
// //             {error && (
// //               <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
// //                 <AlertCircle size={16} />
// //                 {error}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
// //           <button 
// //             onClick={onClose}
// //             className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
// //           >
// //             Cancel
// //           </button>
// //           <button 
// //             onClick={handleParseAndImport}
// //             className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
// //           >
// //             <Upload size={18} />
// //             Import Words
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// import React, { useState } from 'react';
// import { X, Upload, AlertCircle, FileText, Code } from 'lucide-react';
// import { WordEntry } from '../types';

// interface ImportModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onImport: (newWords: WordEntry[]) => void;
// }

// export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
//   const [rawText, setRawText] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   if (!isOpen) return null;

//   const handleParseAndImport = () => {
//     if (!rawText.trim()) {
//       setError("Please paste some text or JSON to import.");
//       return;
//     }

//     const trimmedInput = rawText.trim();
//     let parsedWords: WordEntry[] = [];
    
//     // Mặc định cho dữ liệu mới (text thuần) là thời điểm hiện tại
//     const defaultTimestamp = Date.now();

//     // --- CÁCH 1: Xử lý nếu là JSON (Dữ liệu Backup) ---
//     if (trimmedInput.startsWith('[') || trimmedInput.startsWith('{')) {
//       try {
//         const jsonData = JSON.parse(trimmedInput);
        
//         if (Array.isArray(jsonData)) {
//           parsedWords = jsonData.map((item: any) => ({
//             id: crypto.randomUUID(), 
//             word: item.word || '',
//             type: item.type || 'Other',
//             meaning: item.meaning || item.meaningVN || '', 
//             example: item.example || '',
//             // Ưu tiên ngày lịch sử từ JSON, nếu không có mới lấy ngày hôm nay
//             timestamp: item.timestamp ? Number(item.timestamp) : defaultTimestamp 
//           }));
//         }
//       } catch (e) {
//         console.warn("JSON parse failed, trying text mode");
//       }
//     }

//     // --- CÁCH 2: Xử lý nếu là Văn bản thường (Line-by-line) ---
//     if (parsedWords.length === 0) {
//         const lines = rawText.split('\n');
//         let failCount = 0;

//         lines.forEach(line => {
//         const cleanLine = line.trim();
//         if (!cleanLine) return;

//         const content = cleanLine.replace(/[;,]$/, '');
//         const parts = content.split('-').map(p => p.trim());

//         if (parts.length >= 2) {
//             const w = parts[0];
//             const t = parts.length > 2 ? parts[1] : 'Other'; 
//             const m = parts.length > 2 ? parts.slice(2).join('-') : parts[1];

//             parsedWords.push({
//             id: crypto.randomUUID(),
//             word: w,
//             type: t, 
//             meaning: m,
//             example: '',
//             timestamp: defaultTimestamp, // Dữ liệu text luôn lấy ngày hôm nay
//             });
//         } else {
//             failCount++;
//         }
//         });
//     }

//     if (parsedWords.length === 0) {
//       setError("Could not parse data. Ensure it's valid JSON or 'Word - Type - Meaning' format.");
//       return;
//     }

//     // Thực hiện Import
//     onImport(parsedWords);
    
//     // Reset và đóng modal
//     setRawText('');
//     setError(null);
//     onClose();

//     // Sửa lại câu thông báo cho gọn gàng
//     alert(`Successfully imported ${parsedWords.length} words!`);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-slate-100">
//           <div>
//             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//               <Upload size={24} className="text-indigo-600" />
//               Smart Import
//             </h2>
//             <p className="text-sm text-slate-500 mt-1">Supports both JSON backups and plain text lists.</p>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
//             <X size={24} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 overflow-y-auto space-y-6">
//           {/* Text Area */}
//           <div>
//              <div className="flex justify-between items-end mb-2">
//                 <label className="block text-sm font-semibold text-slate-700">
//                   Paste Data Here
//                 </label>
//                 <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
//                     <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
//                         <FileText size={10} /> Word - Type - Meaning
//                     </span>
//                     <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
//                         <Code size={10} /> JSON Backup
//                     </span>
//                 </div>
//              </div>
//             <textarea
//               value={rawText}
//               onChange={(e) => setRawText(e.target.value)}
//               placeholder={`Paste your JSON backup data here OR use text format:\n\nsecurely - Adverb - một cách chắc chắn\nmonitor - Verb - quan sát theo dõi`}
//               className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm leading-relaxed resize-none bg-slate-50"
//             />
//             {error && (
//               <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
//           <button 
//             onClick={onClose}
//             className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
//           >
//             Cancel
//           </button>
//           <button 
//             onClick={handleParseAndImport}
//             className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
//           >
//             <Upload size={18} />
//             Import Words
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { X, Upload, AlertCircle, FileText, Code } from 'lucide-react';
import { WordEntry } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newWords: WordEntry[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseAndImport = () => {
    if (!rawText.trim()) {
      setError("Please paste some text or JSON to import.");
      return;
    }

    const trimmedInput = rawText.trim();
    let parsedWords: WordEntry[] = [];
    const defaultTimestamp = Date.now();

    if (trimmedInput.startsWith('[') || trimmedInput.startsWith('{')) {
      try {
        const jsonData = JSON.parse(trimmedInput);
        if (Array.isArray(jsonData)) {
          parsedWords = jsonData.map((item: any) => ({
            id: crypto.randomUUID(), 
            word: item.word || '',
            type: item.type || 'Other',
            meaning: item.meaning || item.meaningVN || '', 
            example: item.example || '',
            timestamp: item.timestamp ? Number(item.timestamp) : defaultTimestamp 
          }));
        }
      } catch (e) {
        console.warn("JSON parse failed, trying text mode");
      }
    }

    if (parsedWords.length === 0) {
        const lines = rawText.split('\n');
        let failCount = 0;

        lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return;

        const content = cleanLine.replace(/[;,]$/, '');
        const parts = content.split('-').map(p => p.trim());

        if (parts.length >= 2) {
            const w = parts[0];
            const t = parts.length > 2 ? parts[1] : 'Other'; 
            const m = parts.length > 2 ? parts.slice(2).join('-') : parts[1];

            parsedWords.push({
            id: crypto.randomUUID(),
            word: w,
            type: t, 
            meaning: m,
            example: '',
            timestamp: defaultTimestamp,
            });
        } else {
            failCount++;
        }
        });
    }

    if (parsedWords.length === 0) {
      setError("Could not parse data. Ensure it's valid JSON or 'Word - Type - Meaning' format.");
      return;
    }

    onImport(parsedWords);
    setRawText('');
    setError(null);
    onClose();
    alert(`Successfully imported ${parsedWords.length} words!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-transparent dark:border-slate-700 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Upload size={24} className="text-indigo-600 dark:text-indigo-400" />
              Smart Import
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Supports both JSON backups and plain text lists.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
             <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Paste Data Here
                </label>
                <div className="flex gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                        <FileText size={10} /> Word - Type - Meaning
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                        <Code size={10} /> JSON Backup
                    </span>
                </div>
             </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste your JSON backup data here OR use text format:\n\nsecurely - Adverb - một cách chắc chắn\nmonitor - Verb - quan sát theo dõi`}
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed resize-none bg-slate-50 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            />
            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3 transition-colors">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleParseAndImport}
            className="px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Upload size={18} />
            Import Words
          </button>
        </div>
      </div>
    </div>
  );
};