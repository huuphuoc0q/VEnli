import React, { useState } from 'react';
import { ArrowLeft, ArrowDown, ArrowRight, FileText, Headphones, PenTool, Mic, Check, Loader2, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react';
import type { VSTEPLevel, VSTEPExam, VSTEPListeningPart, VSTEPReadingPart, VSTEPWritingTask, VSTEPSpeakingTask } from '../types';

// Prompt mẫu chuẩn VSTEP cho từng phần
const VSTEP_PROMPTS = {
  listening: (level: string) => `Trở thành một người chuyên viết kịch bản hội thoại và ra đề thi Listening VSTEP B1-B2-C1. Hãy tạo mô phỏng text cho một đề thi Nghe gồm 3 phần (Part 1: 8 đoạn thông báo/hội thoại cực ngắn - tương ứng 8 câu hỏi; Part 2: 3 đoạn hội thoại dài - tương ứng 12 câu hỏi; Part 3: 3 bài giảng/bài thuyết trình dài - tương ứng 15 câu hỏi). Tổng cộng 35 câu hỏi. Nội dung transcript cần mang văn phong nói tự nhiên bằng tiếng Anh (có từ lấp chỗ trống, sự do dự). Hãy kèm theo hệ thống câu hỏi trắc nghiệm với 4 lựa chọn (A,B,C,D), chỉ định đáp án đúng dưới dạng số (0-3) và có giải thích ngắn.
Vui lòng chỉ trả về kết quả bằng định dạng JSON thuần túy theo chính xác cấu trúc sau:
{
  "parts": [
    {
      "partNumber": 1,
      "instructions": "Hướng dẫn tiếng Việt cho phần thi",
      "transcript": "Bảng transcript nghe (mô phỏng - không có audio thật, tạo text mô phỏng nội dung nghe)",
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi?",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": 0,
          "explanation": "Giải thích ngắn"
        }
      ]
    }
  ]
}`,
  reading: (level: string) => `Đóng vai là một chuyên gia ngôn ngữ học chuyên thiết kế tài liệu luyện thi VSTEP. Hãy thiết kế một đề thi Đọc hiểu (Reading) mô phỏng kỳ thi VSTEP. Đề bài cần có 4 phần (parts/passages). Mỗi bài đọc có độ dài khoảng 400-500 từ về các chủ đề học thuật hoặc đời sống (Khoa học, Lịch sử, Văn hóa, Đời sống). Mỗi bài đọc đi kèm đúng 10 câu hỏi trắc nghiệm (tổng 40 câu) quét qua nhiều kỹ năng: tìm ý chính, từ vựng theo ngữ cảnh, câu hỏi suy luận, và chi tiết cụ thể. Đáp án đúng được mã hóa thành các số nguyên (0 tương ứng A, 1 tương ứng B, 2 tương ứng C, 3 tương ứng D). Giải thích ngắn gọn lý do tại sao đáp án đó là đúng để giúp người học.
Vui lòng chỉ trả về kết quả bằng định dạng JSON thuần túy theo chính xác cấu trúc sau:
{
  "parts": [
    {
      "partNumber": 5,
      "title": "Tiêu đề bài đọc",
      "content": "Nội dung bài đọc...",
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi?",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": 0,
          "explanation": "Giải thích ngắn"
        }
      ]
    }
  ]
}`,
  writing: (level: string) => `Bạn là một giám khảo chuyên ra đề và chấm thi VSTEP. Hãy tạo ra một đề thi Writing VSTEP B1-B2-C1 hoàn chỉnh thời gian 60 phút gồm 2 Task. Task 1 (Email/Letter): Cung cấp một tình huống thực tế (ví dụ: phàn nàn dịch vụ, xin lỗi người hàng xóm, hoặc hỏi thông tin khách sạn) yêu cầu thí sinh viết một bức thư phản hồi phản ánh đúng văn phong trang trọng hoặc thân mật. Task 2 (Essay): Cung cấp một đề bài nghị luận xã hội mang tính thời sự (ví dụ: xu hướng sống một mình, làm thêm của sinh viên) yêu cầu thí sinh phân tích lợi/hại hoặc nêu quan điểm cá nhân.
Vui lòng chỉ trả về kết quả bằng định dạng JSON thuần túy theo chính xác cấu trúc sau:
{
  "tasks": [
    {
      "taskNumber": 1,
      "taskType": "Email/Letter",
      "requirements": "Chi tiết yêu cầu bài viết...",
      "wordLimit": ${level === 'B1' ? '80' : '150'}
    }
  ]
}`,
  speaking: (level: string) => `Đóng vai là một chuyên gia khảo thí ngôn ngữ và ra đề VSTEP cấp độ B1-B2-C1. Hãy tạo một đề thi Speaking VSTEP mô phỏng chuẩn xác cấu trúc 3 phần. Part 1 (Social Interaction): Gồm 2 chủ đề giao tiếp xã hội quen thuộc, mỗi chủ đề 3 câu hỏi. Part 2 (Solution Discussion): Đưa ra 1 tình huống thực tế kèm 3 lựa chọn giải pháp để thí sinh cân nhắc. Part 3 (Topic Development): Đưa ra 1 chủ đề nghị luận (ví dụ: công nghệ, giáo dục, môi trường) kèm theo 3 gợi ý cốt lõi để phát triển ý. Với mỗi phần, hãy ghi rõ hướng dẫn chi tiết, thời gian chuẩn bị, thời gian trả lời phù hợp (tính bằng phút) và cung cấp các mẹo (tips) trả lời ăn điểm.
Vui lòng chỉ trả về kết quả bằng định dạng JSON thuần túy theo chính xác cấu trúc sau, không thêm bất kỳ văn bản nào khác:
{
  "tasks": [
    {
      "taskNumber": 1,
      "taskType": "Interview",
      "instructions": "Hướng dẫn chi tiết...",
      "preparationTime": 1,
      "responseTime": 1,
      "tips": ["Mẹo 1", "Mẹo 2"]
    }
  ]
}`
};

// Hàm validate JSON
const validateAndParse = (jsonStr: string): any => {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('JSON không hợp lệ! Vui lòng kiểm tra lại.');
  }
};

