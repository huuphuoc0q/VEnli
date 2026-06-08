// src/types.ts
export interface WordEntry {
  id: string;
  word: string;
  type: string;
  meaning: string;
  example: string;
  timestamp: number;
  // Spaced Repetition System (SRS) fields
  srsLevel?: number;       // Cấp độ từ 1 (quên hẳn) đến 5 (thuộc lòng)
  nextReview?: number;     // Timestamp thời điểm cần ôn tập tiếp theo
  srsInterval?: number;    // Khoảng thời gian ôn tập (ngày)
  lastDifficulty?: 'again' | 'hard' | 'good' | 'easy'; // Đánh giá độ khó gần nhất
}

export interface FlashcardEntry {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaningVN: string;
  definitionEN: string;
  exampleEN: string;
  exampleVN: string;
  usageNote?: string;
}

export interface StoryEntry {
  title: string;
  content_EN: string;
  content_VN: string;
  vocabulary_used: string[];
}

export interface FillBlankEntry {
  question: string; // Câu tiếng Anh có chứa chỗ trống "________"
  answer: string;   // Từ vựng đúng để điền vào
  hintVN: string;   // Gợi ý nghĩa tiếng Việt
}

export type StudyMode = 'flashcard' | 'story' | 'fillblank' | 'srs' | 'dashboard' | 'settings';

// VSTEP Exam Types
export type VSTEPLevel = 'B1' | 'B2' | 'C1' | 'C2';

export type VSTEPSection = 'listening' | 'reading' | 'writing' | 'speaking';

export interface VSTEPTimer {
  listening: number; // phút
  reading: number;   // phút
  writing: number;   // phút
  speaking: number;  // phút
}

// Listening
export interface VSTEPListeningPart {
  partNumber: number;
  instructions: string;
  audioUrl?: string; // URL audio hoặc text transcript
  transcript?: string; // Transcript nếu không có audio
  questions: VSTEPListeningQuestion[];
}

export interface VSTEPListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index của đáp án đúng
  explanation?: string;
}

// Reading
export interface VSTEPReadingPart {
  partNumber: number;
  title: string;
  content: string;
  time: number; // phút
  questions: VSTEPReadingQuestion[];
}

export interface VSTEPReadingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// Writing
export interface VSTEPWritingTask {
  taskNumber: number;
  taskType: string; // Email/Letter, Essay, Report, etc.
  requirements: string;
  wordLimit: number;
  sampleAnswer?: string;
  scoringCriteria?: {
    content: number;
    organization: number;
    language: number;
  };
}

export interface VSTEPWritingSubmission {
  taskId: number;
  content: string;
  wordCount: number;
  submittedAt: number;
}

export interface VSTEPWritingFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  bandEstimate: string;
}

// Speaking
export interface VSTEPSpeakingTask {
  taskNumber: number;
  taskType: string; // Interview, Mini-talk, Topic discussion
  instructions: string;
  preparationTime: number; // phút
  responseTime: number; // phút
  sampleResponse?: string;
  tips: string[];
}

export interface VSTEPSpeakingSubmission {
  taskId: number;
  responseText?: string; // Transcript nếu có
  audioUrl?: string;
  submittedAt: number;
}

// Full Exam
export interface VSTEPExam {
  id: string;
  level: VSTEPLevel;
  createdAt: number;
  sections: {
    listening: VSTEPListeningPart[];
    reading: VSTEPReadingPart[];
    writing: VSTEPWritingTask[];
    speaking: VSTEPSpeakingTask[];
  };
  answers: {
    listening: Record<number, number>;
    reading: Record<number, number>;
  };
  writingSubmissions: VSTEPWritingSubmission[];
  speakingSubmissions: VSTEPSpeakingSubmission[];
}

export interface VSTEPScore {
  listening: {
    correct: number;
    total: number;
    score: number;
  };
  reading: {
    correct: number;
    total: number;
    score: number;
  };
  writing: {
    task1: VSTEPWritingFeedback;
    task2: VSTEPWritingFeedback;
    totalScore: number;
  };
  speaking: {
    task1: number;
    task2: number;
    task3: number;
    totalScore: number;
  };
  overall: {
    band: string;
    passed: boolean;
  };
}

// App Settings & Firebase Config
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AppSettings {
  geminiApiKey: string;
  firebaseEnabled: boolean;
  firebaseConfig: FirebaseConfig | null;
  ttsRate: number; // Tốc độ đọc (0.5 to 2)
  ttsPitch: number; // Cao độ (0.5 to 2)
  ttsVoiceName?: string; // Tên giọng đọc được chọn
}

// Gamification Types
export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastDate?: string;
}