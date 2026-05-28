import { useEffect, useState } from 'react';
import type { GameState } from '../types';
import { resolveRule } from '../engine/rules';
import {
  addCustomRule,
  currentPlayer,
  endTurn,
  findPlayer,
  setMate,
} from '../engine/game';
import CardFace from '../components/CardFace';
import TopBar from '../components/TopBar';

type Props = {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onOpenRules: () => void;
  onAskReset: () => void;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function RevealScreen({ state, setState, onOpenRules, onAskReset }: Props) {
  const me = currentPlayer(state);
  const card = state.current;
  const [flipped, setFlipped] = useState(prefersReducedMotion());
  const [targetId, setTargetId] = useState<string | null>(null);
  const [mateId, setMateId] = useState<string | null>(null);
  const [ruleText, setRuleText] = useState('');

  useEffect(() => {
    setTargetId(null);
    setMateId(null);
    setRuleText('');
    if (prefersReducedMotion()) {
      setFlipped(true);
      return;
    }
    setFlipped(false);
    const id = window.setTimeout(() => setFlipped(true), 60);
    return () => window.clearTimeout(id);
  }, [card?.id]);

  if (!card || !me) return null;
  const rule = CARD_RULES[card.rank];
  const others = state.players.filter((p) => p.id !== me.id);
  const isFourthKing = card.rank === 'K' && state.kingsDrawn >= 4;
  const dethroned =
    card.rank === 'Q' &&
    state.prevQuestionMaster &&
    state.prevQuestionMaster !== state.questionMaster;
  const dethronedPlayer = dethroned ? findPlayer(state, state.prevQuestionMaster) : null;

  const handleContinue = () => {
    let next = state;
    if (rule.needsMate && mateId) next = setMate(next, mateId);
    if (rule.needsRule && ruleText.trim()) next = addCustomRule(next, ruleText);
    setState(() => endTurn(next));
  };

  const continueEnabled =
    (!rule.needsTarget || !!targetId) &&
    (!rule.needsMate || !!mateId) &&
    (!rule.needsRule || ruleText.trim().length > 0);

  const continueLabel = isFourthKing
    ? 'End the game'
    : rule.needsTarget && !targetId
    ? 'Pick a player to continue'
    : rule.needsMate && !mateId
    ? 'Pick a buddy to continue'
    : rule.needsRule && !ruleText.trim()
    ? 'Write a rule to continue'
    : 'Done — next player';

  return (
    <main className="screen reveal">
      <TopBar onOpenRules={onOpenRules} onAskReset={onAskReset} />

      <div className="reveal-stage">
        <CardFace card={card} flipped={flipped} />
        <div className="reveal-info">
          <p className="reveal-rank">
            {rule.rank} · {rule.title}
          </p>
          <h2 className="reveal-short">
            {isFourthKing ? "King's Cup — drink it down" : rule.short}
          </h2>
          <p className="reveal-desc">
            {isFourthKing
              ? <><span style={{ color: me.color }}>{me.name}</span> drinks whatever is in the King's Cup. The game ends here.</>
              : rule.description}
          </p>
          {dethroned && dethronedPlayer && (
            <p className="reveal-aside">
              <span style={{ color: dethronedPlayer.color }}>{dethronedPlayer.name}</span> is no longer Question Master.
            </p>
          )}
        </div>
      </div>

      {!isFourthKing && rule.needsTarget && (
        <fieldset className="picker">
          <legend>Pick a player</legend>
          <div className="chip-row">
            {others.map((p) => (
              <button
                key={p.id}
                className={`chip ${targetId === p.id ? 'on' : ''}`}
                onClick={() => setTargetId(p.id)}
                style={targetId === p.id ? undefined : { borderColor: p.color, color: p.color }}
                type="button"
              >
                {p.name}
              </button>
            ))}
          </div>
          {targetId && (() => { const t = findPlayer(state, targetId); return t ? (
            <p className="picker-note">
              <span style={{ color: t.color }}>{t.name}</span> takes a sip.
            </p>
          ) : null; })()}
        </fieldset>
      )}

      {!isFourthKing && rule.needsMate && (
        <fieldset className="picker">
          <legend>Pick a drinking buddy</legend>
          <div className="chip-row">
            {others.map((p) => (
              <button
                key={p.id}
                className={`chip ${mateId === p.id ? 'on' : ''}`}
                onClick={() => setMateId(p.id)}
                style={mateId === p.id ? undefined : { borderColor: p.color, color: p.color }}
                type="button"
              >
                {p.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!isFourthKing && rule.needsRule && (
        <fieldset className="picker">
          <legend>Write a rule (lasts until game ends)</legend>
          <input
            className="text-input"
            placeholder="e.g. No first names"
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            maxLength={140}
            aria-label="Custom rule"
          />
        </fieldset>
      )}

      <div className="primary-action">
        <button
          className="btn primary big"
          onClick={handleContinue}
          disabled={!continueEnabled}
        >
          {continueLabel}
        </button>
      </div>

    </main>
  );
}
