import { useEffect, useRef } from 'react';
import type { GameState } from '../types';
import { resolveRule } from '../engine/rules';
import { findPlayer } from '../engine/game';

type Props = {
  state: GameState;
  onClose: () => void;
};

const RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export default function RulesSheet({ state, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="rules-title">
      <div className="modal-card sheet">
        <div className="sheet-head">
          <h2 id="rules-title">How to play</h2>
          <button ref={closeRef} className="icon-btn light" onClick={onClose} aria-label="Close" title="Close">×</button>
        </div>

        <section className="sheet-section">
          <h3>Flow</h3>
          <ol className="flow">
            <li>Pass the phone to the next player.</li>
            <li>Tap the deck to draw.</li>
            <li>Read the card and honor it.</li>
            <li>Tap Done — next player.</li>
          </ol>
        </section>

        <section className="sheet-section">
          <h3>Cards</h3>
          <ul className="rules-list">
            {RANK_ORDER.map((rank) => {
              const r = resolveRule(state, rank);
              return (
                <li key={rank} className="rules-row">
                  <span className="rules-rank">{r.rank}</span>
                  <div>
                    <p className="rules-title">{r.title}</p>
                    <p className="rules-desc">{r.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {state.rules.length > 0 && (
          <section className="sheet-section">
            <h3>House rules in play</h3>
            <ul className="house-rules">
              {state.rules.map((r) => {
                const author = findPlayer(state, r.authorId);
                return (
                  <li key={r.id}>
                    <span>{r.text}</span>
                    {author && <span className="muted small"> · {author.name}</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="sheet-section sip-safely">
          <h3>Sip safely</h3>
          <p className="muted small">
            Drinks are optional — sub in water, soda, or skip a sip. Look out for each other.
          </p>
        </section>

        <div className="sheet-foot">
          <button className="btn primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