interface ManualVSTEPSetupProps {
  onBack: () => void;
  onStartExam: (exam: VSTEPExam) => void;
}

export const ManualVSTEPSetup: React.FC<ManualVSTEPSetupProps> = ({ onBack, onStartExam }) => {
  const [selectedLevel, setSelectedLevel] = useState<VSTEPLevel>('B2');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // JSON inputs for each section
  const [listeningJson, setListeningJson] = useState('');
  const [readingJson, setReadingJson] = useState('');
  const [writingJson, setWritingJson] = useState('');
  const [speakingJson, setSpeakingJson] = useState('');

  // Copy status
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyPrompt = (section: 'listening' | 'reading' | 'writing' | 'speaking') => {
    const prompt = VSTEP_PROMPTS[section](selectedLevel);
    navigator.clipboard.writeText(prompt);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Expanded sections
  const [expanded, setExpanded] = useState({
    listening: true,
    reading: false,
    writing: false,
    speaking: false
  });

  const levels: { level: VSTEPLevel; label: string }[] = [
    { level: 'B1', label: 'B1 - Threshold' },
    { level: 'B2', label: 'B2 - Vantage' },
    { level: 'C1', label: 'C1 - Advanced' },
    { level: 'C2', label: 'C2 - Proficiency' }
  ];

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Parse and validate each section
      let listeningParts: VSTEPListeningPart[] = [];
      let readingParts: VSTEPReadingPart[] = [];
      let writingTasks: VSTEPWritingTask[] = [];
      let speakingTasks: VSTEPSpeakingTask[] = [];

      // Parse Listening
      if (listeningJson.trim()) {
        const data = validateAndParse(listeningJson);
        // AI có thể trả về {parts: [...]} hoặc [...]
        listeningParts = data.parts || data;
        if (!Array.isArray(listeningParts)) {
          throw new Error('Listening: JSON phải là mảng hoặc object có key "parts"');
        }
      }

      // Parse Reading
      if (readingJson.trim()) {
        const data = validateAndParse(readingJson);
        readingParts = data.parts || data;
        if (!Array.isArray(readingParts)) {
          throw new Error('Reading: JSON phải là mảng hoặc object có key "parts"');
        }
      }

      // Parse Writing
      if (writingJson.trim()) {
        const data = validateAndParse(writingJson);
        writingTasks = data.tasks || data;
        if (!Array.isArray(writingTasks)) {
          throw new Error('Writing: JSON phải là mảng hoặc object có key "tasks"');
        }
      }

      // Parse Speaking
      if (speakingJson.trim()) {
        const data = validateAndParse(speakingJson);
        speakingTasks = data.tasks || data;
        if (!Array.isArray(speakingTasks)) {
          throw new Error('Speaking: JSON phải là mảng hoặc object có key "tasks"');
        }
      }

      // Validate at least one section
      if (listeningParts.length === 0 && readingParts.length === 0 && writingTasks.length === 0 && speakingTasks.length === 0) {
        throw new Error('Vui lòng nhập ít nhất một phần thi!');
      }

      const exam: VSTEPExam = {
        id: crypto.randomUUID(),
        level: selectedLevel,
        createdAt: Date.now(),
        sections: {
          listening: listeningParts,
          reading: readingParts,
          writing: writingTasks,
          speaking: speakingTasks
        },
        answers: {
          listening: {},
          reading: {}
        },
        writingSubmissions: [],
        speakingSubmissions: []
      };

      // Save to localStorage
      localStorage.setItem('vstep-cached-exam', JSON.stringify(exam));

      onStartExam(exam);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nhập JSON thủ công</h2>
          <p className="text-slate-500 dark:text-slate-400">Dán JSON cho mỗi phần thi VSTEP</p>
        </div>
      </div>

      {/* Select Level */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Cấp độ thi</label>
        <div className="flex gap-2">
          {levels.map(l => (
            <button
              key={l.level}
              onClick={() => setSelectedLevel(l.level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedLevel === l.level
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Listening Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection('listening')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <Headphones className="text-indigo-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">1. Phần Nghe (Listening)</span>
          </div>
          {expanded.listening ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expanded.listening && (
          <div className="p-4 pt-0 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Copy prompt → AI → Paste JSON vào đây</p>
              <button
                onClick={() => handleCopyPrompt('listening')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  copiedSection === 'listening'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {copiedSection === 'listening' ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copiedSection === 'listening' ? 'Đã copy!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={listeningJson}
              onChange={(e) => setListeningJson(e.target.value)}
              placeholder={`Dán JSON phần Nghe vào đây...`}
              className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
            <p className="text-xs text-slate-400 mt-2">
              Cấu trúc: {"{ parts: [...] }"} với partNumber, instructions, transcript, questions
            </p>
          </div>
        )}
      </div>

      {/* Reading Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection('reading')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-indigo-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">2. Phần Đọc (Reading)</span>
          </div>
          {expanded.reading ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expanded.reading && (
          <div className="p-4 pt-0 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Copy prompt → AI → Paste JSON vào đây</p>
              <button
                onClick={() => handleCopyPrompt('reading')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  copiedSection === 'reading'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {copiedSection === 'reading' ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copiedSection === 'reading' ? 'Đã copy!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={readingJson}
              onChange={(e) => setReadingJson(e.target.value)}
              placeholder={`Dán JSON phần Đọc vào đây...`}
              className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
            <p className="text-xs text-slate-400 mt-2">
              Cấu trúc: {"{ parts: [...] }"} với partNumber, title, content, questions
            </p>
          </div>
        )}
      </div>

      {/* Writing Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection('writing')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <PenTool className="text-indigo-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">3. Phần Viết (Writing)</span>
          </div>
          {expanded.writing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expanded.writing && (
          <div className="p-4 pt-0 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Copy prompt → AI → Paste JSON vào đây</p>
              <button
                onClick={() => handleCopyPrompt('writing')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  copiedSection === 'writing'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {copiedSection === 'writing' ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copiedSection === 'writing' ? 'Đã copy!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={writingJson}
              onChange={(e) => setWritingJson(e.target.value)}
              placeholder={`Dán JSON phần Viết vào đây...`}
              className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
            <p className="text-xs text-slate-400 mt-2">
              Cấu trúc: {"{ tasks: [...] }"} với taskNumber, taskType, requirements, wordLimit
            </p>
          </div>
        )}
      </div>

      {/* Speaking Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('speaking')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <Mic className="text-indigo-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">4. Phần Nói (Speaking)</span>
          </div>
          {expanded.speaking ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expanded.speaking && (
          <div className="p-4 pt-0 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Copy prompt → AI → Paste JSON vào đây</p>
              <button
                onClick={() => handleCopyPrompt('speaking')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  copiedSection === 'speaking'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {copiedSection === 'speaking' ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copiedSection === 'speaking' ? 'Đã copy!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={speakingJson}
              onChange={(e) => setSpeakingJson(e.target.value)}
              placeholder={`Dán JSON phần Nói vào đây...`}
              className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
            <p className="text-xs text-slate-400 mt-2">
              Cấu trúc: {"{ tasks: [...] }"} với taskNumber, taskType, instructions, preparationTime, responseTime, tips
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isGenerating}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          !isGenerating
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Đang xử lý...
          </span>
        ) : (
          'Bắt đầu thi'
        )}
      </button>

      <p className="text-center text-slate-400 text-sm mt-4">
        Nhập ít nhất 1 phần thi để bắt đầu
      </p>
    </div>
  );
};
