// src/components/FlashcardSetup.tsx
import React, { useState, useMemo } from 'react';
import { Copy, Play, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { FlashcardEntry, WordEntry } from '../types';

interface FlashcardSetupProps {
  wordsToLearn: WordEntry[]; // <-- Thêm prop này để nhận danh sách từ
  onBack: () => void;
  onStartPlay: (data: FlashcardEntry[]) => void;
}

export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ wordsToLearn, onBack, onStartPlay }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Tự động tạo Prompt dựa trên danh sách từ được truyền vào
  const promptText = useMemo(() => {
    const wordListText = wordsToLearn
      .map((w, index) => `${index + 1}. ${w.word} (Nghĩa: ${w.meaning}${w.example ? `, Ví dụ: ${w.example}` : ''})`)
      .join('\n');

    return `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Tôi có danh sách ${wordsToLearn.length} từ vựng dưới đây. Nhiệm vụ của bạn là phân tích từng từ, làm phong phú thêm thông tin và tạo ra một mảng JSON chính xác theo cấu trúc.

Cấu trúc JSON yêu cầu (chỉ trả về JSON, không kèm text giải thích):
[
  {
    "word": "[Từ tiếng Anh]",
    "pronunciation": "[Phiên âm IPA]",
    "partOfSpeech": "[Loại từ: NOUN, VERB, ADJECTIVE, v.v.]",
    "meaningVN": "[Nghĩa tiếng Việt ngắn gọn (có thể dựa trên nghĩa tôi cung cấp)]",
    "definitionEN": "[Định nghĩa tiếng Anh đơn giản]",
    "exampleEN": "[Ví dụ câu tiếng Anh chứa từ đó (có thể dùng ví dụ của tôi hoặc tạo câu chuẩn hơn)]",
    "exampleVN": "[Bản dịch tiếng Việt của câu ví dụ]",
    "usageNote": "[Ghi chú cách dùng hoặc mẹo nhớ từ - Tùy chọn]"
  }
]

Danh sách từ của tôi:
${wordListText}`;
  }, [wordsToLearn]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStart = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error("Dữ liệu phải là một mảng JSON.");
      }
      if (!parsedData[0].word || !parsedData[0].meaningVN) {
         throw new Error("JSON thiếu các trường bắt buộc. Hãy kiểm tra lại kết quả của AI.");
      }
      setError(null);
      onStartPlay(parsedData);
    } catch (err: any) {
      setError("JSON không hợp lệ. Vui lòng kiểm tra lại lỗi cú pháp: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Quay lại
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Sparkles className="text-indigo-500" /> Setup Flashcard AI
          </h2>
          <p className="text-slate-500">
            Bạn đang chuẩn bị học bộ <strong className="text-indigo-600">{wordsToLearn.length} từ vựng</strong>.
          </p>
        </div>
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
          placeholder="[\n  {\n    'word': '...'\n  }\n]"
          className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm"
        />
        {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
      </div>

      <button
        onClick={handleStart}
        disabled={!jsonInput.trim()}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
      >
        <Play fill="currentColor" size={20} /> Bắt đầu học
      </button>
    </div>
  );
};