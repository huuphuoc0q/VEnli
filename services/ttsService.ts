import { AppSettings } from '../types';

let currentSpeech: SpeechSynthesisUtterance | null = null;

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};

export const stopSpeech = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentSpeech = null;
};

export const speak = (
  text: string,
  settings?: { ttsRate?: number; ttsPitch?: number; ttsVoiceName?: string }
) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Dừng phát âm cũ nếu đang chạy
  stopSpeech();

  if (!text.trim()) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Áp dụng cấu hình
    utterance.rate = settings?.ttsRate ?? 1.0;
    utterance.pitch = settings?.ttsPitch ?? 1.0;

    // Tìm giọng đọc thích hợp
    const voices = getAvailableVoices();
    if (settings?.ttsVoiceName) {
      const selectedVoice = voices.find(v => v.name === settings.ttsVoiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      // Mặc định chọn giọng tiếng Anh chuẩn (Mỹ hoặc Anh)
      const englishVoice = voices.find(v => v.lang.startsWith('en-US')) || 
                           voices.find(v => v.lang.startsWith('en-')) || 
                           voices.find(v => v.lang === 'en');
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    currentSpeech = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Lỗi phát âm Speech Synthesis:", error);
  }
};
