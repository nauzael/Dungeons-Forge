import { Ability, Skill } from './types';

export const SPECIES_LIST = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Orc', 'Tiefling', 'Aasimar', 'Goliath'
];

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

export const BACKGROUND_LIST = [
  'Acolyte', 'Artisan', 'Charlatan', 'Criminal', 'Entertainer', 'Farmer', 'Guard', 'Guide', 'Hermit', 'Merchant', 'Noble', 'Sage', 'Sailor', 'Soldier', 'Wayfarer'
];

export const SKILL_LIST: Skill[] = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
];

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma'
};

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const HIT_DIE: Record<string, number> = {
  'Barbarian': 12,
  'Fighter': 10,
  'Paladin': 10,
  'Ranger': 10,
  'Bard': 8,
  'Cleric': 8,
  'Druid': 8,
  'Monk': 8,
  'Rogue': 8,
  'Warlock': 8,
  'Sorcerer': 6,
  'Wizard': 6
};

// Simplified base features for demo purposes
export const CLASS_FEATURES: Record<string, string[]> = {
  'Barbarian': ['Rage', 'Unarmored Defense'],
  'Bard': ['Bardic Inspiration', 'Spellcasting'],
  'Cleric': ['Channel Divinity', 'Spellcasting'],
  'Druid': ['Wild Shape', 'Spellcasting'],
  'Fighter': ['Fighting Style', 'Second Wind'],
  'Monk': ['Martial Arts', 'Unarmored Defense'],
  'Paladin': ['Lay on Hands', 'Divine Sense'],
  'Ranger': ['Favored Enemy', 'Natural Explorer'],
  'Rogue': ['Sneak Attack', 'Thieves\' Cant'],
  'Sorcerer': ['Sorcerous Origin', 'Spellcasting'],
  'Warlock': ['Pact Magic', 'Eldritch Invocations'],
  'Wizard': ['Arcane Recovery', 'Spellcasting']
};
