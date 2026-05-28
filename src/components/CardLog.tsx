import type { GameState } from '../types';
import type { Rank, Card } from '../types';
import { resolveRule } from '../engine/rules';
import { suitSymbol, suitColor } from '../engine/deck';


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


export default function CardLog({ state }: Props) {
  const byRank: Partial<Record<Rank, Card[]>> = {};
  const rankOrder: Rank[] = [];
  for (const card of state.drawn) {
    if (!byRank[card.rank]) {
      byRank[card.rank] = [];
      rankOrder.push(card.rank);
    }
    byRank[card.rank]!.push(card);
  }

  if (rankOrder.length === 0) {
    return (
      <aside className="card-log" aria-label="Cards drawn">
        <p className="card-log-heading">Drawn</p>
        <p className="muted small" style={{ textAlign: 'center', fontSize: 12 }}>No cards yet.</p>
      </aside>
    );
  }

  return (
    <aside className="card-log" aria-label="Cards drawn">
      <p className="card-log-heading">Drawn</p>
      <ul className="card-log-list">
        {rankOrder.map((rank) => {
          const cards = byRank[rank]!;
          const rule = resolveRule(state, rank);
          const stackWidth = 38 + Math.max(0, cards.length - 1) * 8;
          return (
            <li key={rank} className="card-log-group">
              <div className="card-stack" style={{ width: stackWidth }}>
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
