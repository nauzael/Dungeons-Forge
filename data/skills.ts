
import { Ability, Skill } from '../types';

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
};

export const SKILL_LIST: Skill[] = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
];

export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 
  'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT', 
  'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT', 
  'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS', 
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 
  'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
};

export const SKILL_DESCRIPTIONS: Record<Skill, string> = {
  'Acrobatics': 'Covers your ability to stay on your feet in tricky situations, balance, and perform acrobatic stunts.',
  'Animal Handling': 'Measures your ability to calm a domesticated animal, keep a mount from getting spooked, or intuit an animal’s intentions.',
  'Arcana': 'Measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.',
  'Athletics': 'Covers difficult situations you encounter while climbing, jumping, or swimming.',
  'Deception': 'Determines whether you can convincingly hide the truth, either verbally or through your actions.',
  'History': 'Measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.',
  'Insight': 'Decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone’s next move.',
  'Intimidation': 'Attempts to influence someone through overt threats, hostile actions, and physical violence.',
  'Investigation': 'Used when you look around for clues and make deductions based on those clues.',
  'Medicine': 'Covers your ability to stabilize a dying companion or diagnose an illness.',
  'Nature': 'Measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.',
  'Perception': 'Lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness.',
  'Performance': 'Determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.',
  'Persuasion': 'Attempts to influence someone or a group of people with tact, social graces, or good nature.',
  'Religion': 'Measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.',
  'Sleight of Hand': 'Used when you attempt a manual trickery, such as planting something on someone else or concealing an object on your person.',
  'Stealth': 'Used when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone.',
  'Survival': 'Covers ability to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand.'
};
