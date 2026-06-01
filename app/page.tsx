import { createClient } from '@supabase/supabase-js';
import { getHKTDateString } from '@/lib/tiles';
import Game from '@/components/Game';

async function getPuzzle() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const date = getHKTDateString();
  const { data } = await supabase
    .from('daily_puzzles')
    .select('puzzle_date, hand_tiles, winning_tiles')
    .eq('puzzle_date', date)
    .eq('difficulty', '阿嬤')
    .single();
  return data as { puzzle_date: string; hand_tiles: string[]; winning_tiles: string[] } | null;
}

export const dynamic = 'force-dynamic';

export default async function Page() {
  const puzzle = await getPuzzle();

  if (!puzzle) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-mj-muted text-xl">今日謎題暫未就緒</p>
      </main>
    );
  }

  return <Game puzzle={puzzle} />;
}
