
export const FEAT_OPTIONS: { name: string, description: string }[] = [
    { name: 'Ability Score Improvement', description: 'Increase one Ability Score by 2, or two Ability Scores by 1.' }, { name: 'Actor', description: 'Increase CHA. Advantage on Deception/Performance to mimic.' }, { name: 'Alert', description: 'Add PB to Initiative. Swap initiative with willing ally.' }, { name: 'Athlete', description: 'Increase STR/DEX. Stand up with 5ft movement. Climb faster.' }, { name: 'Charger', description: 'Increase STR/DEX. Improved Dash or Push attacks.' },
    { name: 'Crafter', description: 'Discount on nonmagical items. Fast crafting.' }, { name: 'Crossbow Expert', description: 'Increase DEX. Ignore Loading. Fire in melee without disadvantage.' }, { name: 'Defensive Duelist', description: 'Increase DEX. Use Reaction to add PB to AC.' }, { name: 'Dual Wielder', description: 'Increase STR/DEX. Two-Weapon Fighting with non-Light weapons.' }, { name: 'Durable', description: 'Increase CON. Advantage on Death Saves. Hit Die healing improved.' },
    { name: 'Elementalist', description: 'Increase INT/WIS/CHA. Spells ignore resistance to an elemental type.' }, { name: 'Great Weapon Master', description: 'Increase STR. On Crit/Kill, bonus action attack. Add PB to damage.' }, { name: 'Healer', description: 'Increase WIS. Reroll 1s on healing spells. Med kit usage improved.' }, { name: 'Heavily Armored', description: 'Increase STR/CON. Gain Heavy Armor proficiency.' }, { name: 'Heavy Armor Master', description: 'Increase STR/CON. Reduce incoming non-magical damage by PB.' },
    { name: 'Inspiring Leader', description: 'Increase WIS/CHA. Grant Temp HP to allies after rest.' }, { name: 'Keen Mind', description: 'Increase INT. Expertise in one INT skill.' }, { name: 'Lightly Armored', description: 'Increase STR/DEX. Gain Light/Medium Armor and Shield proficiency.' }, { name: 'Lucky', description: 'Gain Luck Points to grant Advantage or impose Disadvantage.' }, { name: 'Mage Slayer', description: 'Increase STR/DEX. Reaction to attack caster. Adv on saves vs spells.' },
    { name: 'Magic Initiate', description: 'Learn 2 Cantrips and 1 Level 1 Spell from a class list.' }, { name: 'Martial Weapon Training', description: 'Increase STR/DEX. Proficiency in Martial Weapons.' }, { name: 'Medium Armor Master', description: 'Increase STR/DEX. Ignore Max Dex 2 limit on Medium Armor.' }, { name: 'Mobile', description: 'Increase DEX/STR. Speed +10ft. Dash ignores difficult terrain.' }, { name: 'Moderately Armored', description: 'Increase STR/DEX. Medium Armor and Shield proficiency.' },
    { name: 'Mounted Combatant', description: 'Increase STR/WIS. Advantage on attacks vs smaller creatures while mounted.' }, { name: 'Musician', description: 'Increase STR/DEX/CHA. Grant Heroic Inspiration to allies after rest.' }, { name: 'Observant', description: 'Increase INT/WIS. Expertise in Investigation, Perception, or Insight.' }, { name: 'Polearm Master', description: 'Increase STR/DEX. Bonus action attack with butt end. Opportunity attack on entry.' }, { name: 'Resilient', description: 'Increase one score. Gain proficiency in saves for that score.' },
    { name: 'Ritual Caster', description: 'Increase INT/WIS/CHA. Can cast ritual spells.' }, { name: 'Savage Attacker', description: 'Increase STR/DEX. Advantage on weapon damage rolls.' }, { name: 'Sentinel', description: 'Increase STR/DEX. Opportunity attacks stop movement. Reaction attack if ally hit.' }, { name: 'Sharpshooter', description: 'Increase DEX. Ignore cover. Fire at long range without disadvantage.' }, { name: 'Shield Master', description: 'Increase STR. Bash as bonus action. Add shield AC to DEX saves.' },
    { name: 'Skilled', description: 'Gain proficiency in 3 Skills or Tools.' }, { name: 'Skulker', description: 'Increase DEX. Hide when lightly obscured. Missed hidden attacks don\'t reveal.' }, { name: 'Speedy', description: 'Increase DEX/CON. Speed +10ft. Dash ignores difficult terrain.' }, { name: 'Spell Sniper', description: 'Increase INT/WIS/CHA. Ignore cover. Spell range doubled.' }, { name: 'Tavern Brawler', description: 'Increase STR/CON. Unarmed damage 1d4. Grapple as bonus action.' },
    { name: 'Tough', description: 'HP max increases by 2 per level.' }, { name: 'War Caster', description: 'Increase INT/WIS/CHA. Advantage on CON saves. Cast spell as Opportunity Attack.' }, { name: 'Weapon Master', description: 'Increase STR/DEX. Proficiency with 4 weapons. Unlock mastery.' },
];

