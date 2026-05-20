export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt((xp || 0) / 50)) + 1;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

export function getLevelProgress(xp: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercentage: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelBaseXP = getXPForLevel(currentLevel);
  const nextLevelBaseXP = getXPForLevel(currentLevel + 1);

  const xpInCurrentLevel = xp - currentLevelBaseXP;
  const xpRequiredForNextLevel = nextLevelBaseXP - currentLevelBaseXP;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100),
  );

  return {
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressPercentage,
  };
}
