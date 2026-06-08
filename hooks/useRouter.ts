import { useState, useEffect } from 'react';
import { StudyMode } from '../types';

type ViewMode = 'list' | 'aiSetup' | 'flashcardPlay' | 'storyPlay' | 'fillBlankPlay' | 'srsPlay' | 'dashboard' | 'vstepSetup' | 'vstepListening' | 'vstepReading' | 'vstepWriting' | 'vstepSpeaking' | 'vstepScore' | 'settings' | 'matchingPlay';

export const useRouter = (initialMode: ViewMode = 'list') => {
  const [viewMode, setViewModeInternal] = useState<ViewMode>(() => {
    // Thử lấy viewMode từ hash lúc tải trang
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      return hash as ViewMode;
    }
    return initialMode;
  });

  const setViewMode = (mode: ViewMode, replace: boolean = false) => {
    setViewModeInternal(mode);
    const hash = `#${mode}`;
    const state = { viewMode: mode };
    
    if (replace) {
      window.history.replaceState(state, '', hash);
    } else {
      // Chỉ pushState nếu trạng thái hiện tại khác với lịch sử
      if (window.location.hash !== hash) {
        window.history.pushState(state, '', hash);
      }
    }
  };

  useEffect(() => {
    // Khởi tạo trạng thái ban đầu của lịch sử
    const hash = window.location.hash.replace('#', '') || 'list';
    window.history.replaceState({ viewMode: hash }, '', window.location.hash || '#list');

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.viewMode) {
        setViewModeInternal(e.state.viewMode as ViewMode);
      } else {
        // Lấy lại từ hash nếu state trống
        const currentHash = window.location.hash.replace('#', '') as ViewMode;
        setViewModeInternal(currentHash || 'list');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { viewMode, setViewMode };
};
