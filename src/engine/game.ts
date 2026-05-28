import { buildDeck, shuffle } from './deck';
import type { CardOverride, CustomRule, GameState, Mate, Phase, Player, Rank } from '../types';
import { STATE_VERSION } from '../types';

function rid(prefix: string): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c && typeof c.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyState(): GameState {
  return {
    players: [],
    turnIndex: 0,
    deck: [],
    drawn: [],
    current: null,
    kingsDrawn: 0,
    cupFill: 0,
    mates: [],
    rules: [],
    questionMaster: null,
    prevQuestionMaster: null,
    phase: 'setup',
    version: STATE_VERSION,
    cardOverrides: {},
    startingRules: [],
  };
}

export function startGame(s: GameState): GameState {
  const seedRules: CustomRule[] = s.startingRules.map((text) => ({
    id: rid('rule'),
    text,
    authorId: 'house',
  }));
  return {
    ...s,
    turnIndex: 0,
    deck: shuffle(buildDeck()),
    drawn: [],
    current: null,
    kingsDrawn: 0,
    cupFill: 0,
    mates: [],
    rules: seedRules,
    questionMaster: null,
    prevQuestionMaster: null,
    phase: 'pass',
    version: STATE_VERSION,
  };
}

export function currentPlayer(s: GameState): Player | null {
  if (s.players.length === 0) return null;
  const idx = ((s.turnIndex % s.players.length) + s.players.length) % s.players.length;
  return s.players[idx] ?? null;
}

export function drawCard(s: GameState): GameState {
  if (s.deck.length === 0 || s.phase !== 'draw') return s;
  const [card, ...rest] = s.deck;
  const drawn = [...s.drawn, card];
  let kingsDrawn = s.kingsDrawn;
  let cupFill = s.cupFill;
  let questionMaster = s.questionMaster;
  let prevQuestionMaster = s.prevQuestionMaster;
  const phase: Phase = 'reveal';

  if (card.rank === 'K') {
    kingsDrawn += 1;
    cupFill = Math.min(1, cupFill + 0.27);
    if (kingsDrawn >= 4) cupFill = 1;
  }

  if (card.rank === 'Q') {
    const me = currentPlayer(s);
    prevQuestionMaster = s.questionMaster;
    questionMaster = me ? me.id : null;
  } else {
    prevQuestionMaster = null;
  }

  return {
    ...s,
    deck: rest,
    drawn,
    current: card,
    kingsDrawn,
    cupFill,
    questionMaster,
    prevQuestionMaster,
    phase,
  };
}

export function setMate(s: GameState, mateId: string): GameState {
  const me = currentPlayer(s);
  if (!me || me.id === mateId) return s;
  const others = s.mates.filter((m) => m.a !== me.id && m.b !== me.id);
  const next: Mate = { a: me.id, b: mateId };
  return { ...s, mates: [...others, next] };
}

export function addCustomRule(s: GameState, text: string): GameState {
  const me = currentPlayer(s);
  const authorId = me ? me.id : 'unknown';
  const trimmed = text.trim();
  if (!trimmed) return s;
  const rule: CustomRule = {
    id: rid('rule'),
    text: trimmed.slice(0, 140),
    authorId,
  };
  return { ...s, rules: [rule] };
}

export function endTurn(s: GameState): GameState {
  if (s.phase === 'gameover') return s;
  if (s.phase !== 'reveal') return s;
  if (s.kingsDrawn >= 4) {
    return { ...s, current: s.current, phase: 'gameover' };
  }
  return {
    ...s,
    current: null,
    turnIndex: (s.turnIndex + 1) % Math.max(s.players.length, 1),
    phase: 'pass',
  };
}

export function startTurn(s: GameState): GameState {
  if (s.phase !== 'pass') return s;
  return { ...s, phase: 'draw' };
}

export function resetGame(): GameState {
  return emptyState();
}

export function setCardOverride(s: GameState, rank: Rank, override: Partial<CardOverride>): GameState {
  const existing = s.cardOverrides[rank];
  return {
    ...s,
    cardOverrides: {
      ...s.cardOverrides,
      [rank]: { ...existing, ...override } as CardOverride,
    },
  };
}

export function clearCardOverride(s: GameState, rank: Rank): GameState {
  const next = { ...s.cardOverrides };
  delete next[rank];
  return { ...s, cardOverrides: next };
}

export function addStartingRule(s: GameState, text: string): GameState {
  const trimmed = text.trim().slice(0, 140);
  if (!trimmed) return s;
  return { ...s, startingRules: [...s.startingRules, trimmed] };
}

export function removeStartingRule(s: GameState, index: number): GameState {
  return { ...s, startingRules: s.startingRules.filter((_, i) => i !== index) };
}

export const PLAYER_COLORS = [
  '#FF4757', '#FF6348', '#FFA502', '#FFD32A',
  '#7BED9F', '#2ED573', '#00D2D3', '#1E90FF',
  '#70A1FF', '#5352ED', '#A29BFE', '#FF6EB4',
  '#FF4FC8', '#FD79A8', '#FF9FF3', '#ECCC68',
  '#48DBFB', '#54A0FF', '#55EFC4', '#FFEAA7',
];

export function addPlayer(s: GameState, name: string): GameState {
  const trimmed = name.trim();
  if (!trimmed) return s;
  if (s.players.length >= 20) return s;
  const usedColors = new Set(s.players.map((p) => p.color));
  const color =
    PLAYER_COLORS.find((c) => !usedColors.has(c)) ??
    PLAYER_COLORS[s.players.length % PLAYER_COLORS.length];
  const player: Player = { id: rid('p'), name: trimmed.slice(0, 24), color };
  return { ...s, players: [...s.players, player] };
}

export function setPlayerColor(s: GameState, id: string, color: string): GameState {
  return { ...s, players: s.players.map((p) => (p.id === id ? { ...p, color } : p)) };
}

export function removePlayer(s: GameState, id: string): GameState {
  return { ...s, players: s.players.filter((p) => p.id !== id) };
}

export function renamePlayer(s: GameState, id: string, name: string): GameState {
  const trimmed = name.trim();
  if (!trimmed) return s;
  return {
    ...s,
    players: s.players.map((p) =>
      p.id === id ? { ...p, name: trimmed.slice(0, 24) } : p,
    ),
  };
}

export function findPlayer(s: GameState, id: string | null): Player | null {
  if (!id) return null;
  return s.players.find((p) => p.id === id) ?? null;
}

export function deckRemaining(s: GameState): number {
  return s.deck.length;
}

export const MAX_PLAYERS = 20;
