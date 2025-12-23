
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

// Relaxed to string to allow property variants like 'Thrown (20/60)' or 'Range (80/320)' used in constants
export type WeaponProperty = string;
export type MasteryProperty = 'Cleave' | 'Graze' | 'Nick' | 'Push' | 'Sap' | 'Slow' | 'Topple' | 'Vex' | '-';

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
  alignment: string; // New 2024
  size: 'Small' | 'Medium'; // New 2024
  abilityScores: AbilityScores;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  armorClass: number;
  speed: number;
  initiative: number;
  proficiencyBonus: number;
  skills: Skill[];
  languages: string[]; // New 2024
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
