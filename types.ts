// src/types.ts
export interface WordEntry {
  id: string;
  word: string;
  type: string;
  meaning: string;
  example: string;
  timestamp: number;
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

export type StudyMode = 'flashcard' | 'story' | 'fillblank';