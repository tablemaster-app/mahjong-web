'use client';

import { useEffect, useState } from 'react';
import Tile from './Tile';

type TilePhase = 'idle' | 'flip-out' | 'flip-in' | 'done';

interface Props {
  tiles: string[];
  results?: boolean[];
  slotCount: number;
  animate?: boolean;
  onTileClick?: (index: number) => void;
}

export default function AnswerRow({ tiles, results = [], slotCount, animate, onTileClick }: Props) {
  const [phases, setPhases] = useState<TilePhase[]>(() =>
    tiles.map(() => (animate ? 'idle' : 'done'))
  );

  useEffect(() => {
    if (!animate || !results.length) return;
    tiles.forEach((_, i) => {
      setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 'flip-out'; return n; }), i * 300);
      setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 'flip-in'; return n; }), i * 300 + 220);
      setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 'done'; return n; }), i * 300 + 440);
    });
  }, [animate, tiles.length]);

  return (
    <div className="flex gap-1 justify-center">
      {Array(slotCount).fill(null).map((_, i) => {
        const tile = tiles[i];
        const phase = phases[i] ?? 'idle';
        const hasResult = results.length > 0;

        if (!tile) {
          return (
            <div
              key={i}
              className="w-8 h-[44px] sm:w-10 sm:h-[56px] rounded-lg border-2 border-mj-border bg-mj-card opacity-30"
            />
          );
        }

        const flipClass = phase === 'flip-out' ? 'flip-out' : phase === 'flip-in' ? 'flip-in' : '';
        const showResult = hasResult && (phase === 'flip-in' || phase === 'done') ? results[i] : null;

        return (
          <Tile
            key={i}
            notation={tile}
            result={showResult}
            flipClass={flipClass}
            onClick={onTileClick ? () => onTileClick(i) : undefined}
          />
        );
      })}
    </div>
  );
}
