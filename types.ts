export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface AbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export type Skill = 
  | 'Acrobatics' | 'Animal Handling' | 'Arcana' | 'Athletics' | 'Deception' 
  | 'History' | 'Insight' | 'Intimidation' | 'Investigation' | 'Medicine' 
  | 'Nature' | 'Perception' | 'Performance' | 'Persuasion' | 'Religion' 
  | 'Sleight of Hand' | 'Stealth' | 'Survival';

export interface Character {
  id: string;
  name: string;
  species: string; // "Race" is Species in 2024
  class: string;
  level: number;
  background: string;
  abilityScores: AbilityScores;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  armorClass: number;
  speed: number;
  initiative: number;
  proficiencyBonus: number;
  skills: Skill[];
  equipment: string[];
  backstory: string;
  features: string[]; // Class features
  spellcasting?: {
    ability: Ability;
    slots: { [level: number]: { total: number; used: number } };
    known: string[];
  }
}

export interface DieRollResult {
  total: number;
  rolls: number[];
  formula: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}