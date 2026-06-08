import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  VSTEPLevel,
  VSTEPExam,
  VSTEPListeningPart,
  VSTEPReadingPart,
  VSTEPWritingTask,
  VSTEPSpeakingTask
} from '../types';

// Thời gian thi VSTEP chuẩn (phút)
export const VSTEP_TIME_LIMITS = {
  listening: 45,
  reading: 60,
  writing: 60,
  speaking: 12
};

// ===== LOCAL STORAGE CACHE =====
const EXAM_STORAGE_KEY = 'vstep-cached-exam';
// Thêm hàm này ở đầu file vstepService.ts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Lưu đề thi vào localStorage
export const saveExamToStorage = (exam: VSTEPExam) => {
  try {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exam));
  } catch (e) {
    console.error('Lỗi lưu đề thi:', e);
  }
};

// Tải đề thi từ localStorage
export const loadExamFromStorage = (): VSTEPExam | null => {
  try {
    const saved = localStorage.getItem(EXAM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Lỗi tải đề thi:', e);
    return null;
  }
};

// Xóa đề thi đã lưu
export const clearCachedExam = () => {
  localStorage.removeItem(EXAM_STORAGE_KEY);
};

// Kiểm tra đề đã lưu chưa
export const hasCachedExam = (): boolean => {
  return !!localStorage.getItem(EXAM_STORAGE_KEY);
};

// ===== API FUNCTIONS =====

// Lấy API Key
const getApiKey = () => {
  return localStorage.getItem('user-gemini-key') || import.meta.env.VITE_GEMINI_API_KEY;
};

// Khởi tạo AI model
const getModel = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Vui lòng dán Gemini API Key ở thanh Header để sử dụng tính năng VSTEP!");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });
};

// Tạo phần Listening
export const generateListeningPart = async (level: VSTEPLevel): Promise<VSTEPListeningPart[]> => {
  const model = getModel();

  const levelContext = {
    B1: "Intermediate - có thể hiểu được các vấn đề quen thuộc, giao tiếp trong công việc, du lịch",
    B2: "Upper-Intermediate - có thể tương tác lưu loát với người bản ngữ, thảo luận các chủ đề trừu tượng",
    C1: "Advanced - có thể diễn đạt linh hoạt, hiểu nội dung phức tạp, sử dụng ngôn ngữ chuyên sâu",
    C2: "Proficient - hiểu hoàn toàn mọi loại ngôn ngữ, diễn đạt tự nhiên như người bản ngữ"
  };

  const prompt = `Tạo đề thi phần Nghe (Listening) VSTEP cấp độ ${level}.
${levelContext[level]}

Tạo 2 phần (Part):
- Part 1: ${level === 'B1' ? 'Nhiều lựa chọn (10 câu)' : 'Nhiều lựa chọn (12 câu)'}
- Part 2: ${level === 'B1' ? 'Điền vào chỗ trống (10 câu)' : 'Nghe và chọn đáp án đúng (12 câu)'}

Mỗi câu hỏi phải có:
- câu hỏi rõ ràng
- 4 đáp án A, B, C, D
- Đáp án đúng
- Giải thích ngắn

Trả về JSON theo cấu trúc:
{
  "parts": [
    {
      "partNumber": 1,
      "instructions": "Hướng dẫn tiếng Việt cho phần thi",
      "transcript": "Bảng transcript nghe (vì không có audio thật, tạo text mô phỏng)",
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi?",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": 0,
          "explanation": "Giải thích"
        }
      ]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    return data.parts;
  } catch (error) {
    console.error("Lỗi tạo phần nghe:", error);
    throw new Error("Không thể tạo đề nghe. Vui lòng thử lại.");
  }
};

// Tạo phần Reading
export const generateReadingPart = async (level: VSTEPLevel): Promise<VSTEPReadingPart[]> => {
  const model = getModel();

  const topics = level === 'B1'
    ? "chủ đề quen thuộc: du lịch, công việc, cuộc sống hàng ngày, sở thích"
    : level === 'B2'
    ? "chủ đề phổ biến: công nghệ, môi trường, giáo dục, sức khỏe, văn hóa"
    : "chủ đề chuyên sâu: kinh tế, chính trị, khoa học, văn học, xã hội";

  const prompt = `Tạo đề thi phần Đọc hiểu (Reading) VSTEP cấp độ ${level}.
Chủ đề: ${topics}

Tạo 3 phần (Part):
- Part 5: ${level === 'B1' ? 'Từ vựng & Ngữ pháp (15 câu)' : 'Từ vựng & Ngữ pháp (16 câu)'}
- Part 6: ${level === 'B1' ? 'Điền vào chỗ trống (10 câu)' : 'Điền vào chỗ trống (12 câu)'}
- Part 7: ${level === 'B1' ? 'Đọc hiểu văn bản (15 câu)' : 'Đọc hiểu văn bản (16 câu)'}

Mỗi câu hỏi phải có:
- câu hỏi rõ ràng
- 4 đáp án A, B, C, D
- Đáp án đúng
- Giải thích ngắn

Trả về JSON theo cấu trúc:
{
  "parts": [
    {
      "partNumber": 5,
      "title": "Tiêu đề bài đọc (nếu có)",
      "content": "Nội dung bài đọc...",
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi?",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": 0,
          "explanation": "Giải thích"
        }
      ]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    return data.parts;
  } catch (error) {
    console.error("Lỗi tạo phần đọc:", error);
    throw new Error("Không thể tạo đề đọc. Vui lòng thử lại.");
  }
};

