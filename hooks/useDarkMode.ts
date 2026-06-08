import { useEffect } from 'react';

export const useDarkMode = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('vocab-flow-theme', 'dark');
  }, []);

  return { isDarkMode: true, toggleDarkMode: () => {} };
};
