
import { Ability, Skill, Weapon, MasteryProperty } from './types';

export const SPECIES_LIST = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Orc', 'Tiefling', 'Aasimar', 'Goliath'
];

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good', 
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export const LANGUAGES = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

export const SKILL_LIST: Skill[] = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
];

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
};

export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 
  'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT', 
  'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT', 
  'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS', 
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 
  'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
};

export const CLASS_SAVING_THROWS: Record<string, Ability[]> = {
  'Barbarian': ['STR', 'CON'],
  'Bard': ['DEX', 'CHA'],
  'Cleric': ['WIS', 'CHA'],
  'Druid': ['INT', 'WIS'],
  'Fighter': ['STR', 'CON'],
  'Monk': ['STR', 'DEX'],
  'Paladin': ['WIS', 'CHA'],
  'Ranger': ['STR', 'DEX'],
  'Rogue': ['DEX', 'INT'],
  'Sorcerer': ['CON', 'CHA'],
  'Warlock': ['WIS', 'CHA'],
  'Wizard': ['INT', 'WIS']
};

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const HIT_DIE: Record<string, number> = {
  'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
  'Bard': 8, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 8, 'Warlock': 8,
  'Sorcerer': 6, 'Wizard': 6
};

export const CLASS_STAT_PRIORITIES: Record<string, Ability[]> = {
  'Barbarian': ['STR', 'CON', 'DEX'],
  'Bard': ['CHA', 'DEX', 'CON'],
  'Cleric': ['WIS', 'CON', 'STR'],
  'Druid': ['WIS', 'CON', 'DEX'],
  'Fighter': ['STR', 'CON', 'DEX'],
  'Monk': ['DEX', 'WIS', 'CON'],
  'Paladin': ['STR', 'CHA', 'CON'],
  'Ranger': ['DEX', 'WIS', 'CON'],
  'Rogue': ['DEX', 'INT', 'CON'],
  'Sorcerer': ['CHA', 'CON', 'DEX'],
  'Warlock': ['CHA', 'CON', 'DEX'],
  'Wizard': ['INT', 'CON', 'DEX']
};

