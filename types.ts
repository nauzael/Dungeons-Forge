

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

export interface Armor {
  baseAC: number;
  type: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  stealthDisadvantage: boolean;
  strengthReq: number;
  maxDex?: number;
}

export interface SpellDetail {
    name: string;
    level: number;
    school: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    description: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface Trait {
  name: string;
  description: string;
}

export interface DetailData {
  name?: string;
  description: string;
  size?: 'Small' | 'Medium';
  speed?: number;
  traits: Trait[];
}

export interface BackgroundData {
  description: string;
  scores: Ability[];
  feat: string;
  featDescription: string;
  skills: Skill[];
  equipment: string[];
}

export interface SubclassFeature {
    name: string;
    description: string;
}

export interface SubclassData {
  name: string;
  description: string;
  features: Record<number, SubclassFeature[]>;
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
  notes: Note[];
  features: string[]; // Class features
  originFeat?: string; // New 2024 Rule
  currentFocusPoints?: number; // Monk Resource
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