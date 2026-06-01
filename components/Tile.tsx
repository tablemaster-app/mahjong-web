const SUIT_NAME: Record<string, string> = { m: 'Man', p: 'Pin', s: 'Sou' };

function tileUrl(notation: string): string {
  const num  = notation[0];
  const suit = notation.slice(-1);
  return `https://cdn.jsdelivr.net/gh/FluffyStuff/riichi-mahjong-tiles@master/Regular/${SUIT_NAME[suit]}${num}.svg`;
}

interface Props {
  notation: string;
  selected?: boolean;
  result?: boolean | null;
  onClick?: () => void;
  flipClass?: string;
  wrapperClass?: string;
}

export default function Tile({ notation, selected, result, onClick, flipClass, wrapperClass }: Props) {
  const revealed = result !== null && result !== undefined;

  return (
    <div className={`perspective-tile ${wrapperClass ?? 'w-8 h-[44px] sm:w-10 sm:h-[56px]'}`}>
      <div
        onClick={onClick}
        className={`
          relative mahjong-tile
          w-full h-full
          transition-transform duration-150 select-none
          ${selected ? 'ring-4 ring-green-400 scale-95' : ''}
          ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
          ${flipClass ?? ''}
        `}
      >
        <img
          src={tileUrl(notation)}
          alt={notation}
          draggable={false}
          className="w-full h-full object-contain p-1"
        />

        {revealed && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{ backgroundColor: result ? 'rgba(22,163,74,0.65)' : 'rgba(220,38,38,0.65)' }}
          />
        )}
      </div>
    </div>
  );
}
