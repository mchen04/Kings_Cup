import type { GameState } from '../types';
import { currentPlayer } from '../engine/game';

type Props = {
  state: GameState;
  onReset: () => void;
  onOpenRules: () => void;
};

export default function GameOverScreen({ state, onReset, onOpenRules }: Props) {
  const winner = currentPlayer(state);
  return (
    <main className="screen gameover" role="alert">
      <div className="gameover-flash" aria-hidden="true" />
      <div className="gameover-content">
        <p className="gameover-eyebrow">Fourth King drawn</p>
        <h1 className="gameover-title">{winner?.name ?? 'The drawer'} drinks the cup</h1>
        <p className="gameover-sub">The game is over. Cheers, everyone.</p>

        <div className="gameover-stats">
          <div className="stat">
            <span className="stat-num">{state.drawn.length}</span>
            <span className="stat-label">cards drawn</span>
          </div>
          <div className="stat">
            <span className="stat-num">{state.rules.length}</span>
            <span className="stat-label">house rules</span>
          </div>
          <div className="stat">
            <span className="stat-num">{state.mates.length}</span>
            <span className="stat-label">mates made</span>
          </div>
        </div>

        <div className="gameover-actions">
          <button className="btn primary big" onClick={onReset}>
            Play again
          </button>
          <button className="btn link" onClick={onOpenRules}>
            Review the rules
          </button>
        </div>
      </div>
    </main>
  );
}
