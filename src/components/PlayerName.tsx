import type { Player } from '../types';

type Props = {
  player: Player;
  className?: string;
};

export default function PlayerName({ player, className }: Props) {
  return (
    <span className={className} style={{ color: player.color }}>
      {player.name}
    </span>
  );
}