// Tạo phần Writing
export const generateWritingTask = async (level: VSTEPLevel): Promise<VSTEPWritingTask[]> => {
  const model = getModel();

  const taskTypes = {
    B1: ["Email thân thiện", "Thư xin việc đơn giản", "Mô tả kinh nghiệm"],
    B2: ["Email doanh nghiệp", "Báo cáo ngắn", "Bài luận opinion"],
    C1: ["Báo cáo chuyên sâu", "Bài luận phân tích", "Proposal"],
    C2: ["Báo cáo chuyên nghiệp", "Bài luận học thuật", "Phân tích sâu"]
  };

  const prompt = `Tạo đề thi phần Viết (Writing) VSTEP cấp độ ${level}.
Tạo 2 bài viết:
1. Task 1: ${taskTypes[level][0]}
2. Task 2: ${taskTypes[level][1]}

Mỗi bài viết phải có:
- Yêu cầu chi tiết
- Số từ yêu cầu: ${level === 'B1' ? '60-80 từ cho Task 1, 80-100 từ cho Task 2' : '120-150 từ cho Task 1, 200-250 từ cho Task 2'}
- Tiêu chí chấm điểm cơ bản

Trả về JSON theo cấu trúc:
{
  "tasks": [
    {
      "taskNumber": 1,
      "taskType": "Email/Letter",
      "requirements": "Chi tiết yêu cầu bài viết...",
      "wordLimit": ${level === 'B1' ? 80 : 150}
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    return data.tasks;
  } catch (error) {
    console.error("Lỗi tạo phần viết:", error);
    throw new Error("Không thể tạo đề viết. Vui lòng thử lại.");
  }
};

// Tạo phần Speaking
export const generateSpeakingTask = async (level: VSTEPLevel): Promise<VSTEPSpeakingTask[]> => {
  const model = getModel();

  const prompt = `Tạo đề thi phần Nói (Speaking) VSTEP cấp độ ${level}.

Tạo 3 phần (Part):
- Part 1: ${level === 'B1' ? 'Hỏi đáp thông tin cá nhân (2-3 câu hỏi)' : 'Hỏi đáp về chủ đề quen thuộc (3-4 câu hỏi)'}
- Part 2: ${level === 'B1' ? 'Miêu tả tranh (1 phút chuẩn bị, 1 phút nói)' : 'Mini-talk về chủ đề cho sẵn (2 phút chuẩn bị, 2 phút nói)'}
- Part 3: ${level === 'B1' ? 'Trao đổi quan điểm (2 phút)' : 'Thảo luận tình huống (3 phút)'}

Mỗi phần phải có:
- Hướng dẫn chi tiết
- Thời gian chuẩn bị và trả lời
- Mẫu câu trả lời tốt
- Mẹo để đạt điểm cao

Trả về JSON theo cấu trúc:
{
  "tasks": [
    {
      "taskNumber": 1,
      "taskType": "Interview",
      "instructions": "Hướng dẫn chi tiết...",
      "preparationTime": 0,
      "responseTime": 1,
      "sampleResponse": "Mẫu câu trả lời...",
      "tips": ["Mẹo 1", "Mẹo 2"]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    return data.tasks;
  } catch (error) {
    console.error("Lỗi tạo phần nói:", error);
    throw new Error("Không thể tạo đề nói. Vui lòng thử lại.");
  }
};

// Tạo toàn bộ đề thi VSTEP
export const generateVSTEPExam = async (level: VSTEPLevel): Promise<VSTEPExam> => {
  // const [listening, reading, writing, speaking] = await Promise.all([
  //   generateListeningPart(level),
  //   generateReadingPart(level),
  //   generateWritingTask(level),
  //   generateSpeakingTask(level)
  // ]);
console.log("Đang tạo phần Nghe...");
const listening = await generateListeningPart(level);
await delay(10000); // Dừng 10 giây

console.log("Đang tạo phần Đọc...");
const reading = await generateReadingPart(level);
await delay(10000); // Dừng 10 giây

console.log("Đang tạo phần Viết...");
const writing = await generateWritingTask(level);
await delay(10000); // Dừng 10 giây

console.log("Đang tạo phần Nói...");
const speaking = await generateSpeakingTask(level);
  const exam: VSTEPExam = {
    id: crypto.randomUUID(),
    level,
    createdAt: Date.now(),
    sections: {
      listening,
      reading,
      writing,
      speaking
    },
    answers: {
      listening: {},
      reading: {}
    },
    writingSubmissions: [],
    speakingSubmissions: []
  };

  // Lưu vào localStorage để dùng lại không cần API
  saveExamToStorage(exam);

  return exam;
};

// Chấm điểm phần Writing bằng AI
export const gradeWritingTask = async (
  task: VSTEPWritingTask,
  submission: string
): Promise<{ feedback: any; score: number }> => {
  const model = getModel();

  const wordCount = submission.split(/\s+/).filter(w => w.length > 0).length;

  const prompt = `Bạn là giám khảo chấm thi VSTEP chuyên nghiệp.
Hãy chấm bài viết sau đây cho cấp độ ${task.taskType}.

Yêu cầu bài viết: ${task.requirements}
Giới hạn từ: ${task.wordLimit} từ
Số từ thực tế: ${wordCount}

Bài viết của thí sinh:
${submission}

Hãy chấm điểm theo tiêu chí:
1. Nội dung (Content): 5 điểm
2. Tổ chức (Organization): 5 điểm
3. Ngôn ngữ (Language): 5 điểm
4. Tổng: 15 điểm

Trả về JSON:
{
  "score": 10.5,
  "bandEstimate": "6.0",
  "feedback": "Nhận xét chung...",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "improvements": ["Cần cải thiện 1", "Cần cải thiện 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
    const feedback = JSON.parse(cleanJson);
    return {
      feedback,
      score: feedback.score
    };
  } catch (error) {
    console.error("Lỗi chấm điểm writing:", error);
    throw new Error("Không thể chấm điểm. Vui lòng thử lại.");
  }
};

// Tính điểm phần Listening và Reading
export const calculateObjectiveScore = (
  questions: { correctAnswer: number }[],
  answers: Record<number, number>
) => {
  let correct = 0;
  questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correct++;
    }
  });
  return {
    correct,
    total: questions.length,
    score: Math.round((correct / questions.length) * 100 * 10) / 10
  };
};

// Tính điểm VSTEP tổng kết
export const calculateVSTEPScore = (exam: VSTEPExam) => {
  // Listening
  const allListeningQuestions = exam.sections.listening.flatMap(p => p.questions);
  const listeningScore = calculateObjectiveScore(
    allListeningQuestions,
    exam.answers.listening
  );

  // Reading
  const allReadingQuestions = exam.sections.reading.flatMap(p => p.questions);
  const readingScore = calculateObjectiveScore(
    allReadingQuestions,
    exam.answers.reading
  );

  // Writing
  const writingScores = exam.writingSubmissions.map((sub, idx) => ({
    score: sub.content.length > 0 ? 10 : 0,
    feedback: "Chưa nộp bài",
    strengths: [] as string[],
    improvements: [] as string[],
    bandEstimate: "N/A"
  }));

  // Speaking (tạm thời)

  // Tính điểm tổng và band
  const avgScore = (listeningScore.score + readingScore.score) / 2;
  let band = "F";
  let passed = false;

  if (avgScore >= 90) { band = "C2"; passed = true; }
  else if (avgScore >= 80) { band = "C1"; passed = true; }
  else if (avgScore >= 70) { band = "B2"; passed = true; }
  else if (avgScore >= 60) { band = "B1"; passed = true; }
  else { band = "Below B1"; }

  return {
    listening: listeningScore,
    reading: readingScore,
    writing: {
      task1: writingScores[0] || { score: 0, feedback: "Chưa nộp", strengths: [], improvements: [], bandEstimate: "N/A" },
      task2: writingScores[1] || { score: 0, feedback: "Chưa nộp", strengths: [], improvements: [], bandEstimate: "N/A" },
      totalScore: writingScores.reduce((sum, s) => sum + s.score, 0)
    },
    speaking: {
      task1: 0,
      task2: 0,
      task3: 0,
      totalScore: 0
    },
    overall: {
      band,
      passed
    }
  };
};