// export interface WordEntry {
//   id: string;
//   word: string;
//   type: string; // e.g., Noun, Verb
//   meaning: string;
//   example: string;
//   timestamp: number;
// }
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