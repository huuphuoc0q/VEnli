export interface WordEntry {
  id: string;
  word: string;
  type: string; // e.g., Noun, Verb
  meaning: string;
  example: string;
  timestamp: number;
}
