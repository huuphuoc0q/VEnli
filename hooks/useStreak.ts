import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

const getLocalDateString = (timestamp?: number) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('sv'); 
};

export const useStreak = (user: User | null) => {
  const [streak, setStreak] = useState<number>(0);

  const streakKey = user ? `vocab-flow-streak-${user.uid}` : 'vocab-flow-streak-anonymous';
  const lastDateKey = user ? `vocab-flow-last-date-${user.uid}` : 'vocab-flow-last-date-anonymous';

  useEffect(() => {
    const savedStreak = localStorage.getItem(streakKey);
    const lastDate = localStorage.getItem(lastDateKey);
    const today = getLocalDateString();

    if (savedStreak && lastDate) {
      const s = parseInt(savedStreak, 10);
      if (lastDate === today) {
        setStreak(s); // Đã học hôm nay, giữ nguyên streak
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday.getTime());

        if (lastDate === yesterdayStr) {
          // Nếu ngày học cuối cùng là hôm qua, giữ nguyên streak
          setStreak(s);
        } else {
          // Quá 1 ngày không học -> Reset streak
          setStreak(0);
          localStorage.setItem(streakKey, '0');
        }
      }
    } else {
      setStreak(0);
    }
  }, [user, streakKey, lastDateKey]);

  const updateStreak = () => {
    const today = getLocalDateString();
    const lastDate = localStorage.getItem(lastDateKey);
    
    if (lastDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(streakKey, newStreak.toString());
      localStorage.setItem(lastDateKey, today);
    }
  };

  return { streak, updateStreak };
};
