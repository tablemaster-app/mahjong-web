const STORAGE_KEY = 'mj_streak';

interface StreakData {
  lastSolvedDate: string;
  streak: number;
  bestStreak: number;
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lastSolvedDate: '', streak: 0, bestStreak: 0 };
}

export function updateStreak(puzzleDate: string): StreakData {
  const data = loadStreak();
  if (data.lastSolvedDate === puzzleDate) return data;

  const prev = new Date(puzzleDate);
  prev.setDate(prev.getDate() - 1);
  const yesterday = prev.toISOString().split('T')[0];

  const newStreak = data.lastSolvedDate === yesterday ? data.streak + 1 : 1;
  const updated: StreakData = {
    lastSolvedDate: puzzleDate,
    streak: newStreak,
    bestStreak: Math.max(newStreak, data.bestStreak),
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}
