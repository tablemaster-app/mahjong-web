export const VS15 = '︎';

export const TILE_MAP: Record<string, string> = {
  '1m': '\u{1F007}', '2m': '\u{1F008}', '3m': '\u{1F009}',
  '4m': '\u{1F00A}', '5m': '\u{1F00B}', '6m': '\u{1F00C}',
  '7m': '\u{1F00D}', '8m': '\u{1F00E}', '9m': '\u{1F00F}',
  '1s': '\u{1F010}', '2s': '\u{1F011}', '3s': '\u{1F012}',
  '4s': '\u{1F013}', '5s': '\u{1F014}', '6s': '\u{1F015}',
  '7s': '\u{1F016}', '8s': '\u{1F017}', '9s': '\u{1F018}',
  '1p': '\u{1F019}', '2p': '\u{1F01A}', '3p': '\u{1F01B}',
  '4p': '\u{1F01C}', '5p': '\u{1F01D}', '6p': '\u{1F01E}',
  '7p': '\u{1F01F}', '8p': '\u{1F020}', '9p': '\u{1F021}',
};

export function tileChar(notation: string): string {
  return (TILE_MAP[notation] ?? '?') + VS15;
}

export function detectSuit(tiles: string[]): string {
  return tiles[0].slice(-1);
}

export function suitTiles(suit: string): string[] {
  return ['1','2','3','4','5','6','7','8','9'].map(n => `${n}${suit}`);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

export function getHKTDateString(): string {
  const hkt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return hkt.toISOString().split('T')[0];
}
