import { useState } from 'react';
import type { GameState } from '../types';
import { addPlayer, MAX_PLAYERS, removePlayer, renamePlayer, startGame } from '../engine/game';

type Props = {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onOpenRules: () => void;
};

export default function SetupScreen({ state, setState, onOpenRules }: Props) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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
    setEditingId(id);
    setEditName(current);
  };

  const commitEdit = () => {
    if (!editingId) return;
    setState((s) => renamePlayer(s, editingId, editName));
    setEditingId(null);
    setEditName('');
  };

  return (
    <main className="screen setup">
      <header className="hero">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">♛</span>
          <span className="brand-word">King's Cup</span>
        </div>
        <p className="tagline">Pass the phone. Draw a card. Honor the card.</p>
      </header>

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
              {editingId === p.id ? (
                <input
                  className="text-input inline-edit"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit();
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditName('');
                    }
                  }}
                  autoFocus
                  maxLength={24}
                  aria-label={`Rename ${p.name}`}
                />
              ) : (
                <button
                  className="player-name"
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

      <div className="primary-action">
        <button
          className="btn primary big"
          disabled={!canStart}
          onClick={() => setState((s) => startGame(s.players))}
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
