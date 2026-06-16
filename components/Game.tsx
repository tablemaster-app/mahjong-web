'use client';

import { useState, useEffect, useRef } from 'react';
import { detectSuit, suitTiles, formatTime, formatDate } from '@/lib/tiles';
import { loadStreak, updateStreak } from '@/lib/streak';
import TileDisplay from './TileDisplay';
import TilePicker from './TilePicker';
import AnswerRow from './AnswerRow';
import ShareButton from './ShareButton';

interface Puzzle {
  puzzle_date: string;
  hand_tiles: string[];
  winning_tiles: string[];
}

interface GuessRecord {
  tiles: string[];
  results: boolean[];
}

const MAX_TRIES = 3;

export default function Game({ puzzle }: { puzzle: Puzzle }) {
  const { hand_tiles, winning_tiles, puzzle_date } = puzzle;
  const sortedHand = [...hand_tiles].sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  const suit = detectSuit(hand_tiles);
  const picker = suitTiles(suit);
  const slotCount = winning_tiles.length;

  const [selection, setSelection] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = loadStreak();
    setStreak(s.streak);
    setBestStreak(s.bestStreak);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase !== 'playing' && timerRef.current) clearInterval(timerRef.current);
  }, [phase]);

  function handleTileClick(tile: string) {
    if (phase !== 'playing') return;
    setSelection(prev =>
      prev.includes(tile)
        ? prev.filter(t => t !== tile)
        : showHint && prev.length >= slotCount ? prev : [...prev, tile]
    );
  }

  function handleSubmit() {
    if (selection.length === 0 || phase !== 'playing') return;
    const winSet = new Set(winning_tiles);
    const results = selection.map(t => winSet.has(t));
    const record: GuessRecord = { tiles: selection, results };
    const next = [...guesses, record];

    setAnimatingIndex(next.length - 1);
    setGuesses(next);
    setSelection([]);

    const animDuration = (slotCount - 1) * 300 + 600;
    setTimeout(() => {
      setAnimatingIndex(null);
      if (selection.length === slotCount && results.every(r => r)) {
        const updated = updateStreak(puzzle_date);
        setStreak(updated.streak);
        setBestStreak(updated.bestStreak);
        setPhase('won');
      } else if (next.length >= MAX_TRIES) setPhase('lost');
    }, animDuration);
  }

  const emptyRows = MAX_TRIES - guesses.length - (phase === 'playing' ? 1 : 0);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 max-w-lg mx-auto gap-5">

      <div className="text-center">
        <h1 className="text-4xl font-bold text-mj-text tracking-wide">每日一聽</h1>
        <p className="text-mj-muted text-sm mt-1">{formatDate(puzzle_date)}</p>
        <p className="text-mj-muted text-lg font-mono mt-1">⏱ {formatTime(elapsed)}</p>
        {streak > 0 && <p className="text-orange-400 text-sm mt-0.5">🔥 {streak} 連勝</p>}
      </div>

      <TileDisplay tiles={sortedHand} />

      <div className="w-full space-y-2">
        {guesses.map((g, i) => (
          <AnswerRow
            key={i}
            tiles={g.tiles}
            results={g.results}
            slotCount={slotCount}
            animate={i === animatingIndex}
          />
        ))}

        {phase === 'playing' && (
          <AnswerRow
            tiles={selection}
            slotCount={slotCount}
            hint={showHint}
            onTileClick={(i) => handleTileClick(selection[i])}
          />
        )}

      </div>

      {phase === 'playing' && (
        <>
          <TilePicker tiles={picker} selected={selection} onTileClick={handleTileClick} />
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSubmit}
              disabled={selection.length === 0 || animatingIndex !== null}
              className="px-10 py-3 bg-mj-border text-mj-text rounded-full font-bold
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-green-700 transition-colors text-lg"
            >
              確認
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-3 text-mj-muted text-sm hover:text-mj-text transition-colors"
              >
                提示
              </button>
            )}
          </div>
        </>
      )}

      {phase !== 'playing' && (
        <div className="text-center space-y-3">
          {phase === 'won' ? (
            <p className="text-green-400 text-2xl font-bold">🎉 正確！</p>
          ) : (
            <div>
              <p className="text-red-400 text-xl font-bold mb-1">答案：</p>
              <AnswerRow
                tiles={winning_tiles}
                results={winning_tiles.map(() => true)}
                slotCount={slotCount}
              />
            </div>
          )}
          <ShareButton
            puzzleDate={puzzle_date}
            guesses={guesses}
            elapsed={elapsed}
            won={phase === 'won'}
            streak={streak}
          />
        </div>
      )}

      <footer className="text-mj-muted text-xs text-center mt-auto pt-2">
        © {puzzle_date.slice(0, 4)} 每日一聽. All rights reserved.
      </footer>

    </main>
  );
}
