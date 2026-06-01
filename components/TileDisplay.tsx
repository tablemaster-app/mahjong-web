import Tile from './Tile';

export default function TileDisplay({ tiles }: { tiles: string[] }) {
  return (
    <div className="bg-mj-card rounded-2xl p-2 w-full">
      <div className="flex gap-0.5">
        {tiles.map((t, i) => (
          <Tile key={i} notation={t} wrapperClass="flex-1 aspect-[8/11]" />
        ))}
      </div>
    </div>
  );
}