export const CLASS_SKILL_DATA: Record<string, { count: number, options: Skill[] | 'Any' }> = {
  'Barbarian': { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
  'Bard': { count: 3, options: 'Any' },
  'Cleric': { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
  'Druid': { count: 2, options: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
  'Fighter': { count: 2, options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
  'Monk': { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
  'Paladin': { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
  'Ranger': { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
  'Rogue': { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
  'Sorcerer': { count: 2, options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
  'Warlock': { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
  'Wizard': { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] }
};

export interface BackgroundData {
    description: string;
    scores: Ability[];
    feat: string;
    featDescription?: string;
    skills: Skill[];
    equipment?: string[];
}

export const BACKGROUNDS_DATA: Record<string, BackgroundData> = {
    'Acolyte': { 
        description: 'You spent your early years in a temple.', 
        scores: ['WIS', 'INT', 'CHA'], 
        feat: 'Magic Initiate (Cleric)', 
        featDescription: 'Learn two Cleric cantrips and one 1st-level Cleric spell.',
        skills: ['Insight', 'Religion'],
        equipment: ['Holy Symbol', 'Prayer Book', 'Stick of Incense (5)', 'Vestments']
    },
    'Artisan': { 
        description: 'You began as an apprentice to a craftsperson.', 
        scores: ['STR', 'DEX', 'INT'], 
        feat: 'Crafter', 
        featDescription: 'Discount on buying nonmagical items. Craft items faster.',
        skills: ['Investigation', 'Persuasion'],
        equipment: ['Artisan\'s Tools', 'Traveler\'s Clothes']
    },
    'Charlatan': { 
        description: 'You care little for the laws of society.', 
        scores: ['CHA', 'DEX', 'CON'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in 3 Skills or Tools.',
        skills: ['Deception', 'Sleight of Hand'],
        equipment: ['Costume', 'Forged Documents', 'Disguise Kit']
    },
    'Criminal': { 
        description: 'You have a history of breaking the law.', 
        scores: ['DEX', 'CON', 'INT'], 
        feat: 'Alert', 
        featDescription: 'Proficiency in Initiative. Swap initiative with ally.',
        skills: ['Sleight of Hand', 'Stealth'],
        equipment: ['Crowbar', 'Dark Common Clothes', 'Thieves\' Tools']
    },
    'Entertainer': { 
        description: 'You thrive in front of an audience.', 
        scores: ['CHA', 'DEX', 'WIS'], 
        feat: 'Musician', 
        featDescription: 'Grant Heroic Inspiration to allies after a rest.',
        skills: ['Acrobatics', 'Performance'],
        equipment: ['Musical Instrument', 'Costume', 'Mirror']
    },
    'Farmer': { 
        description: 'You grew up close to the land.', 
        scores: ['STR', 'CON', 'WIS'], 
        feat: 'Tough', 
        featDescription: 'Gain +2 HP per level.',
        skills: ['Animal Handling', 'Nature'],
        equipment: ['Carpenter\'s Tools', 'Iron Pot', 'Shovel', 'Sickle']
    },
    'Guard': { 
        description: 'You served in a militia or guard force.', 
        scores: ['STR', 'INT', 'WIS'], 
        feat: 'Alert', 
        featDescription: 'Proficiency in Initiative. Swap initiative with ally.',
        skills: ['Athletics', 'Perception'],
        equipment: ['Manacles', 'Horn', 'Uniform']
    },
    'Guide': { 
        description: 'You know the wilderness well.', 
        scores: ['DEX', 'CON', 'WIS'], 
        feat: 'Magic Initiate (Druid)', 
        featDescription: 'Learn two Druid cantrips and one 1st-level Druid spell.',
        skills: ['Stealth', 'Survival'],
        equipment: ['Bedroll', 'Tent', 'Quiver']
    },
    'Hermit': { 
        description: 'You spent years in seclusion.', 
        scores: ['WIS', 'CON', 'CHA'], 
        feat: 'Healer', 
        featDescription: 'Reroll 1s on healing dice. Use Healer\'s Kit to restore HP.',
        skills: ['Medicine', 'Religion'],
        equipment: ['Herbalism Kit', 'Oil Flask', 'Quarterstaff']
    },
    'Merchant': { 
        description: 'You know how to make a deal.', 
        scores: ['CHA', 'INT', 'WIS'], 
        feat: 'Lucky', 
        featDescription: 'Gain Luck Points to reroll d20s.',
        skills: ['Animal Handling', 'Persuasion'],
        equipment: ['Abacus', 'Quill & Ink', 'Navigator\'s Tools']
    },
    'Noble': { 
        description: 'You were raised in wealth and power.', 
        scores: ['CHA', 'INT', 'WIS'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in 3 Skills or Tools.',
        skills: ['History', 'Persuasion'],
        equipment: ['Signet Ring', 'Fine Clothes', 'Gaming Set']
    },
    'Sage': { 
        description: 'You spent your time studying lore.', 
        scores: ['INT', 'CON', 'WIS'], 
        feat: 'Magic Initiate (Wizard)', 
        featDescription: 'Learn two Wizard cantrips and one 1st-level Wizard spell.',
        skills: ['Arcana', 'History'],
        equipment: ['Quarterstaff', 'Book', 'Parchment']
    },
    'Sailor': { 
        description: 'You sailed the seas.', 
        scores: ['DEX', 'STR', 'WIS'], 
        feat: 'Tavern Brawler', 
        featDescription: 'Unarmed strikes deal 1d4. Push/Topple on hit.',
        skills: ['Acrobatics', 'Perception'],
        equipment: ['Rope (50ft)', 'Navigator\'s Tools']
    },
    'Soldier': { 
        description: 'You were trained for war.', 
        scores: ['STR', 'DEX', 'CON'], 
        feat: 'Savage Attacker', 
        featDescription: 'Advantage on damage rolls with weapons.',
        skills: ['Athletics', 'Intimidation'],
        equipment: ['Gaming Set', 'Healer\'s Kit']
    },
    'Wayfarer': { 
        description: 'You grew up on the road.', 
        scores: ['DEX', 'WIS', 'CHA'], 
        feat: 'Lucky', 
        featDescription: 'Gain Luck Points to reroll d20s.',
        skills: ['Insight', 'Stealth'],
        equipment: ['Map', 'Compass']
    }
};

export const CLASS_FEATURES: Record<string, string[]> = {
    'Barbarian': ['Rage', 'Unarmored Defense', 'Weapon Mastery'],
    'Bard': ['Bardic Inspiration', 'Spellcasting', 'Bardic Versatility'],
    'Cleric': ['Spellcasting', 'Divine Order'],
    'Druid': ['Druidic', 'Primal Order', 'Wild Shape'],
    'Fighter': ['Fighting Style', 'Second Wind', 'Weapon Mastery'],
    'Monk': ['Martial Arts', 'Unarmored Defense', 'Focus Points'],
    'Paladin': ['Lay on Hands', 'Spellcasting', 'Weapon Mastery'],
    'Ranger': ['Favored Enemy', 'Spellcasting', 'Weapon Mastery'],
    'Rogue': ['Expertise', 'Sneak Attack', 'Weapon Mastery', 'Thieves\' Cant'],
    'Sorcerer': ['Innate Sorcery', 'Spellcasting'],
    'Warlock': ['Pact Magic', 'Eldritch Invocations', 'Pact Boon'],
    'Wizard': ['Spellcasting', 'Ritual Adept', 'Arcane Recovery']
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Fighter': { 2: ['Action Surge', 'Tactical Mind'], 5: ['Extra Attack'], 9: ['Indomitable'] },
    'Rogue': { 2: ['Cunning Action'], 5: ['Uncanny Dodge'], 7: ['Evasion'] },
    'Barbarian': { 2: ['Reckless Attack', 'Danger Sense'], 5: ['Extra Attack', 'Fast Movement'] },
    'Monk': { 2: ['Uncanny Metabolism', 'Deflect Attacks'], 5: ['Extra Attack', 'Stunning Strike'] },
    'Paladin': { 2: ['Divine Smite', 'Fighting Style'], 5: ['Extra Attack'] },
    'Ranger': { 2: ['Fighting Style'], 5: ['Extra Attack'] },
    'Sorcerer': { 2: ['Font of Magic', 'Metamagic'] },
    'Warlock': { 2: ['Eldritch Invocations'] },
    'Wizard': { 2: ['Scholar'] },
    'Druid': { 2: ['Wild Shape', 'Wild Companion'] },
    'Cleric': { 2: ['Channel Divinity'] },
    'Bard': { 2: ['Jack of All Trades'] }
};

export interface Trait {
  name: string;
  description: string;
}

export interface DetailData {
  name: string;
  description: string;
  traits: Trait[];
  icon?: string;
  size?: 'Small' | 'Medium';
  speed?: number;
}

export const SPECIES_DETAILS: Record<string, DetailData> = {
  'Human': { 
    name: 'Human', 
    description: 'Versatile and ambitious, humans are diverse innovators found across the multiverse.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name: 'Skillful', description: 'You gain proficiency in one Skill of your choice.' },
      { name: 'Versatile', description: 'You gain an Origin Feat of your choice (e.g., Skilled, Alert).' }
    ] 
  },
  'Elf': { 
    name: 'Elf', 
    description: 'Magical people of otherworldly grace, living in the world but apart from it.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light, and darkness as dim light.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves vs Charmed condition. Magic cannot put you to sleep.' },
      { name: 'Keen Senses', description: 'Proficiency in the Insight, Perception, or Survival skill.' },
      { name: 'Innate Spellcasting', description: 'Choose a lineage (Drow, High, or Wood) to gain cantrips and spells like Misty Step or Detect Magic.' },
      { name: 'Trance', description: 'You don\'t sleep. You meditate for 4 hours to gain the benefits of a Long Rest.' }
    ] 
  },
  'Dwarf': { 
    name: 'Dwarf', 
    description: 'Solid and enduring like the mountains they love, weathering the passage of centuries.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Darkvision', description: '120ft Darkvision range.' },
      { name: 'Dwarven Resilience', description: 'Resistance to Poison damage and Advantage on saves vs Poisoned condition.' },
      { name: 'Dwarven Toughness', description: 'Hit Point maximum increases by 1, and increases by 1 every time you gain a level.' },
      { name: 'Stonecunning', description: 'Gain Tremorsense (range 60ft) on stone surfaces for 10 minutes as a Bonus Action.' }
    ] 
  },
  'Halfling': { 
    name: 'Halfling', 
    description: 'The diminutive halflings survive by being stout and lucky.', 
    size: 'Small',
    speed: 30,
    traits: [
      { name: 'Brave', description: 'Advantage on saves vs the Frightened condition.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than yours.' },
      { name: 'Luck', description: 'When you roll a 1 on a d20 for an attack, check, or save, you can reroll it (must use new roll).' },
      { name: 'Naturally Stealthy', description: 'Proficiency in the Stealth skill.' }
    ] 
  },
  'Dragonborn': { 
    name: 'Dragonborn', 
    description: 'Born of dragons, they walk proudly through a world that greets them with fearful incomprehension.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Breath Weapon', description: 'Exhale energy (Line or Cone) dealing 1d10 damage (scales with level). Replaces an attack.' },
      { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your ancestry.' },
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Draconic Flight', description: 'At 5th level, you can sprout wings to fly for 10 minutes.' }
    ] 
  },
  'Gnome': { 
    name: 'Gnome', 
    description: 'A slight expression of their vibrant energy, gnomes are curious and inventive.', 
    size: 'Small',
    speed: 30,
    traits: [
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Gnomish Cunning', description: 'Advantage on Intelligence, Wisdom, and Charisma saves.' },
      { name: 'Gnomish Lineage', description: 'Choose Forest (Speak with Animals) or Rock (Mending, Prestidigitation) magic.' }
    ] 
  },
  'Orc': { 
    name: 'Orc', 
    description: 'Orcs are moved by a powerful passion for life and combat capabilities.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Adrenaline Rush', description: 'Dash as a Bonus Action. When you do, gain Temp HP equal to proficiency bonus.' },
      { name: 'Darkvision', description: '120ft Darkvision.' },
      { name: 'Relentless Endurance', description: 'When reduced to 0 HP, drop to 1 HP instead (once per Long Rest).' },
      { name: 'Powerful Build', description: 'Count as one size larger when carrying, pushing, dragging, or lifting.' }
    ] 
  },
  'Tiefling': { 
    name: 'Tiefling', 
    description: 'Souls influenced by the Lower Planes, often bearing horns or tails.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Otherworldly Legacy', description: 'Choose Abyssal (Poison/Hold Person), Chthonic (Necrotic/False Life), or Infernal (Fire/Hellish Rebuke) lineage.' },
      { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip.' }
    ] 
  },
  'Aasimar': { 
    name: 'Aasimar', 
    description: 'Souls touched by the power of Mount Celestia, bearing a spark of the divine.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Celestial Resistance', description: 'Resistance to Necrotic and Radiant damage.' },
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Healing Hands', description: 'Magic Action to heal a creature. No spell slots required.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip.' },
      { name: 'Celestial Revelation', description: 'At 3rd level, transform to deal extra damage and fly or radiate light.' }
    ] 
  },
  'Goliath': { 
    name: 'Goliath', 
    description: 'Strong and reclusive, towering over most other folk.', 
    size: 'Medium',
    speed: 35,
    traits: [
      { name: 'Giant Ancestry', description: 'Choose an ancestry (e.g., Cloud for teleport, Fire for damage, Stone for reaction defense).' },
      { name: 'Large Form', description: 'Starting at 5th level, you can grow to Large size as a Bonus Action.' },
      { name: 'Powerful Build', description: 'Advantage on checks to end the Grappled condition. Lift as one size larger.' },
      { name: 'Speed', description: 'Your speed is 35 feet.' }
    ] 
  }
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': {
    name: 'Barbarian',
    description: 'A fierce warrior who can enter a battle rage.',
    traits: [
      { name: 'Rage', description: 'Bonus Action to enter. Adv on STR checks/saves, Resistance to B/P/S damage, +Rage Damage.' },
      { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + CON mod when not wearing armor.' },
      { name: 'Weapon Mastery', description: 'Unlock special properties (Cleave, Topple) on your chosen weapons.' }
    ]
  },
  'Bard': {
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    traits: [
      { name: 'Bardic Inspiration', description: 'Bonus Action to give a die (d6) to an ally to boost d20 rolls.' },
      { name: 'Spellcasting', description: 'Cast spells from the Arcane list. Charisma is your casting ability.' },
      { name: 'Bardic Versatility', description: 'Choose a Skill or Tool proficiency to swap on Long Rests.' }
    ]
  },
  'Cleric': {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic.',
    traits: [
      { name: 'Spellcasting', description: 'Prepare spells from the Divine list daily. Wisdom is your casting ability.' },
      { name: 'Divine Order', description: 'Choose Protector (Heavy Armor + Martial Weapons) or Thaumaturge (Extra Cantrip + Religion bonus).' }
    ]
  },
  'Druid': {
    name: 'Druid',
    description: 'A priest of the Old Faith, wielding the powers of nature.',
    traits: [
      { name: 'Druidic', description: 'You know the secret language of Druids.' },
      { name: 'Primal Order', description: 'Choose Magician (Extra Cantrip + Arcana/Nature) or Warden (Medium Armor + Martial Weapons).' },
      { name: 'Wild Shape', description: 'Transform into a beast or form of nature (now a Bonus Action).' }
    ]
  },
  'Fighter': {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons.',
    traits: [
      { name: 'Fighting Style', description: 'Adopt a style like Archery, Defense, or Great Weapon Fighting.' },
      { name: 'Second Wind', description: 'Bonus Action to regain HP (1d10 + level). Uses vary by level.' },
      { name: 'Weapon Mastery', description: 'Master 3 weapons to use their tactical properties.' }
    ]
  },
  'Monk': {
    name: 'Monk',
    description: 'A master of martial arts, harnessing body and spirit.',
    traits: [
      { name: 'Martial Arts', description: 'Use DEX instead of STR for Monk weapons/unarmed. Bonus Action unarmed strike.' },
      { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + WIS mod.' },
      { name: 'Focus Points', description: 'Fuel special abilities like Flurry of Blows, Patient Defense, and Step of the Wind.' }
    ]
  },
  'Paladin': {
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath.',
    traits: [
      { name: 'Lay on Hands', description: 'Bonus Action to heal creatures from a pool of HP.' },
      { name: 'Spellcasting', description: 'Prepare Divine spells. You can change them after a Long Rest.' },
      { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }
    ]
  },
  'Ranger': {
    name: 'Ranger',
    description: 'A warrior who combats threats on the edges of civilization.',
    traits: [
      { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. Cast it without a slot (limited use).' },
      { name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' },
      { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }
    ]
  },
  'Rogue': {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery.',
    traits: [
      { name: 'Expertise', description: 'Double proficiency bonus in two chosen skills.' },
      { name: 'Sneak Attack', description: 'Deal extra damage (1d6) once per turn if you have Advantage or an ally nearby.' },
      { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' },
      { name: 'Thieves\' Cant', description: 'A secret mix of dialect, jargon, and code.' }
    ]
  },
  'Sorcerer': {
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic.',
    traits: [
      { name: 'Innate Sorcery', description: 'Bonus Action to activate a rage-like state increasing spell DC and attack advantage.' },
      { name: 'Spellcasting', description: 'Cast Arcane spells spontaneously. Charisma is your casting ability.' },
      { name: 'Font of Magic', description: 'Gain Sorcery Points (at level 2) to fuel Metamagic.' }
    ]
  },
  'Warlock': {
    name: 'Warlock',
    description: 'A wielder of magic derived from a pact.',
    traits: [
      { name: 'Pact Magic', description: 'Spell slots are always max level and recharge on a Short Rest.' },
      { name: 'Eldritch Invocations', description: 'Customize your powers with unique magical fragments.' },
      { name: 'Pact Boon', description: 'Choose Blade, Chain, or Tome at level 1.' }
    ]
  },
  'Wizard': {
    name: 'Wizard',
    description: 'A scholarly magic-user manipulating reality.',
    traits: [
      { name: 'Spellcasting', description: 'Learn Arcane spells from scrolls and your spellbook.' },
      { name: 'Ritual Adept', description: 'Cast ritual spells without using a spell slot.' },
      { name: 'Arcane Recovery', description: 'Regain some spell slots on a Short Rest (once per day).' }
    ]
  }
};

export const GENERIC_FEATURES: Record<string, string> = {
  'Action Surge': 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.',
  'Cunning Action': 'You can take a Bonus Action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.',
  'Divine Smite': 'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target.',
  'Wild Shape': 'You can use your Magic action to magically assume the shape of a beast that you have seen before.',
  'Extra Attack': 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
  'Reckless Attack': 'When you make your first attack on your turn, you can decide to attack recklessly. You have advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
  'Danger Sense': 'You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells.',
  'Fighting Style': 'You adopt a particular style of fighting as your specialty (e.g., Archery, Defense, Dueling).',
  'Deft Explorer': 'You are an unsurpassed explorer and survivor.',
  'Step of the Wind': 'You can spend a Focus Point to take the Disengage or Dash action as a Bonus Action, and your jump distance is doubled for the turn.',
  'Patient Defense': 'You can spend a Focus Point to take the Dodge action as a Bonus Action.',
  'Uncanny Metabolism': 'When you roll Initiative, you can regain all expended Focus Points. Once per Long Rest.',
  'Destroy Undead': 'When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its Challenge Rating is at or below a certain threshold.',
  'Wild Resurgence': 'You can expend a spell slot to regain a use of Wild Shape, or expend a Wild Shape use to regain a spell slot.',
  'Uncanny Dodge': 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
  'Sorcerous Restoration': 'You regain Sorcery Points whenever you finish a Short Rest or Long Rest.',
  'Eldritch Invocation': 'In your study of occult lore, you have unearthed Eldritch Invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.',
  'Arcane Recovery': 'Once per day when you finish a Short Rest, you can choose expended spell slots to recover.',
  'Tactical Mind': 'You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of Second Wind to add 1d10 to the roll.',
  'Ability Score Improvement': 'You can increase one Ability Score by 2, or two Ability Scores by 1. Alternatively, you can take a Feat.'
};

export interface SubclassData {
  name: string;
  description: string;
  features: Record<number, Trait[]>; // Maps Level -> Traits gained
}

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { 
      name: 'Path of the Berserker', 
      description: 'Frenzy into a fury that allows extra attacks.',
      features: {
        3: [{ name: 'Frenzy', description: 'When you Rage, you can make a generic unarmed strike or weapon attack as a Bonus Action.' }],
        6: [{ name: 'Mindless Rage', description: 'You have immunity to the Charmed and Frightened conditions while Raging.' }]
      }
    },
    { 
      name: 'Path of the Wild Heart', 
      description: 'Adopt the aspects of animal spirits.',
      features: {
        3: [{ name: 'Animal Speaker', description: 'You can cast Beast Sense and Speak with Animals as rituals.' }, { name: 'Rage of the Wilds', description: 'Choose Bear (Resist all dmg but psychic), Eagle (Disengage/Dash bonus), or Wolf (Advantage for allies).' }]
      }
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Draw on the vitality of the multiverse.',
        features: {
            3: [{ name: 'Vitality of the Tree', description: 'When you Rage, you gain Temp HP. At start of turn, give Temp HP to ally.' }]
        }
    },
    { 
        name: 'Path of the Zealot', 
        description: 'Channel divine power into your rage.',
        features: {
            3: [{ name: 'Divine Fury', description: 'While Raging, first hit deals extra Necrotic or Radiant damage (1d6 + Level).' }]
        }
    },
  ],
  'Bard': [
    { 
        name: 'College of Dance', 
        description: 'Channel the cosmos through agility and movement.',
        features: {
            3: [{ name: 'Dazzling Footwork', description: 'Unarmored Defense (10+DEX+CHA). Unarmed Strikes use Bardic Die. Agile movement.' }]
        }
    },
    { 
        name: 'College of Glamour', 
        description: 'Weave the magic of the Feywild into your performance.',
        features: {
            3: [{ name: 'Mantle of Inspiration', description: 'Use Bardic Inspiration to give allies Temp HP and free movement.' }]
        }
    },
    { 
        name: 'College of Lore', 
        description: 'Collect knowledge and magical secrets from everywhere.',
        features: {
            3: [{ name: 'Cutting Words', description: 'Use Reaction and Bardic Inspiration to reduce an enemy attack, check, or damage roll.' }, { name: 'Bonus Proficiencies', description: 'Gain 3 Skill Proficiencies.' }]
        }
    },
    { 
        name: 'College of Valor', 
        description: 'Inspire heroes in battle and fight alongside them.',
        features: {
            3: [{ name: 'Combat Inspiration', description: 'Allies can use your Inspiration to add to AC or Damage.' }, { name: 'Martial Training', description: 'Proficiency with Martial Weapons and Medium Armor/Shields.' }]
        }
    },
  ],
  'Cleric': [
    { 
        name: 'Life Domain', 
        description: 'Preserve life and heal the wounded.',
        features: {
            3: [{ name: 'Disciple of Life', description: 'Healing spells cure extra HP (2 + Spell Level).' }, { name: 'Preserve Life', description: 'Channel Divinity to heal injured creatures up to half HP.' }]
        }
    },
    { 
        name: 'Light Domain', 
        description: 'Wield the power of light and fire.',
        features: {
            3: [{ name: 'Warding Flare', description: 'Reaction to impose Disadvantage on an attack against you.' }, { name: 'Radiance of the Dawn', description: 'Channel Divinity to deal Radiant damage to foes within 30ft.' }]
        }
    },
    { name: 'Trickery Domain', description: 'Sow chaos and deceive your enemies.', features: { 3: [{ name: 'Blessing of the Trickster', description: 'Grant Advantage on Stealth checks to another creature.' }] } },
    { name: 'War Domain', description: 'Serve as a champion of a war god.', features: { 3: [{ name: 'War Priest', description: 'Make a weapon attack as a Bonus Action (limited uses).' }] } },
  ],
  'Druid': [
    { name: 'Circle of the Land', description: 'Draw magic from specific environments.', features: { 3: [{ name: 'Circle Spells', description: 'Recover spell slots on Short Rest. Always prepared spells based on land type.' }] } },
    { 
        name: 'Circle of the Moon', 
        description: 'Master Wild Shape into powerful combat forms.',
        features: {
            3: [{ name: 'Combat Wild Shape', description: 'Wild Shape as Bonus Action. Cast Abjuration spells while shaped.' }, { name: 'Circle Forms', description: 'Transform into more dangerous beasts (CR 1).' }]
        }
    },
    { name: 'Circle of the Sea', description: 'Channel the wrath of the ocean.', features: { 3: [{ name: 'Wrath of the Sea', description: 'Emanate a storm aura dealing Cold/Lightning damage.' }] } },
    { name: 'Circle of the Stars', description: 'Harness the power of constellations.', features: { 3: [{ name: 'Starry Form', description: 'Bonus Action to enter Archer, Chalice, or Dragon form.' }] } },
  ],
  'Fighter': [
    { 
        name: 'Battle Master', 
        description: 'Master tactical maneuvers to control the battlefield.',
        features: {
            3: [{ name: 'Combat Superiority', description: 'Gain Superiority Dice (d8) and Maneuvers (e.g., Trip Attack, Parry).' }, { name: 'Student of War', description: 'Proficiency with one Artisan Tool.' }]
        }
    },
    { 
        name: 'Champion', 
        description: 'Focus on raw physical power and critical hits.',
        features: {
            3: [{ name: 'Improved Critical', description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.' }, { name: 'Remarkable Athlete', description: 'Advantage on Initiative and some Athletics checks.' }]
        }
    },
    { name: 'Eldritch Knight', description: 'Combine martial prowess with wizard spells.', features: { 3: [{ name: 'Spellcasting', description: 'Cast Wizard spells (Abjuration/Evocation).' }, { name: 'Weapon Bond', description: 'Summon your bonded weapon to your hand.' }] } },
    { name: 'Psi Warrior', description: 'Augment your strikes with psionic power.', features: { 3: [{ name: 'Psionic Power', description: 'Use dice to reduce damage, strike harder, or move objects.' }] } },
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Manipulate life force to heal or harm.', features: { 3: [{ name: 'Hand of Harm/Healing', description: 'Spend Focus to deal necrotic damage or heal with unarmed strikes.' }] } },
    { 
        name: 'Warrior of Shadow', 
        description: 'Master stealth and shadow magic.',
        features: {
            3: [{ name: 'Shadow Arts', description: 'Cast Darkness, Darkvision, etc. using Focus Points. See through magical darkness.' }]
        }
    },
    { name: 'Warrior of the Elements', description: 'Channel elemental energy into your strikes.', features: { 3: [{ name: 'Elemental Attunement', description: 'Reach increases. Deal elemental damage type.' }] } },
    { name: 'Warrior of the Open Hand', description: 'Master the ultimate martial arts techniques.', features: { 3: [{ name: 'Open Hand Technique', description: 'Impose effects (Topple, Push, No Reactions) on Flurry of Blows.' }] } },
  ],
  'Paladin': [
    { name: 'Oath of Devotion', description: 'Embody the ideals of justice and virtue.', features: { 3: [{ name: 'Sacred Weapon', description: 'Add CHA mod to attack rolls.' }] } },
    { name: 'Oath of Glory', description: 'Believe that destiny awaits those who earn it.', features: { 3: [{ name: 'Peerless Athlete', description: 'Advantage on Athletics/Acrobatics. Jump distance increases.' }] } },
    { name: 'Oath of the Ancients', description: 'Protect the light and the natural world.', features: { 3: [{ name: 'Nature\'s Wrath', description: 'Restrain foes with spectral vines.' }] } },
    { name: 'Oath of Vengeance', description: 'Punish those who commit grievous sins.', features: { 3: [{ name: 'Vow of Enmity', description: 'Gain Advantage on attacks against one creature for 1 minute.' }] } },
  ],
  'Ranger': [
    { name: 'Beast Master', description: 'Bond with a primal beast companion.', features: { 3: [{ name: 'Primal Companion', description: 'Summon a Beast of the Land, Air, or Sea to fight alongside you.' }] } },
    { name: 'Fey Wanderer', description: 'Represent the courts of the Feywild.', features: { 3: [{ name: 'Dreadful Strikes', description: 'Deal extra psychic damage once per turn.' }, { name: 'Otherworldly Glamour', description: 'Add WIS mod to Charisma checks.' }] } },
    { name: 'Gloom Stalker', description: 'Strike from the shadows of the Underdark.', features: { 3: [{ name: 'Dread Ambusher', description: 'Bonus to Initiative. Extra attack and damage on first turn of combat.' }, { name: 'Umbral Sight', description: 'Invisible to Darkvision.' }] } },
    { name: 'Hunter', description: 'Protect civilization from the terrors of the wild.', features: { 3: [{ name: 'Hunter\'s Prey', description: 'Choose Colossus Slayer (hurt foes), Giant Killer (reaction attack), or Horde Breaker (extra attack).' }] } },
  ],
  'Rogue': [
    { name: 'Arcane Trickster', description: 'Augment your skills with enchantment and illusion.', features: { 3: [{ name: 'Spellcasting', description: 'Cast Wizard spells.' }, { name: 'Mage Hand Legerdemain', description: 'Invisible Mage Hand for thievery.' }] } },
    { name: 'Assassin', description: 'Master the art of death and infiltration.', features: { 3: [{ name: 'Assassinate', description: 'Advantage against creatures who haven\'t acted. Auto-crit on Surprise.' }] } },
    { name: 'Soulknife', description: 'Strike with blades of psychic energy.', features: { 3: [{ name: 'Psychic Blades', description: 'Manifest blades to attack. Bonus action attack available.' }, { name: 'Psi-Bolstered Knack', description: 'Add die to failed ability checks.' }] } },
    { name: 'Thief', description: 'Hone your skills in larceny and agility.', features: { 3: [{ name: 'Fast Hands', description: 'Use Cunning Action for Sleight of Hand, Thieves Tools, or Use an Object.' }, { name: 'Second-Story Work', description: 'Climb speed equals walk speed.' }] } },
  ],
  'Sorcerer': [
    { name: 'Aberrant Sorcery', description: 'Your magic comes from an alien influence.', features: { 3: [{ name: 'Psionic Spells', description: 'Learn Mind Sliver and other psionic spells.' }] } },
    { name: 'Clockwork Sorcery', description: 'Channel the order of Mechanus.', features: { 3: [{ name: 'Restore Balance', description: 'Reaction to neutralize Advantage/Disadvantage.' }] } },
    { name: 'Draconic Sorcery', description: 'Draw on the magic of dragon blood.', features: { 3: [{ name: 'Draconic Resilience', description: 'AC is 13 + DEX. HP increases.' }] } },
    { name: 'Wild Magic Sorcery', description: 'Channel the chaotic forces of the multiverse.', features: { 3: [{ name: 'Wild Magic Surge', description: 'Chance to trigger random magical effects when casting.' }, { name: 'Tides of Chaos', description: 'Gain Advantage on one roll.' }] } },
  ],
  'Warlock': [
    { name: 'Archfey Patron', description: 'A pact with a lord or lady of the Feywild.', features: { 3: [{ name: 'Misty Escape', description: 'Turn invisible and teleport when you take damage.' }] } }, // Note: 2024 standardized subclasses to 3
    { name: 'Celestial Patron', description: 'A pact with a being of the Upper Planes.', features: { 3: [{ name: 'Healing Light', description: 'Pool of d6s to heal as Bonus Action.' }] } },
    { name: 'Fiend Patron', description: 'A pact with a devil from the Lower Planes.', features: { 3: [{ name: 'Dark One\'s Blessing', description: 'Gain Temp HP when you reduce a hostile creature to 0 HP.' }] } },
    { name: 'Great Old One Patron', description: 'A pact with an eldritch entity.', features: { 3: [{ name: 'Awakened Mind', description: 'Telepathic communication.' }] } },
  ],
  'Wizard': [
    { name: 'Abjurer', description: 'Master of protective magic and wards.', features: { 3: [{ name: 'Arcane Ward', description: 'Create a magical ward that absorbs damage.' }] } },
    { name: 'Diviner', description: 'Master of seeking information and seeing the future.', features: { 3: [{ name: 'Portent', description: 'Roll 2d20 after Long Rest. Replace any roll with these values.' }] } },
    { name: 'Evoker', description: 'Master of destructive elemental energy.', features: { 3: [{ name: 'Sculpt Spells', description: 'Protect allies from your area of effect spells.' }] } },
    { name: 'Illusionist', description: 'Master of deception and phantasms.', features: { 3: [{ name: 'Improved Minor Illusion', description: 'Minor Illusion has both sound and image.' }] } },
  ]
};

export const FEAT_OPTIONS: Trait[] = [
  { name: 'Ability Score Improvement', description: 'Increase one Ability Score by 2, or two Ability Scores by 1.' },
  { name: 'Alert', description: 'Proficiency in Initiative. Swap initiative with ally.' },
  { name: 'Charger', description: 'Dash allows an attack or push as a bonus action.' },
  { name: 'Chef', description: 'Constitution/Wisdom +1. Prepare special food for recovery.' },
  { name: 'Crossbow Expert', description: 'Ignore Loading property. Fire in melee without disadvantage.' },
  { name: 'Defensive Duelist', description: 'Use reaction to add PB to AC against melee attack.' },
  { name: 'Dual Wielder', description: 'Use two-weapon fighting with non-Light weapons.' },
  { name: 'Durable', description: 'Constitution +1. Advantage on Death Saving Throws.' },
  { name: 'Grappler', description: 'Strength/Dexterity +1. Adv on attacks vs grappled targets.' },
  { name: 'Great Weapon Master', description: 'Strength +1. Add PB to damage with Heavy weapons.' },
  { name: 'Healer', description: 'Reroll 1s on healing dice. Use Healer\'s Kit to restore HP.' },
  { name: 'Inspiring Leader', description: 'Charisma/Wisdom +1. Grant temp HP after rest.' },
  { name: 'Mage Slayer', description: 'Strength/Dexterity +1. 1 auto-save/rest against spells.' },
  { name: 'Polearm Master', description: 'Strength/Dexterity +1. Bonus action attack with reach weapons.' },
  { name: 'Resilient', description: 'Increase ability by 1. Gain proficiency in that save.' },
  { name: 'Sentinel', description: 'Strength/Dexterity +1. Opportunity attacks stop movement.' },
  { name: 'Sharpshooter', description: 'Dexterity +1. Ignore cover. Fire at long range without disadvantage.' },
  { name: 'Shield Master', description: 'Strength +1. Shield Bash to prone/push.' },
  { name: 'Speedy', description: 'Dexterity/Constitution +1. Speed increases by 10 ft.' },
  { name: 'Spell Sniper', description: 'Casting Stat +1. Ignore cover. Cast in melee.' },
  { name: 'War Caster', description: 'Casting Stat +1. Adv on Con saves for concentration.' },
];

export const MASTERY_DESCRIPTIONS: Record<string, string> = {
    'Cleave': 'If you hit a creature, you can make a second attack against a creature within 5 feet of it that is also within your reach.',
    'Graze': 'If you miss a creature, you still deal damage equal to your ability modifier.',
    'Nick': 'When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action.',
    'Push': 'If you hit a creature, you can push it 10 feet away from you.',
    'Sap': 'If you hit a creature, it has Disadvantage on its next attack roll before the start of your next turn.',
    'Slow': 'If you hit a creature, its speed is reduced by 10 feet until the start of your next turn.',
    'Topple': 'If you hit a creature, you can force it to make a Constitution saving throw or fall Prone.',
    'Vex': 'If you hit a creature and deal damage, you have Advantage on your next attack roll against that creature before the end of your next turn.',
    '-': 'No mastery property.'
};

export interface Armor {
    baseAC: number;
    type: 'Light' | 'Medium' | 'Heavy' | 'Shield';
    maxDex?: number; // undefined means unlimited
    stealthDisadvantage: boolean;
    cost: number;
}

export const ARMOR_OPTIONS: Record<string, Armor> = {
    'Unarmored': { baseAC: 10, type: 'Light', stealthDisadvantage: false, cost: 0 },
    'Padded': { baseAC: 11, type: 'Light', stealthDisadvantage: true, cost: 5 },
    'Leather': { baseAC: 11, type: 'Light', stealthDisadvantage: false, cost: 10 },
    'Studded Leather': { baseAC: 12, type: 'Light', stealthDisadvantage: false, cost: 45 },
    'Hide': { baseAC: 12, type: 'Medium', maxDex: 2, stealthDisadvantage: false, cost: 10 },
    'Chain Shirt': { baseAC: 13, type: 'Medium', maxDex: 2, stealthDisadvantage: false, cost: 50 },
    'Scale Mail': { baseAC: 14, type: 'Medium', maxDex: 2, stealthDisadvantage: true, cost: 50 },
    'Breastplate': { baseAC: 14, type: 'Medium', maxDex: 2, stealthDisadvantage: false, cost: 400 },
    'Half Plate': { baseAC: 15, type: 'Medium', maxDex: 2, stealthDisadvantage: true, cost: 750 },
    'Ring Mail': { baseAC: 14, type: 'Heavy', maxDex: 0, stealthDisadvantage: true, cost: 30 },
    'Chain Mail': { baseAC: 16, type: 'Heavy', maxDex: 0, stealthDisadvantage: true, cost: 75 },
    'Splint': { baseAC: 17, type: 'Heavy', maxDex: 0, stealthDisadvantage: true, cost: 200 },
    'Plate': { baseAC: 18, type: 'Heavy', maxDex: 0, stealthDisadvantage: true, cost: 1500 },
    'Shield': { baseAC: 2, type: 'Shield', stealthDisadvantage: false, cost: 10 },
};

export const ALL_WEAPONS: Record<string, Weapon> = {
    'Unarmed Strike': { name: 'Unarmed Strike', damage: '1', type: 'Bludgeoning', properties: ['Light'], mastery: '-', equipped: false },
    'Club': { name: 'Club', damage: '1d4', type: 'Bludgeoning', properties: ['Light'], mastery: 'Slow', equipped: false },
    'Dagger': { name: 'Dagger', damage: '1d4', type: 'Piercing', properties: ['Finesse', 'Light', 'Thrown (20/60)'], mastery: 'Nick', equipped: false },
    'Greatclub': { name: 'Greatclub', damage: '1d8', type: 'Bludgeoning', properties: ['Two-Handed'], mastery: 'Push', equipped: false },
    'Handaxe': { name: 'Handaxe', damage: '1d6', type: 'Slashing', properties: ['Light', 'Thrown (20/60)'], mastery: 'Vex', equipped: false },
    'Javelin': { name: 'Javelin', damage: '1d6', type: 'Piercing', properties: ['Thrown (30/120)'], mastery: 'Slow', equipped: false },
    'Light Hammer': { name: 'Light Hammer', damage: '1d4', type: 'Bludgeoning', properties: ['Light', 'Thrown (20/60)'], mastery: 'Nick', equipped: false },
    'Mace': { name: 'Mace', damage: '1d6', type: 'Bludgeoning', properties: [], mastery: 'Sap', equipped: false },
    'Quarterstaff': { name: 'Quarterstaff', damage: '1d6', type: 'Bludgeoning', properties: ['Versatile (1d8)'], mastery: 'Topple', equipped: false },
    'Sickle': { name: 'Sickle', damage: '1d4', type: 'Slashing', properties: ['Light'], mastery: 'Nick', equipped: false },
    'Spear': { name: 'Spear', damage: '1d6', type: 'Piercing', properties: ['Thrown (20/60)', 'Versatile (1d8)'], mastery: 'Sap', equipped: false },
    'Light Crossbow': { name: 'Light Crossbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition (80/320)', 'Loading', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Dart': { name: 'Dart', damage: '1d4', type: 'Piercing', properties: ['Finesse', 'Thrown (20/60)'], mastery: 'Vex', equipped: false },
    'Shortbow': { name: 'Shortbow', damage: '1d6', type: 'Piercing', properties: ['Ammunition (80/320)', 'Two-Handed'], mastery: 'Vex', equipped: false },
    'Sling': { name: 'Sling', damage: '1d4', type: 'Bludgeoning', properties: ['Ammunition (30/120)'], mastery: 'Slow', equipped: false },
    'Battleaxe': { name: 'Battleaxe', damage: '1d8', type: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Topple', equipped: false },
    'Flail': { name: 'Flail', damage: '1d8', type: 'Bludgeoning', properties: [], mastery: 'Sap', equipped: false },
    'Glaive': { name: 'Glaive', damage: '1d10', type: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze', equipped: false },
    'Greataxe': { name: 'Greataxe', damage: '1d12', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', equipped: false },
    'Greatsword': { name: 'Greatsword', damage: '2d6', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', equipped: false },
    'Halberd': { name: 'Halberd', damage: '1d10', type: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave', equipped: false },
    'Lance': { name: 'Lance', damage: '1d12', type: 'Piercing', properties: ['Reach', 'Special'], mastery: 'Topple', equipped: false },
    'Longsword': { name: 'Longsword', damage: '1d8', type: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Sap', equipped: false },
    'Maul': { name: 'Maul', damage: '2d6', type: 'Bludgeoning', properties: ['Heavy', 'Two-Handed'], mastery: 'Topple', equipped: false },
    'Morningstar': { name: 'Morningstar', damage: '1d8', type: 'Piercing', properties: [], mastery: 'Sap', equipped: false },
    'Pike': { name: 'Pike', damage: '1d10', type: 'Piercing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Push', equipped: false },
    'Rapier': { name: 'Rapier', damage: '1d8', type: 'Piercing', properties: ['Finesse'], mastery: 'Vex', equipped: false },
    'Scimitar': { name: 'Scimitar', damage: '1d6', type: 'Slashing', properties: ['Finesse', 'Light'], mastery: 'Nick', equipped: false },
    'Shortsword': { name: 'Shortsword', damage: '1d6', type: 'Piercing', properties: ['Finesse', 'Light'], mastery: 'Vex', equipped: false },
    'Trident': { name: 'Trident', damage: '1d8', type: 'Piercing', properties: ['Thrown (20/60)', 'Versatile (1d10)'], mastery: 'Topple', equipped: false },
    'War Pick': { name: 'War Pick', damage: '1d8', type: 'Piercing', properties: ['Versatile (1d10)'], mastery: 'Sap', equipped: false },
    'Warhammer': { name: 'Warhammer', damage: '1d8', type: 'Bludgeoning', properties: ['Versatile (1d10)'], mastery: 'Push', equipped: false },
    'Whip': { name: 'Whip', damage: '1d4', type: 'Slashing', properties: ['Finesse', 'Reach'], mastery: 'Slow', equipped: false },
    'Blowgun': { name: 'Blowgun', damage: '1', type: 'Piercing', properties: ['Ammunition (25/100)', 'Loading'], mastery: '-', equipped: false },
    'Hand Crossbow': { name: 'Hand Crossbow', damage: '1d6', type: 'Piercing', properties: ['Ammunition (30/120)', 'Light', 'Loading'], mastery: 'Vex', equipped: false },
    'Heavy Crossbow': { name: 'Heavy Crossbow', damage: '1d10', type: 'Piercing', properties: ['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push', equipped: false },
    'Longbow': { name: 'Longbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition (150/600)', 'Heavy', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Musket': { name: 'Musket', damage: '1d12', type: 'Piercing', properties: ['Ammunition (40/120)', 'Loading', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Pistol': { name: 'Pistol', damage: '1d10', type: 'Piercing', properties: ['Ammunition (30/90)', 'Loading'], mastery: 'Vex', equipped: false },
    'Shield': { name: 'Shield', damage: '--', type: 'Armor', properties: ['Shield (+2 AC)'], mastery: '-', equipped: false },
};

interface LevelData {
    features: string[];
    subclass?: boolean;
    asi?: boolean;
}

export const getLevelData = (className: string, level: number): LevelData => {
    // Simplified logic for standard 2024 progression
    // Most classes get Subclass at level 3.
    // ASI at 4, 8, 12, 16, 19.
    const isAsi = [4, 8, 12, 16, 19].includes(level);
    const isSubclass = level === 3; // 2024 standardized subclass level

    const features: string[] = [];
    
    // Check our progression map
    if (CLASS_PROGRESSION[className] && CLASS_PROGRESSION[className][level]) {
        features.push(...CLASS_PROGRESSION[className][level]);
    }
    
    if (isAsi) features.push('Ability Score Improvement');
    
    return { features, subclass: isSubclass, asi: isAsi };
};
