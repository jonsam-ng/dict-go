
export interface Word {
  word: string;
  definition: string;
  collocations: string[];
  synonyms: string[];
  example: string;
  root?: string;
  level: 'cet4' | 'cet6' | 'kaoyan' | 'ielts';
}

export interface ConfusablePair {
  id: string;
  word1: Word;
  word2: Word;
  difference: string;
}

export interface GameProgress {
  gameType: string;
  currentLevel: number;
  score: number;
  timeUsed: number;
  wrongWords: string[];
}
