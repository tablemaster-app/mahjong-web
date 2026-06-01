import Tile from './Tile';

interface Props {
  tiles: string[];
  selected: string[];
  onTileClick: (tile: string) => void;
}

export default function TilePicker({ tiles, selected, onTileClick }: Props) {
  return (
    <div className="flex gap-1.5 justify-center flex-wrap mt-2">
      {tiles.map(tile => (
        <Tile
          key={tile}
          notation={tile}
          selected={selected.includes(tile)}
          onClick={() => onTileClick(tile)}
        />
      ))}
    </div>
  );
}
