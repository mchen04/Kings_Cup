import type { GameState, Phase } from './types';
import { STATE_VERSION, STORAGE_KEY } from './types';

const PHASES: Phase[] = ['setup', 'pass', 'draw', 'reveal', 'gameover'];

function isPlayer(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const p = v as { id?: unknown; name?: unknown; color?: unknown };
  return typeof p.id === 'string' && typeof p.name === 'string' && typeof p.color === 'string';
}

function isCard(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const c = v as { id?: unknown; suit?: unknown; rank?: unknown };
  return (
    typeof c.id === 'string' && typeof c.suit === 'string' && typeof c.rank === 'string'
  );
}

function isMate(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const m = v as { a?: unknown; b?: unknown };
  return typeof m.a === 'string' && typeof m.b === 'string';
}

function isRule(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const r = v as { id?: unknown; text?: unknown; authorId?: unknown };
  return typeof r.id === 'string' && typeof r.text === 'string' && typeof r.authorId === 'string';
}

function isValid(state: unknown): state is GameState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  if (s.version !== STATE_VERSION) return false;
  if (!Array.isArray(s.players) || !s.players.every(isPlayer)) return false;
  if (!Array.isArray(s.deck) || !s.deck.every(isCard)) return false;
  if (!Array.isArray(s.drawn) || !s.drawn.every(isCard)) return false;
  if (!Array.isArray(s.mates) || !s.mates.every(isMate)) return false;
  if (!Array.isArray(s.rules) || !s.rules.every(isRule)) return false;
  if (typeof s.turnIndex !== 'number' || !Number.isInteger(s.turnIndex) || s.turnIndex < 0) {
    return false;
  }
  if (typeof s.kingsDrawn !== 'number' || s.kingsDrawn < 0 || s.kingsDrawn > 4) return false;
  if (typeof s.cupFill !== 'number' || s.cupFill < 0 || s.cupFill > 1) return false;
  if (s.questionMaster !== null && typeof s.questionMaster !== 'string') return false;
  if (s.prevQuestionMaster !== null && typeof s.prevQuestionMaster !== 'string') return false;
  if (s.current !== null && !isCard(s.current)) return false;
  if (typeof s.phase !== 'string' || !PHASES.includes(s.phase as Phase)) return false;
  if (s.phase !== 'setup' && (s.players as unknown[]).length < 2) return false;
  if (s.phase === 'reveal' && !isCard(s.current)) return false;
  if (typeof s.cardOverrides !== 'object' || s.cardOverrides === null || Array.isArray(s.cardOverrides)) return false;
  if (!Array.isArray(s.startingRules) || !(s.startingRules as unknown[]).every((r) => typeof r === 'string')) return false;
  if (typeof s.matesCount !== 'number' || s.matesCount < 1 || s.matesCount > 4) return false;
  return true;
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota or unavailable; ignore
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
