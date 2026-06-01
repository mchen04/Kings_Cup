import type { GameState } from '../types';
import { findPlayer } from '../engine/game';
import PlayerName from './PlayerName';

type Props = {
  state: GameState;
};

export default function StatusStrip({ state }: Props) {
  const qm = findPlayer(state, state.questionMaster);
  const hasMates = state.mates.length > 0;
  const hasRules = state.rules.length > 0;

  if (!qm && !hasMates && !hasRules) {
    return (
      <aside className="status-strip empty" aria-label="Active rules">
        <span className="muted small">No active rules yet.</span>
      </aside>
    );
  }

  return (
    <aside className="status-strip" aria-label="Active rules">
      {qm && (
        <div className="status-chip qm">
          <span className="chip-icon" aria-hidden="true">♛</span>
          <span className="chip-label">Question Master</span>
          <span className="chip-value"><PlayerName player={qm} /></span>
        </div>
      )}
      {hasMates && (
        <div className="status-chip mates">
          <span className="chip-icon" aria-hidden="true">⌇</span>
          <span className="chip-label">Mates</span>
          {state.mates.map((m) => {
            const a = findPlayer(state, m.a);
            const b = findPlayer(state, m.b);
            if (!a || !b) return null;
            return (
              <span key={`${m.a}-${m.b}`} className="chip-value">
                <PlayerName player={a} /> + <PlayerName player={b} />
              </span>
            );
          })}
        </div>
      )}
      {hasRules && (
        <div className="status-chip rules">
          <span className="chip-icon" aria-hidden="true">§</span>
          <span className="chip-label">Rules</span>
          <ul className="chip-list">
            {state.rules.map((r) => {
              const author = findPlayer(state, r.authorId);
              return (
                <li key={r.id}>
                  <span>{r.text}</span>
                  {author && (
                    <span className="muted small"> · <PlayerName player={author} /></span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
