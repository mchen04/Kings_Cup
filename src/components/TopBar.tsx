import type { Player } from '../types';

type Props = {
  onOpenRules: () => void;
  onAskReset: () => void;
  player?: Player | null;
};

export default function TopBar({ onOpenRules, onAskReset, player }: Props) {
  return (
    <div className="topbar">
      {player ? (
        <div className="topbar-player">
          <span className="topbar-player-label">Now playing</span>
          <span className="topbar-player-name" style={{ color: player.color }}>
            {player.name}
          </span>
        </div>
      ) : (
        <div className="brand-mini" aria-label="King's Cup">
          <span aria-hidden="true">♛</span>
          <span>King's Cup</span>
        </div>
      )}
      <div className="topbar-actions">
        <button className="icon-btn light" onClick={onOpenRules} aria-label="Open rules" title="Rules">
          ?
        </button>
        <button className="icon-btn light" onClick={onAskReset} aria-label="Start a new game" title="New game">
          ↻
        </button>
      </div>
    </div>
  );
}
