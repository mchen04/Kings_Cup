export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6'
  | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  id: string;
  suit: Suit;
  rank: Rank;
};

export type Player = {
  id: string;
  name: string;
};

export type Mate = {
  a: string;
  b: string;
};

export type CustomRule = {
  id: string;
  text: string;
  authorId: string;
};

export type Phase =
  | 'setup'
  | 'pass'
  | 'draw'
  | 'reveal'
  | 'gameover';

export type GameState = {
  players: Player[];
  turnIndex: number;
  deck: Card[];
  drawn: Card[];
  current: Card | null;
  kingsDrawn: number;
  cupFill: number;
  mates: Mate[];
  rules: CustomRule[];
  questionMaster: string | null;
  prevQuestionMaster: string | null;
  phase: Phase;
  version: number;
};

export const STORAGE_KEY = 'kings-cup:v2';
export const STATE_VERSION = 2;
