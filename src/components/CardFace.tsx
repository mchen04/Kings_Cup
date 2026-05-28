import type { Card } from '../types';
import { suitColor, suitSymbol } from '../engine/deck';

type Props = {
  card: Card;
  flipped: boolean;
};

export default function CardFace({ card, flipped }: Props) {
  const sym = suitSymbol(card.suit);
  const color = suitColor(card.suit);
  return (
    <div className={`card-flip ${flipped ? 'is-flipped' : ''}`}>
      <div className="card-side card-side-back" aria-hidden="true">
        <span className="card-back-mark">♛</span>
      </div>
      <div className={`card-side card-side-front ${color}`} aria-label={`${card.rank} of ${card.suit}`}>
        <span className="card-corner top">
          <span className="card-rank">{card.rank}</span>
          <span className="card-suit">{sym}</span>
        </span>
        <span className="card-center" aria-hidden="true">{sym}</span>
        <span className="card-corner bottom">
          <span className="card-rank">{card.rank}</span>
          <span className="card-suit">{sym}</span>
        </span>
      </div>
    </div>
  );
}
