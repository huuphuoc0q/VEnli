export interface XPResult {
  xp: number;
  level: number;
  xpNeeded: number;
  didLevelUp: boolean;
}

export const getXPForNextLevel = (level: number): number => {
  // Mỗi cấp độ yêu cầu cấp đó nhân với 150 XP
  // Level 1: 150 XP, Level 2: 300 XP, Level 3: 450 XP, ...
  return level * 150;
};

export const getUserStats = (userId?: string): { xp: number; level: number } => {
  if (typeof window === 'undefined') return { xp: 0, level: 1 };
  
  const keyXP = userId ? `vocab-flow-xp-${userId}` : 'vocab-flow-xp-anonymous';
  const keyLevel = userId ? `vocab-flow-level-${userId}` : 'vocab-flow-level-anonymous';
  
  const savedXP = localStorage.getItem(keyXP);
  const savedLevel = localStorage.getItem(keyLevel);
  
  const parsedXP = savedXP ? parseInt(savedXP, 10) : 0;
  const parsedLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
  
  return {
    xp: isNaN(parsedXP) ? 0 : parsedXP,
    level: isNaN(parsedLevel) ? 1 : parsedLevel
  };
};

export const addXP = (amount: number, userId?: string): XPResult => {
  const { xp: currentXP, level: currentLevel } = getUserStats(userId);
  
  const xpAmount = isNaN(amount) ? 0 : amount;
  let newXP = (isNaN(currentXP) ? 0 : currentXP) + xpAmount;
  let newLevel = isNaN(currentLevel) ? 1 : currentLevel;
  let didLevelUp = false;

  let xpNeeded = getXPForNextLevel(newLevel);
  if (isNaN(xpNeeded) || xpNeeded <= 0) {
    xpNeeded = 150;
  }

  while (newXP >= xpNeeded) {
    newXP -= xpNeeded;
    newLevel += 1;
    xpNeeded = getXPForNextLevel(newLevel);
    if (isNaN(xpNeeded) || xpNeeded <= 0) {
      xpNeeded = 150;
    }
    didLevelUp = true;
  }

  const keyXP = userId ? `vocab-flow-xp-${userId}` : 'vocab-flow-xp-anonymous';
  const keyLevel = userId ? `vocab-flow-level-${userId}` : 'vocab-flow-level-anonymous';

  localStorage.setItem(keyXP, newXP.toString());
  localStorage.setItem(keyLevel, newLevel.toString());

  return {
    xp: newXP,
    level: newLevel,
    xpNeeded,
    didLevelUp
  };
};

export const awardXPForAction = (
  action: 'add_word' | 'speak' | 'srs_card' | 'ai_practice' | 'vstep_section',
  userId?: string
): XPResult => {
  let xpReward = 0;
  switch (action) {
    case 'add_word':
      xpReward = 10;
      break;
    case 'speak':
      xpReward = 2;
      break;
    case 'srs_card':
      xpReward = 5;
      break;
    case 'ai_practice':
      xpReward = 30;
      break;
    case 'vstep_section':
      xpReward = 100;
      break;
  }
  return addXP(xpReward, userId);
};
