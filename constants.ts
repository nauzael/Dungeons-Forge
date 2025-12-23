
import { Ability, Skill, Weapon, MasteryProperty } from './types';

export const SPECIES_LIST = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Orc', 'Tiefling', 'Aasimar', 'Goliath'
];

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

// Used for Auto-Assign feature: [Primary, Secondary, Tertiary, ...]
export const CLASS_STAT_PRIORITIES: Record<string, Ability[]> = {
  'Barbarian': ['STR', 'CON', 'DEX', 'WIS', 'INT', 'CHA'],
  'Bard': ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
  'Cleric': ['WIS', 'CON', 'STR', 'CHA', 'INT', 'DEX'],
  'Druid': ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
  'Fighter': ['STR', 'CON', 'DEX', 'WIS', 'INT', 'CHA'], // Defaults to STR fighter
  'Monk': ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
  'Paladin': ['STR', 'CHA', 'CON', 'WIS', 'INT', 'DEX'],
  'Ranger': ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
  'Rogue': ['DEX', 'INT', 'CON', 'WIS', 'CHA', 'STR'],
  'Sorcerer': ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
  'Warlock': ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
  'Wizard': ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR']
};

export interface BackgroundData {
  name: string;
  scores: Ability[];
  feat: string;
}

// Based on PHB 2024 Chapter 4
export const BACKGROUNDS_DATA: Record<string, BackgroundData> = {
  'Acolyte': { name: 'Acolyte', scores: ['INT', 'WIS', 'CHA'], feat: 'Magic Initiate (Cleric)' },
  'Artisan': { name: 'Artisan', scores: ['STR', 'DEX', 'INT'], feat: 'Crafter' },
  'Charlatan': { name: 'Charlatan', scores: ['DEX', 'CON', 'CHA'], feat: 'Skilled' },
  'Criminal': { name: 'Criminal', scores: ['DEX', 'CON', 'INT'], feat: 'Alert' },
  'Entertainer': { name: 'Entertainer', scores: ['STR', 'DEX', 'CHA'], feat: 'Musician' },
  'Farmer': { name: 'Farmer', scores: ['STR', 'CON', 'WIS'], feat: 'Tough' },
  'Guard': { name: 'Guard', scores: ['STR', 'INT', 'WIS'], feat: 'Alert' },
  'Guide': { name: 'Guide', scores: ['DEX', 'CON', 'WIS'], feat: 'Magic Initiate (Druid)' },
  'Hermit': { name: 'Hermit', scores: ['CON', 'WIS', 'CHA'], feat: 'Healer' },
  'Merchant': { name: 'Merchant', scores: ['CON', 'INT', 'CHA'], feat: 'Lucky' },
  'Noble': { name: 'Noble', scores: ['STR', 'INT', 'CHA'], feat: 'Skilled' },
  'Sage': { name: 'Sage', scores: ['CON', 'INT', 'WIS'], feat: 'Magic Initiate (Wizard)' },
  'Sailor': { name: 'Sailor', scores: ['STR', 'DEX', 'WIS'], feat: 'Tavern Brawler' },
  'Scribe': { name: 'Scribe', scores: ['DEX', 'INT', 'WIS'], feat: 'Skilled' },
  'Soldier': { name: 'Soldier', scores: ['STR', 'DEX', 'CON'], feat: 'Savage Attacker' },
  'Wayfarer': { name: 'Wayfarer', scores: ['DEX', 'WIS', 'CHA'], feat: 'Lucky' }
};

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

// Updated 2024 Level 1 Features
export const CLASS_FEATURES: Record<string, string[]> = {
  'Barbarian': ['Rage', 'Unarmored Defense', 'Weapon Mastery'],
  'Bard': ['Bardic Inspiration', 'Spellcasting'],
  'Cleric': ['Spellcasting', 'Divine Order'],
  'Druid': ['Spellcasting', 'Druidic', 'Primal Order'],
  'Fighter': ['Fighting Style', 'Second Wind', 'Weapon Mastery'],
  'Monk': ['Martial Arts', 'Unarmored Defense'],
  'Paladin': ['Lay on Hands', 'Spellcasting', 'Weapon Mastery'],
  'Ranger': ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'],
  'Rogue': ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'],
  'Sorcerer': ['Spellcasting', 'Innate Sorcery'],
  'Warlock': ['Eldritch Invocations', 'Pact Magic'],
  'Wizard': ['Spellcasting', 'Ritual Adept', 'Arcane Recovery']
};

export const MASTERY_DESCRIPTIONS: Record<MasteryProperty, string> = {
  'Cleave': 'Hit a second creature within 5ft for damage equal to ability mod.',
  'Graze': 'Deal ability mod damage even on a miss.',
  'Nick': 'Make the extra Light attack as part of the main action.',
  'Push': 'Push target 10ft away if Large or smaller.',
  'Sap': 'Target has Disadvantage on its next attack roll.',
  'Slow': 'Reduce target speed by 10ft.',
  'Topple': 'Force CON save or target falls Prone.',
  'Vex': 'Gain Advantage on next attack against target.'
};

export const STARTING_WEAPONS: Record<string, Weapon> = {
  'Dagger': { name: 'Dagger', damage: '1d4', type: 'Piercing', properties: ['Finesse', 'Light', 'Thrown'], mastery: 'Nick', equipped: true },
  'Greatsword': { name: 'Greatsword', damage: '2d6', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', equipped: true },
  'Longbow': { name: 'Longbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition', 'Heavy', 'Two-Handed'], mastery: 'Slow', equipped: true },
  'Shortsword': { name: 'Shortsword', damage: '1d6', type: 'Piercing', properties: ['Finesse', 'Light'], mastery: 'Vex', equipped: true },
  'Greataxe': { name: 'Greataxe', damage: '1d12', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', equipped: true },
  'Handaxe': { name: 'Handaxe', damage: '1d6', type: 'Slashing', properties: ['Light', 'Thrown'], mastery: 'Vex', equipped: true },
  'Quarterstaff': { name: 'Quarterstaff', damage: '1d6', type: 'Bludgeoning', properties: ['Versatile'], mastery: 'Topple', equipped: true },
  'Mace': { name: 'Mace', damage: '1d6', type: 'Bludgeoning', properties: [], mastery: 'Sap', equipped: true },
  'Warhammer': { name: 'Warhammer', damage: '1d8', type: 'Bludgeoning', properties: ['Versatile'], mastery: 'Push', equipped: true },
  'Crossbow, Light': { name: 'Light Crossbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow', equipped: true },
};
