import { WordEntry } from '../types';

export interface SRSResult {
  srsLevel: number;
  srsInterval: number;
  nextReview: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const calculateNextSRS = (
  difficulty: 'again' | 'hard' | 'good' | 'easy',
  currentLevel: number = 1,
  currentInterval: number = 0
): SRSResult => {
  let nextLevel = currentLevel;
  let nextInterval = currentInterval;

  switch (difficulty) {
    case 'again':
      // Reset về cấp độ 1, ôn tập lại ngay trong ngày
      nextLevel = 1;
      nextInterval = 0; // 0 ngày (ôn tập ngay trong buổi học)
      break;

    case 'hard':
      // Giữ nguyên hoặc giảm nhẹ cấp độ, ôn lại vào ngày mai
      nextLevel = Math.max(1, currentLevel - 1);
      nextInterval = 1; // 1 ngày
      break;

    case 'good':
      // Tăng 1 cấp độ ghi nhớ, giãn cách ôn tập gấp đôi
      nextLevel = Math.min(5, currentLevel + 1);
      if (currentInterval === 0) {
        nextInterval = 1;
      } else if (currentInterval === 1) {
        nextInterval = 4;
      } else {
        nextInterval = Math.round(currentInterval * 2);
      }
      break;

    case 'easy':
      // Nhảy vọt lên cấp độ cao, giãn cách lớn
      nextLevel = Math.min(5, currentLevel + 2);
      if (currentInterval === 0) {
        nextInterval = 3;
      } else if (currentInterval === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(currentInterval * 3.5);
      }
      // Khống chế giãn cách tối đa là 90 ngày
      nextInterval = Math.min(90, nextInterval);
      break;
  }

  // Tính toán thời điểm ôn tập tiếp theo (timestamp)
  // Nếu interval = 0, đặt hẹn giờ là 5 phút tới thay vì cả ngày
  const delay = nextInterval === 0 ? 5 * 60 * 1000 : nextInterval * ONE_DAY_MS;
  const nextReview = Date.now() + delay;

  return {
    srsLevel: nextLevel,
    srsInterval: nextInterval,
    nextReview
  };
};

// Đếm số từ đến hạn ôn tập ngày hôm nay
export const getDueWordsCount = (words: WordEntry[]): number => {
  const now = Date.now();
  return words.filter(w => !w.nextReview || w.nextReview <= now).length;
};
