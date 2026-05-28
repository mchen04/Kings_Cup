import type { GameState } from '../types';
import { currentPlayer, startTurn } from '../engine/game';
import TopBar from '../components/TopBar';

type Props = {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onOpenRules: () => void;
  onAskReset: () => void;
};

export default function PassScreen({ state, setState, onOpenRules, onAskReset }: Props) {
  const me = currentPlayer(state);
  if (!me) return null;

  return (
    <main className="screen pass">
      <TopBar onOpenRules={onOpenRules} onAskReset={onAskReset} />

      <div className="pass-hero" key={me.id}>
        <p className="pass-label">Pass to</p>
        <h1 className="pass-name" style={{ color: me.color }}>{me.name}</h1>
        <p className="pass-sub">Tap when you're holding the phone.</p>
      </div>

      <div className="primary-action">
        <button
          className="btn primary big"
          onClick={() => setState((s) => startTurn(s))}
          autoFocus
        >
          I'm {me.name}
        </button>
      </div>

    </main>
  );
}
