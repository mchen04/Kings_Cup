import type { GameState } from '../types';
import { currentPlayer, deckRemaining, drawCard } from '../engine/game';
import KingsCupMeter from '../components/KingsCupMeter';
import StatusStrip from '../components/StatusStrip';
import TopBar from '../components/TopBar';

type Props = {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onOpenRules: () => void;
  onAskReset: () => void;
};

export default function DrawScreen({ state, setState, onOpenRules, onAskReset }: Props) {
  const me = currentPlayer(state);
  const remaining = deckRemaining(state);

  return (
    <main className="screen draw">
      <TopBar onOpenRules={onOpenRules} onAskReset={onAskReset} />

      <div className="draw-header">
        <p className="muted">It's your turn,</p>
        <h1 className="turn-name">{me?.name}</h1>
      </div>

      <div className="draw-stage">
        <button
          className="card-back-btn"
          onClick={() => setState((s) => drawCard(s))}
          aria-label="Draw a card"
          disabled={remaining === 0}
        >
          <span className="card-back">
            <span className="card-back-inner">
              <span className="card-back-mark" aria-hidden="true">♛</span>
              <span className="card-back-text">Tap to draw</span>
            </span>
          </span>
        </button>

        <KingsCupMeter fill={state.cupFill} kingsDrawn={state.kingsDrawn} />
      </div>

      <p className="deck-remaining" aria-live="polite">
        {remaining} {remaining === 1 ? 'card' : 'cards'} left
      </p>

      <StatusStrip state={state} />
    </main>
  );
}
