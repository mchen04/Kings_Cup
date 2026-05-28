import { useState } from 'react';
import type { GameState, Rank } from '../types';
import {
  addPlayer, addStartingRule, clearCardOverride,
  MAX_PLAYERS, PLAYER_COLORS, removePlayer, removeStartingRule,
  renamePlayer, setCardOverride, setMatesCount, setPlayerColor, startGame,
} from '../engine/game';
import { CARD_RULES } from '../engine/rules';

const ALL_RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

type Props = {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onOpenRules: () => void;
};

export default function SetupScreen({ state, setState, onOpenRules }: Props) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);
  const [expandedRank, setExpandedRank] = useState<Rank | null>(null);
  const [cardRulesOpen, setCardRulesOpen] = useState(false);
  const [houseRuleText, setHouseRuleText] = useState('');

  const canStart = state.players.length >= 2;
  const atMax = state.players.length >= MAX_PLAYERS;

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    setState((s) => addPlayer(s, v));
    setName('');
  };

  const beginEdit = (id: string, current: string) => {
    setColorPickerId(null);
    setEditingId(id);
    setEditName(current);
  };

  const commitEdit = () => {
    if (!editingId) return;
    setState((s) => renamePlayer(s, editingId, editName));
    setEditingId(null);
    setEditName('');
  };

  const submitHouseRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseRuleText.trim()) return;
    setState((s) => addStartingRule(s, houseRuleText));
    setHouseRuleText('');
  };

  return (
    <main className="screen setup" onClick={() => setColorPickerId(null)}>
      <header className="hero">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">♛</span>
          <span className="brand-word">King's Cup</span>
        </div>
        <p className="tagline">Pass the phone. Draw a card. Honor the card.</p>
      </header>

      {/* Players */}
      <section className="card-panel" aria-labelledby="players-title">
        <div className="panel-head">
          <h2 id="players-title">Players</h2>
          <span className="count-pill" aria-live="polite">
            {state.players.length} {state.players.length === 1 ? 'player' : 'players'}
          </span>
        </div>

        <form className="add-row" onSubmit={submitAdd}>
          <input
            className="text-input"
            placeholder={atMax ? `Up to ${MAX_PLAYERS} players` : 'Add a name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            aria-label="New player name"
            autoComplete="off"
            autoCapitalize="words"
            disabled={atMax}
          />
          <button className="btn primary" type="submit" disabled={!name.trim() || atMax}>
            Add
          </button>
        </form>

        <ul className="player-list" role="list">
          {state.players.length === 0 && (
            <li className="empty-row">Add at least 2 players to start.</li>
          )}
          {state.players.map((p, i) => (
            <li key={p.id} className="player-row">
              <span className="player-seat" aria-hidden="true">{i + 1}</span>

              <div className="color-picker-wrap" onClick={(e) => e.stopPropagation()}>
                <button
                  className="color-dot-btn"
                  style={{ background: p.color }}
                  aria-label={`Change color for ${p.name}`}
                  onClick={() => setColorPickerId(colorPickerId === p.id ? null : p.id)}
                  type="button"
                />
                {colorPickerId === p.id && (
                  <div className="color-swatch-grid">
                    {PLAYER_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch ${p.color === c ? 'active' : ''}`}
                        style={{ background: c }}
                        aria-label={c}
                        type="button"
                        onClick={() => {
                          setState((s) => setPlayerColor(s, p.id, c));
                          setColorPickerId(null);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {editingId === p.id ? (
                <input
                  className="text-input inline-edit"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit();
                    if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                  }}
                  autoFocus
                  maxLength={24}
                  aria-label={`Rename ${p.name}`}
                />
              ) : (
                <button
                  className="player-name"
                  style={{ color: p.color }}
                  onClick={() => beginEdit(p.id, p.name)}
                  aria-label={`Rename ${p.name}`}
                >
                  {p.name}
                </button>
              )}
              <button
                className="icon-btn"
                onClick={() => setState((s) => removePlayer(s, p.id))}
                aria-label={`Remove ${p.name}`}
                title="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Card Rules */}
      <section className="card-panel" aria-labelledby="card-rules-title">
        <button
          className="panel-head panel-head-toggle"
          type="button"
          onClick={() => setCardRulesOpen((o) => !o)}
          aria-expanded={cardRulesOpen}
        >
          <h2 id="card-rules-title">Card Rules</h2>
          <div className="panel-head-right">
            {Object.keys(state.cardOverrides).length > 0 && (
              <span className="count-pill">{Object.keys(state.cardOverrides).length} modified</span>
            )}
            <span className="panel-chevron">{cardRulesOpen ? '▲' : '▼'}</span>
          </div>
        </button>
        {cardRulesOpen && <ul className="rank-list">
          {ALL_RANKS.map((rank) => {
            const base = CARD_RULES[rank];
            const ov = state.cardOverrides[rank];
            const title = ov?.title || base.title;
            const short = ov?.short || base.short;
            const description = ov?.description || base.description;
            const isOpen = expandedRank === rank;
            const isModified = !!ov;

            return (
              <li key={rank} className={`rank-row ${isModified ? 'modified' : ''}`}>
                <button
                  className="rank-row-head"
                  type="button"
                  onClick={() => setExpandedRank(isOpen ? null : rank)}
                >
                  <span className="rank-badge">{rank}</span>
                  <span className="rank-info">
                    <span className="rank-title">{title}</span>
                    <span className="rank-short">{short}</span>
                  </span>
                  <span className="rank-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="rank-editor">
                    {rank === '8' && (
                      <div className="rank-field">
                        <span className="rank-field-label">Number of mates</span>
                        <div className="mates-count-row">
                          {[1, 2, 3, 4].map((n) => (
                            <button
                              key={n}
                              type="button"
                              className={`mates-count-btn ${state.matesCount === n ? 'active' : ''}`}
                              onClick={() => setState((s) => setMatesCount(s, n))}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <label className="rank-field">
                      <span className="rank-field-label">Name</span>
                      <input
                        className="text-input"
                        value={title}
                        onChange={(e) =>
                          setState((s) => setCardOverride(s, rank, { title: e.target.value, short, description }))
                        }
                        maxLength={32}
                        placeholder={base.title}
                      />
                    </label>
                    <label className="rank-field">
                      <span className="rank-field-label">Subtitle</span>
                      <input
                        className="text-input"
                        value={short}
                        onChange={(e) =>
                          setState((s) => setCardOverride(s, rank, { title, short: e.target.value, description }))
                        }
                        maxLength={48}
                        placeholder={base.short}
                      />
                    </label>
                    <label className="rank-field">
                      <span className="rank-field-label">Description</span>
                      <textarea
                        className="text-input text-area"
                        value={description}
                        onChange={(e) =>
                          setState((s) => setCardOverride(s, rank, { title, short, description: e.target.value }))
                        }
                        maxLength={200}
                        placeholder={base.description}
                        rows={3}
                      />
                    </label>
                    {isModified && (
                      <button
                        className="btn link small-btn"
                        type="button"
                        onClick={() => setState((s) => clearCardOverride(s, rank))}
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>}
      </section>

      {/* Starting House Rules */}
      <section className="card-panel" aria-labelledby="house-rules-title">
        <div className="panel-head">
          <h2 id="house-rules-title">House Rules</h2>
          {state.startingRules.length > 0 && (
            <span className="count-pill">{state.startingRules.length}</span>
          )}
        </div>
        <p className="panel-hint">Rules added here are active from the very first turn.</p>

        <form className="add-row" onSubmit={submitHouseRule}>
          <input
            className="text-input"
            placeholder="e.g. No swearing"
            value={houseRuleText}
            onChange={(e) => setHouseRuleText(e.target.value)}
            maxLength={140}
            aria-label="New house rule"
          />
          <button className="btn primary" type="submit" disabled={!houseRuleText.trim()}>
            Add
          </button>
        </form>

        {state.startingRules.length > 0 && (
          <ul className="house-rule-list">
            {state.startingRules.map((text, i) => (
              <li key={i} className="house-rule-row">
                <span className="house-rule-text">{text}</span>
                <button
                  className="icon-btn"
                  type="button"
                  onClick={() => setState((s) => removeStartingRule(s, i))}
                  aria-label="Remove rule"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="primary-action">
        <button
          className="btn primary big"
          disabled={!canStart}
          onClick={() => setState((s) => startGame(s))}
        >
          {canStart ? 'Start game' : 'Add 2+ players to start'}
        </button>
        <button className="btn link" onClick={onOpenRules}>
          How to play
        </button>
      </div>

      <p className="footer-note">Sip responsibly. Skip a sip whenever you want.</p>
    </main>
  );
}
