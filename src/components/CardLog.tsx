import type { GameState } from '../types';
import type { Rank, Card } from '../types';
import { CARD_RULES } from '../engine/rules';
import { suitSymbol, suitColor } from '../engine/deck';

const RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

type Props = {
  state: GameState;
};

function MiniCard({ card, offset }: { card: Card; offset: number }) {
  const sym = suitSymbol(card.suit);
  const color = suitColor(card.suit);
  return (
    <div
      className={`mini-card ${color}`}
      style={{ left: offset * 8 }}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <span className="mini-card-rank">{card.rank}</span>
      <span className="mini-card-suit">{sym}</span>
    </div>
  );
}

function GhostCard({ rank }: { rank: Rank }) {
  return (
    <div className="mini-card ghost" style={{ left: 0 }} aria-hidden="true">
      <span className="mini-card-rank">{rank}</span>
    </div>
  );
}

export default function CardLog({ state }: Props) {
  const byRank: Partial<Record<Rank, Card[]>> = {};
  for (const card of state.drawn) {
    (byRank[card.rank] ??= []).push(card);
  }

  return (
    <aside className="card-log" aria-label="Cards drawn">
      <p className="card-log-heading">Drawn</p>
      <ul className="card-log-list">
        {RANKS.map((rank) => {
          const cards = byRank[rank] ?? [];
          const rule = CARD_RULES[rank];
          const stackWidth = 38 + Math.max(0, cards.length - 1) * 8;
          return (
            <li key={rank} className="card-log-group">
              <div className="card-stack" style={{ width: stackWidth }}>
                <GhostCard rank={rank} />
                {cards.map((card, i) => (
                  <MiniCard key={card.id} card={card} offset={i} />
                ))}
              </div>
              <span className="card-log-rule">{rule.title}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