export const GENERIC_FEATURES: Record<string, string> = {
  // General & Feats
  'Ability Score Improvement': 'Increase one Ability Score by 2, or two Ability Scores by 1. Alternatively, you can select a Feat.',
  'Eldritch Invocation': 'Pieces of forbidden knowledge that imbue you with an abiding magical ability.',
  'Fighting Style': 'You adopt a particular style of fighting as your specialty (e.g., Archery, Defense, Dueling) granting specific bonuses.',
  'Weapon Mastery': 'You can use the mastery properties (like Cleave, Topple, Vex) of weapons you have mastered.',
  'Spellcasting': 'You can cast spells. See your Spells tab for details on slots, preparation, and your spell list.',
  'Expertise': 'Choose a skill you are proficient in. Your proficiency bonus is doubled for any ability check you make that uses the chosen skill.',
  'Epic Boon': 'A powerful feat granted at level 19, representing your ascent to legendary status.',

  // Barbarian
  'Rage': 'Bonus Action. Advantage on STR checks/saves, Resistance to B/P/S damage, +Rage Damage. Cannot cast spells.',
  'Unarmored Defense': 'While not wearing armor, AC equals 10 + DEX mod + CON mod (or WIS for Monks). You can use a Shield (Barbarian only).',
  'Reckless Attack': 'Advantage on STR attacks for the turn, but attacks against you have Advantage.',
  'Danger Sense': 'Advantage on DEX saves against effects you can see.',
  'Primal Knowledge': 'Gain proficiency in another skill. While Raging, use Strength for Acrobatics, Intimidation, Perception, Stealth, or Survival.',
  'Extra Attack': 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
  'Fast Movement': 'Your speed increases by 10 feet while you aren\'t wearing Heavy armor.',
  'Feral Instinct': 'Advantage on Initiative rolls.',
  'Instinctive Pounce': 'As part of the Bonus Action to enter Rage, you can move up to half your Speed.',
  'Brutal Strike': 'Forgo Advantage on a Reckless Attack to deal extra 1d10 damage and apply an effect (Forceful Blow or Hamstring Blow).',
  'Relentless Rage': 'If you drop to 0 HP while Raging, DC 10 CON save to drop to 2x Level HP instead.',
  'Improved Brutal Strike': 'Brutal Strike damage increases to 2d10. Can use two effects.',
  'Persistent Rage': 'Regain all Rage uses on Initiative. Rage lasts 10 mins without needing to be extended.',
  'Indomitable Might': 'If your total for a Strength check is less than your Strength score, you can use the score.',
  'Primal Champion': 'Strength and Constitution scores increase by 4 (max 25).',

  // Bard
  'Bardic Inspiration': 'Bonus Action. Grant a die (d6-d12) to a creature. They can add it to a d20 Test, or use for subclass features.',
  'Jack of All Trades': 'Add half PB to any ability check you make that doesn\'t already include your PB.',
  'Font of Inspiration': 'Regain Bardic Inspiration on Short or Long Rest. Expend spell slot to regain a use.',
  'Countercharm': 'Reaction. Disrupt mind-influencing effects. Adv on saves vs Charmed/Frightened for you or target.',
  'Magical Secrets': 'Choose prepared spells from the Cleric, Druid, or Wizard spell lists.',
  'Superior Inspiration': 'Regain up to 2 uses of Bardic Inspiration when you roll Initiative.',
  'Words of Creation': 'You always have Power Word Heal and Power Word Kill prepared.',

  // Cleric
  'Divine Order': 'Choose Protector (Heavy Armor/Martial Weapons) or Thaumaturge (Extra Cantrip/Religion Bonus).',
  'Channel Divinity': 'Fuel magical effects like Divine Spark or Turn Undead. Regain on Short/Long Rest.',
  'Divine Spark': 'Magic Action. Heal 1d8+WIS or deal 1d8+WIS Radiant/Necrotic damage.',
  'Turn Undead': 'Magic Action. Undead within 30ft save or become Frightened/Incapacitated.',
  'Sear Undead': 'Turn Undead deals Radiant damage equal to Wis mod d8s.',
  'Blessed Strikes': 'Choose Divine Strike (1d8 extra weapon dmg) or Potent Spellcasting (WIS mod to cantrip dmg).',
  'Divine Intervention': 'Magic Action. Cast any Cleric spell of level 5 or lower without a slot.',
  'Improved Blessed Strikes': 'Divine Strike becomes 2d8, or Potent Spellcasting grants Temp HP.',
  'Greater Divine Intervention': 'Divine Intervention can cast Wish.',

  // Druid
  'Druidic': 'You know the secret language of Druids and always have Speak with Animals prepared.',
  'Primal Order': 'Choose Magician (Extra Cantrip/Nature Bonus) or Warden (Medium Armor/Martial Weapons).',
  'Wild Shape': 'Bonus Action. Transform into a Beast (Max CR varies). Gain Temp HP.',
  'Wild Companion': 'Expend a use of Wild Shape to cast Find Familiar.',
  'Wild Resurgence': 'Expend a spell slot to regain Wild Shape use, or expend Wild Shape to regain a level 1 slot.',
  'Elemental Fury': 'Choose Potent Spellcasting (WIS to cantrip dmg) or Primal Strike (1d8 Cold/Fire/Lightning/Thunder on hit).',
  'Improved Elemental Fury': 'Potent Spellcasting range +300ft, or Primal Strike 2d8.',
  'Beast Spells': 'Cast spells while in Wild Shape (if no material cost).',
  'Archdruid': 'Regain Wild Shape on Initiative. Convert Wild Shape to spell slots. Age slower.',

  // Fighter
  'Second Wind': 'Bonus Action. Regain 1d10 + Fighter Level HP. Can also be used for Tactical Mind/Shift.',
  'Action Surge': 'Take one additional action on your turn. Once per Short/Long rest.',
  'Tactical Mind': 'Expend Second Wind on a failed ability check to add 1d10 to the roll.',
  'Tactical Shift': 'Move half speed without provoking attacks when you use Second Wind.',
  'Indomitable': 'Reroll a failed saving throw with a bonus equal to Fighter Level.',
  'Tactical Master': 'Replace weapon mastery property with Push, Sap, or Slow on an attack.',
  'Two Extra Attacks': 'You can attack three times whenever you take the Attack action.',
  'Studied Attacks': 'If you miss an attack, you have Advantage on your next attack against that creature.',
  'Three Extra Attacks': 'You can attack four times whenever you take the Attack action.',

  // Monk
  'Monk\'s Focus': 'Focus Points fuel abilities like Flurry of Blows, Patient Defense, and Step of the Wind.',
  'Unarmored Movement': 'Speed increases while unarmored. Eventually run on walls/water.',
  'Uncanny Metabolism': 'On Initiative, regain all Focus Points and heal HP (Die + Level). Once per LR.',
  'Deflect Attacks': 'Reaction to reduce damage from a melee or ranged attack. If 0 damage, spend Focus to redirect.',
  'Slow Fall': 'Reaction to reduce falling damage by 5 x Monk Level.',
  'Stunning Strike': 'Spend 1 Focus on hit. CON save or Stunned. On success, speed halved.',
  'Empowered Strikes': 'Unarmed strikes can deal Force damage.',
  'Evasion': 'On DEX saves for half damage, take none on success and half on fail.',
  'Acrobatic Movement': 'Move along vertical surfaces and liquids without falling.',
  'Heightened Focus': 'Flurry gives 3 attacks. Patient Defense heals. Step of Wind moves allies.',
  'Self-Restoration': 'Bonus Action to end Charmed/Frightened/Poisoned. No exhaustion from food/drink.',
  'Deflect Energy': 'Deflect Attacks works on any damage type.',
  'Disciplined Survivor': 'Proficiency in all Saving Throws. Reroll failed saves with Focus.',
  'Perfect Focus': 'Regain Focus Points on Initiative if you have 3 or fewer.',
  'Superior Defense': 'Action (spend 3 Focus). Resistance to all damage except Force for 1 min.',
  'Body and Mind': 'DEX and WIS scores increase by 4 (max 25).',

  // Paladin
  'Lay On Hands': 'Bonus Action. Pool of healing (5 x Level). Touch to heal or cure conditions (5 points).',
  'Paladin\'s Smite': 'Always have Divine Smite prepared. Cast once freely per Long Rest.',
  'Faithful Steed': 'Always have Find Steed prepared. Cast once freely per Long Rest.',
  'Aura of Protection': 'Allies within 10ft add your CHA mod to Saving Throws.',
  'Abjure Foes': 'Magic Action. Channel Divinity to Frighten foes and restrict their actions.',
  'Aura of Courage': 'You and allies in aura are immune to Frightened.',
  'Radiant Strikes': 'Melee attacks deal extra 1d8 Radiant damage.',
  'Restoring Touch': 'Remove conditions (Blinded, Charmed, etc.) with Lay On Hands (5 pts).',
  'Aura Expansion': 'Aura of Protection range increases to 30 feet.',

  // Ranger
  'Favored Enemy': 'Always have Hunter\'s Mark prepared. Free casts. Damage increases to 1d10 at lvl 20.',
  'Deft Explorer': 'Gain Expertise in one skill and learn two languages.',
  'Roving': 'Speed +10ft. Gain Climb and Swim speeds equal to Speed.',
  'Tireless': 'Magic Action to gain Temp HP (1d8+WIS). Reduce Exhaustion on Short Rest.',
  'Relentless Hunter': 'Taking damage doesn\'t break Concentration on Hunter\'s Mark.',
  'Nature\'s Veil': 'Bonus Action. Become Invisible until the end of your next turn.',
  'Precise Hunter': 'Advantage on attacks against creature marked by Hunter\'s Mark.',
  'Feral Senses': 'Gain Blindsight with a range of 30 feet.',
  'Foe Slayer': 'Hunter\'s Mark damage die becomes a d10.',

  // Rogue
  'Sneak Attack': 'Deal extra damage once per turn to a creature you hit with Advantage or ally adjacent.',
  'Thieves\' Cant': 'You know the secret rogue language and one other language.',
  'Cunning Action': 'Bonus Action to Dash, Disengage, or Hide.',
  'Steady Aim': 'Bonus Action. Gain Advantage on next attack. Speed becomes 0.',
  'Uncanny Dodge': 'Reaction to halve damage from an attack you can see.',
  'Cunning Strike': 'Trade Sneak Attack dice for effects (Poison, Trip, Withdraw).',
  'Reliable Talent': 'Treat d20 rolls of 9 or lower as a 10 for proficient skills/tools.',
  'Improved Cunning Strike': 'Use up to two Cunning Strike effects at once.',
  'Devious Strikes': 'New Cunning Strike options: Daze, Knock Out, Obscure.',
  'Slippery Mind': 'Proficiency in Wisdom and Charisma saving throws.',
  'Elusive': 'No attack roll has Advantage against you.',
  'Stroke of Luck': 'Treat a failed d20 Test as a 20. Once per Short/Long Rest.',

  // Sorcerer
  'Innate Sorcery': 'Bonus Action. +1 Spell DC, Advantage on spell attacks for 1 min.',
  'Font of Magic': 'Convert Sorcery Points to Spell Slots and vice versa.',
  'Metamagic': 'Spend Sorcery Points to alter spells (e.g., Quickened, Subtle, Twinned).',
  'Sorcerous Restoration': 'Regain Sorcery Points on Short Rest.',
  'Sorcery Incarnate': 'Regain Innate Sorcery uses. Use 2 Metamagics at once.',
  'Arcane Apotheosis': 'While Innate Sorcery is active, use one Metamagic option per turn for free.',

  // Warlock
  'Pact Magic': 'Spell slots are always max level and recharge on Short Rest.',
  'Magical Cunning': '1 Minute ritual to regain half your Pact Slots. Once per Long Rest.',
  'Contact Patron': 'Always have Contact Other Plane prepared. Cast safely once per LR.',
  'Mystic Arcanum': 'Choose high-level spell (6th-9th) to cast once per Long Rest without a slot.',
  'Eldritch Master': 'Magical Cunning restores all spell slots.',

  // Wizard
  'Ritual Adept': 'Cast ritual spells from your book without preparing them.',
  'Arcane Recovery': 'Regain spell slots (combined level = half wizard level) on Short Rest.',
  'Scholar': 'Expertise in one Academic skill (Arcana, History, etc.).',
  'Memorize Spell': 'Swap one prepared spell for another from your book on a Short Rest.',
  'Spell Mastery': 'Choose a lvl 1 and lvl 2 spell to cast at will (lowest level).',
  'Signature Spells': 'Choose two lvl 3 spells. Always prepared, cast free once per Short Rest.'
};
