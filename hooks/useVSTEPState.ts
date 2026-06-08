import { useState } from 'react';
import { VSTEPExam, VSTEPScore } from '../types';

export const useVSTEPState = () => {
  const [vstepExam, setVstepExam] = useState<VSTEPExam | null>(null);
  const [vstepListeningAnswers, setVstepListeningAnswers] = useState<Record<number, number>>({});
  const [vstepReadingAnswers, setVstepReadingAnswers] = useState<Record<number, number>>({});
  const [vstepWritingSubmissions, setVstepWritingSubmissions] = useState<any[]>([]);
  const [vstepWritingFeedbacks, setVstepWritingFeedbacks] = useState<any[]>([]);
  const [vstepSpeakingSubmissions, setVstepSpeakingSubmissions] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<VSTEPScore | null>(null);

  const resetVstepExamState = () => {
    setVstepExam(null);
    setVstepListeningAnswers({});
    setVstepReadingAnswers({});
    setVstepWritingSubmissions([]);
    setVstepWritingFeedbacks([]);
    setVstepSpeakingSubmissions([]);
    setFinalScore(null);
  };

  return {
    vstepExam,
    setVstepExam,
    vstepListeningAnswers,
    setVstepListeningAnswers,
    vstepReadingAnswers,
    setVstepReadingAnswers,
    vstepWritingSubmissions,
    setVstepWritingSubmissions,
    vstepWritingFeedbacks,
    setVstepWritingFeedbacks,
    vstepSpeakingSubmissions,
    setVstepSpeakingSubmissions,
    finalScore,
    setFinalScore,
    resetVstepExamState,
  };
};
