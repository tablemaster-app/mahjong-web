'use client';

import { formatDate, formatTime, tileChar } from '@/lib/tiles';

interface GuessRecord { tiles: string[]; results: boolean[]; }

interface Props {
  puzzleDate: string;
  guesses: GuessRecord[];
  elapsed: number;
  won: boolean;
  streak: number;
}

export default function ShareButton({ puzzleDate, guesses, elapsed, won, streak }: Props) {
  function buildText() {
    const date = formatDate(puzzleDate);
    const time = formatTime(elapsed);
    const tryLabel = won ? `第${guesses.length}試 ✅` : '未猜中 ❌';
    const streakLabel = won && streak > 0 ? ` | 🔥 ${streak} 連勝` : '';
    const rows = guesses
      .map(g => g.results.map(r => r ? '🟩' : '🟥').join(''))
      .join('\n');
    const url = typeof window !== 'undefined' ? window.location.hostname : '每日一聽';
    return `每日一聽 ${date}\n⏱ ${time} | ${tryLabel}${streakLabel}\n\n${rows}\n\n${url}`;
  }

  async function handleShare() {
    const text = buildText();
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('已複製到剪貼板！');
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-8 py-3 bg-green-700 hover:bg-green-600 text-white rounded-full
                 font-bold transition-colors"
    >
      分享結果
    </button>
  );
}
