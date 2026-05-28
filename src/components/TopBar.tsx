type Props = {
  onOpenRules: () => void;
  onAskReset: () => void;
};

export default function TopBar({ onOpenRules, onAskReset }: Props) {
  return (
    <div className="topbar">
      <div className="brand-mini" aria-label="King's Cup">
        <span aria-hidden="true">♛</span>
        <span>King's Cup</span>
      </div>
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
