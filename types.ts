
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

export type WeaponProperty = 'Light' | 'Finesse' | 'Thrown' | 'Two-Handed' | 'Versatile' | 'Reach' | 'Loading' | 'Ammunition' | 'Heavy';
export type MasteryProperty = 'Cleave' | 'Graze' | 'Nick' | 'Push' | 'Sap' | 'Slow' | 'Topple' | 'Vex';

export interface Weapon {
  name: string;
  damage: string;
  type: string; // damage type
  properties: WeaponProperty[];
  mastery: MasteryProperty;
  equipped: boolean;
}

export interface Character {
  id: string;
  name: string;
  species: string; 
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
  weapons: Weapon[];
  equipment: string[]; // General gear
  backstory: string;
  features: string[]; // Class features
  originFeat?: string; // New 2024 Rule
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
