import type { GameState, Rank } from '../types';

export type CardRule = {
  rank: Rank;
  title: string;
  short: string;
  description: string;
  needsTarget?: boolean;
  needsMate?: boolean;
  needsRule?: boolean;
};

export function resolveRule(s: GameState, rank: Rank): CardRule {
  const base = CARD_RULES[rank];
  const ov = s.cardOverrides[rank];
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    short: ov.short || base.short,
    description: ov.description || base.description,
  };
}

export const CARD_RULES: Record<Rank, CardRule> = {
  A: {
    rank: 'A',
    title: 'Waterfall',
    short: 'Everyone sips',
    description: 'Everyone starts sipping with the drawer. You can stop when the player to your right stops.',
  },
  '2': {
    rank: '2',
    title: 'You',
    short: 'Pick a player to sip',
    description: 'Choose another player. They take a sip.',
  },
  '3': {
    rank: '3',
    title: 'Me',
    short: 'You sip',
    description: 'The drawer takes a sip.',
  },
  '4': {
    rank: '4',
    title: 'Floor',
    short: 'Last to touch floor sips',
    description: 'Everyone races to touch the floor. Last one sips.',
  },
  '5': {
    rank: '5',
    title: 'Guys',
    short: 'Guys sip',
    description: 'Every guy takes a sip.',
  },
  '6': {
    rank: '6',
    title: 'Chicks',
    short: 'Chicks sip',
    description: 'Every chick takes a sip.',
  },
  '7': {
    rank: '7',
    title: 'Heaven',
    short: 'Last hand up sips',
    description: 'Everyone shoots a hand to the sky. Last one to react sips.',
  },
  '8': {
    rank: '8',
    title: 'Mate',
    short: 'Pick a drinking buddy',
    description: 'Choose a drinking buddy. When you sip, they sip. Lasts until the game ends.',
    needsMate: true,
  },
  '9': {
    rank: '9',
    title: 'Rhyme',
    short: 'Rhyme around',
    description: 'Say a word. Going around the circle, each player must rhyme with it. First to fail sips.',
  },
  '10': {
    rank: '10',
    title: 'Categories',
    short: 'Name a category',
    description: 'Pick a category (e.g., car brands). Going around, each player names one. First to fail or repeat sips.',
  },
  J: {
    rank: 'J',
    title: 'Make a Rule',
    short: 'New rule until game ends',
    description: 'Invent a rule that lasts the rest of the game. Anyone who breaks it sips.',
    needsRule: true,
  },
  Q: {
    rank: 'Q',
    title: 'Question Master',
    short: 'Ask questions, dodge answers',
    description: 'You are the Question Master. Anyone who answers your question sips. Lasts until another Queen is drawn.',
  },
  K: {
    rank: 'K',
    title: "King's Cup",
    short: 'Pour into the cup',
    description: 'Pour some of your drink into the King\'s Cup. Whoever draws the fourth King drinks it and the game ends.',
  },
};
