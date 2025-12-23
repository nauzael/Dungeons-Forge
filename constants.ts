

import { Ability, Skill, Weapon, MasteryProperty, SpellDetail } from './types';

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

export const SPELLCASTING_ABILITY: Record<string, Ability> = {
    'Bard': 'CHA',
    'Cleric': 'WIS',
    'Druid': 'WIS',
    'Paladin': 'CHA',
    'Ranger': 'WIS',
    'Sorcerer': 'CHA',
    'Warlock': 'CHA',
    'Wizard': 'INT',
};

export const CASTER_TYPE: Record<string, 'full' | 'half' | 'pact' | 'none'> = {
    'Barbarian': 'none', 'Bard': 'full', 'Cleric': 'full', 'Druid': 'full',
    'Fighter': 'none', 'Monk': 'none', 'Paladin': 'half', 'Ranger': 'half',
    'Rogue': 'none', 'Sorcerer': 'full', 'Warlock': 'pact', 'Wizard': 'full',
};

// Max spell level a character can cast. 1/3 casters not implemented yet.
export const MAX_SPELL_LEVEL: Record<'full' | 'half' | 'pact', Record<number, number>> = {
    'full': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9, },
    'half': { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5, },
    'pact': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5, }
};

export const SPELL_DETAILS: Record<string, SpellDetail> = {
  // Cantrips
  'Acid Splash': { name: 'Acid Splash', level: 0, school: 'Evocation', castingTime: 'Action', range: '60 feet', components: 'V, S', duration: 'Instantaneous', description: 'You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.\n\nCantrip Upgrade. The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).' },
  'Blade Ward': { name: 'Blade Ward', level: 0, school: 'Abjuration', castingTime: 'Action', range: 'Self', components: 'V, S', duration: 'Concentration, up to 1 minute', description: 'Whenever a creature makes an attack roll against you before the spell ends, the attacker subtracts 1d4 from the attack roll.' },
  'Chill Touch': { name: 'Chill Touch', level: 0, school: 'Necromancy', castingTime: 'Action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', description: 'Channeling the chill of the grave, make a melee spell attack against a target within reach. On a hit, the target takes 1d10 Necrotic damage, and it can\'t regain Hit Points until the end of your next turn.\n\nCantrip Upgrade. The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).' },
  'Dancing Lights': { name: 'Dancing Lights', level: 0, school: 'Illusion', castingTime: 'Action', range: '120 feet', components: 'V, S, M (a bit of phosphorus)', duration: 'Concentration, up to 1 minute', description: 'You create up to four torch-size lights within range, making them appear as torches, lanterns, or glowing orbs that hover for the duration. Alternatively, you combine the four lights into one glowing Medium form that is vaguely humanlike. Whichever form you choose, each light sheds Dim Light in a 10-foot radius.\nAs a Bonus Action, you can move the lights up to 60 feet to a space within range. A light must be within 20 feet of another light created by this spell, and a light vanishes if it exceeds the spell\'s range.' },
  'Druidcraft': { name: 'Druidcraft', level: 0, school: 'Transmutation', castingTime: 'Action', range: '30 feet', components: 'V, S', duration: 'Instantaneous', description: 'Whispering to the spirits of nature, you create one of the following effects within range.\nWeather Sensor. You create a Tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours.\nBloom. You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.\nSensory Effect. You create a harmless sensory effect, such as falling leaves, spectral dancing fairies, a gentle breeze, the sound of an animal, or the faint odor of skunk. The effect must fit in a 5-foot Cube.\nFire Play. You light or snuff out a candle, a torch, or a campfire.' },
  'Eldritch Blast': { name: 'Eldritch Blast', level: 0, school: 'Evocation', castingTime: 'Action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'You hurl a beam of crackling energy. Make a ranged spell attack against one creature or object in range. On a hit, the target takes 1d10 Force damage.\n\nCantrip Upgrade. The spell creates two beams at level 5, three beams at level 11, and four beams at level 17. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.' },
  'Fire Bolt': { name: 'Fire Bolt', level: 0, school: 'Evocation', castingTime: 'Action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'You hurl a mote of fire at a creature or an object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Fire damage. A flammable object hit by this spell starts burning if it isn\'t being worn or carried.\n\nCantrip Upgrade. The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).' },
  'Guidance': { name: 'Guidance', level: 0, school: 'Divination', castingTime: 'Action', range: 'Touch', components: 'V, S', duration: 'Concentration, up to 1 minute', description: 'You touch a willing creature and choose a skill. Until the spell ends, the creature adds 1d4 to any ability check using the chosen skill.' },
  'Light': { name: 'Light', level: 0, school: 'Evocation', castingTime: 'Action', range: 'Touch', components: 'V, M (a firefly or phosphorescent moss)', duration: '1 hour', description: 'You touch one Large or smaller object that isn\'t being worn or carried by someone else. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The light can be colored as you like.\nCovering the object with something opaque blocks the light. The spell ends if you cast it again.' },
  'Mage Hand': { name: 'Mage Hand', level: 0, school: 'Conjuration', castingTime: 'Action', range: '30 feet', components: 'V, S', duration: '1 minute', description: 'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.\nWhen you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.\nAs a Magic action on your later turns, you can control the hand thus again. As part of that action, you can move the hand up to 30 feet.\nThe hand can\'t attack, activate magic items, or carry more than 10 pounds.' },
  'Mending': { name: 'Mending', level: 0, school: 'Transmutation', castingTime: '1 minute', range: 'Touch', components: 'V, S, M (two lodestones)', duration: 'Instantaneous', description: 'This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.\nThis spell can physically repair a magic item, but it can\'t restore magic to such an object.' },
  'Message': { name: 'Message', level: 0, school: 'Transmutation', castingTime: 'Action', range: '120 feet', components: 'S, M (a copper wire)', duration: '1 round', description: 'You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.\nYou can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence; 1 foot of stone, metal, or wood; or a thin sheet of lead blocks the spell.' },
  'Vicious Mockery': { name: 'Vicious Mockery', level: 0, school: 'Enchantment', castingTime: 'Action', range: '60 feet', components: 'V', duration: 'Instantaneous', description: 'You unleash a string of insults laced with subtle enchantments at one creature you can see or hear within range. The target must succeed on a Wisdom saving throw or take 1d6 Psychic damage and have Disadvantage on the next attack roll it makes before the end of its next turn.\n\nCantrip Upgrade. The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).' },
  
  // Level 1 Spells
  'Alarm': { name: 'Alarm', level: 1, school: 'Abjuration', castingTime: '1 minute or Ritual', range: '30 feet', components: 'V, S, M (a bell and silver wire)', duration: '8 hours', description: 'You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. You can designate creatures that won\'t set off the alarm. You also choose whether the alarm is audible or mental.\nAudible Alarm. The alarm produces the sound of a handbell for 10 seconds within 60 feet.\nMental Alarm. You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you\'re asleep.' },
  'Animal Friendship': { name: 'Animal Friendship', level: 1, school: 'Enchantment', castingTime: 'Action', range: '30 feet', components: 'V, S, M (a morsel of food)', duration: '24 hours', description: 'Target a Beast that you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spell ends.\n\nUsing a Higher-Level Spell Slot. You can target one additional Beast for each spell slot level above 1.' },
  'Armor of Agathys': { name: 'Armor of Agathys', level: 1, school: 'Abjuration', castingTime: 'Bonus Action', range: 'Self', components: 'V, S, M (a shard of blue glass)', duration: '1 hour', description: 'Protective magical frost surrounds you. You gain 5 Temporary Hit Points. If a creature hits you with a melee attack roll before the spell ends, the creature takes 5 Cold damage. The spell ends early if you have no Temporary Hit Points.\n\nUsing a Higher-Level Spell Slot. The Temporary Hit Points and the Cold damage both increase by 5 for each spell slot level above 1.' },
  'Arms of Hadar': { name: 'Arms of Hadar', level: 1, school: 'Conjuration', castingTime: 'Action', range: 'Self', components: 'V, S', duration: 'Instantaneous', description: 'Invoking Hadar, you cause tendrils to erupt from yourself. Each creature in a 10-foot Emanation originating from you makes a Strength saving throw. On a failed save, a target takes 2d6 Necrotic damage and can\'t take Reactions until the start of its next turn. On a successful save, a target takes half as much damage only.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 1.' },
  'Bane': { name: 'Bane', level: 1, school: 'Enchantment', castingTime: 'Action', range: '30 feet', components: 'V, S, M (a drop of blood)', duration: 'Concentration, up to 1 minute', description: 'Up to three creatures of your choice that you can see within range must each make a Charisma saving throw. Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.\n\nUsing a Higher-Level Spell Slot. You can target one additional creature for each spell slot level above 1.' },
  'Bless': { name: 'Bless', level: 1, school: 'Enchantment', castingTime: 'Action', range: '30 feet', components: 'V, S, M (a Holy Symbol worth 5+ GP)', duration: 'Concentration, up to 1 minute', description: 'You bless up to three creatures within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target adds 1d4 to the attack roll or save.\n\nUsing a Higher-Level Spell Slot. You can target one additional creature for each spell slot level above 1.' },
  'Burning Hands': { name: 'Burning Hands', level: 1, school: 'Evocation', castingTime: 'Action', range: 'Self', components: 'V, S', duration: 'Instantaneous', description: 'A thin sheet of flames shoots forth from you. Each creature in a 15-foot Cone makes a Dexterity saving throw, taking 3d6 Fire damage on a failed save or half as much damage on a successful one. Flammable objects in the Cone that aren\'t being worn or carried start burning.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 1.' },
  'Charm Person': { name: 'Charm Person', level: 1, school: 'Enchantment', castingTime: 'Action', range: '30 feet', components: 'V, S', duration: '1 hour', description: 'One Humanoid you can see within range makes a Wisdom saving throw. It does so with Advantage if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it. The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.\n\nUsing a Higher-Level Spell Slot. You can target one additional creature for each spell slot level above 1.' },
  'Command': { name: 'Command', level: 1, school: 'Enchantment', castingTime: 'Action', range: '60 feet', components: 'V', duration: 'Instantaneous', description: 'You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. Choose from: Approach, Drop, Flee, Grovel, Halt.\n\nUsing a Higher-Level Spell Slot. You can affect one additional creature for each spell slot level above 1.' },
  'Cure Wounds': { name: 'Cure Wounds', level: 1, school: 'Abjuration', castingTime: 'Action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', description: 'A creature you touch regains a number of Hit Points equal to 2d8 plus your spellcasting ability modifier.\n\nUsing a Higher-Level Spell Slot. The healing increases by 2d8 for each spell slot level above 1.' },
  'Detect Magic': { name: 'Detect Magic', level: 1, school: 'Divination', castingTime: 'Action or Ritual', range: 'Self', components: 'V, S', duration: 'Concentration, up to 10 minutes', description: 'For the duration, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visible creature or object in the area that bears the magic, and if an effect was created by a spell, you learn the spell\'s school of magic.\nThe spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.' },
  'Guiding Bolt': { name: 'Guiding Bolt', level: 1, school: 'Evocation', castingTime: 'Action', range: '120 feet', components: 'V, S', duration: '1 round', description: 'You hurl a bolt of light toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 4d6 Radiant damage, and the next attack roll made against it before the end of your next turn has Advantage.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 1.' },
  'Healing Word': { name: 'Healing Word', level: 1, school: 'Abjuration', castingTime: 'Bonus Action', range: '60 feet', components: 'V', duration: 'Instantaneous', description: 'A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.\n\nUsing a Higher-Level Spell Slot. The healing increases by 2d4 for each spell slot level above 1.' },
  'Hex': { name: 'Hex', level: 1, school: 'Enchantment', castingTime: 'Bonus Action', range: '90 feet', components: 'V, S, M (the petrified eye of a newt)', duration: 'Concentration, up to 1 hour', description: 'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 Necrotic damage to the target whenever you hit it with an attack roll. Also, choose one ability when you cast the spell. The target has Disadvantage on ability checks made with the chosen ability.\nIf the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action on a later turn to curse a new creature.\n\nUsing a Higher-Level Spell Slot. Your Concentration can last longer with a spell slot of level 2 (up to 4 hours), 3-4 (up to 8 hours), or 5+ (24 hours).' },
  'Magic Missile': { name: 'Magic Missile', level: 1, school: 'Evocation', castingTime: 'Action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'You create three glowing darts of magical force. Each dart strikes a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.\n\nUsing a Higher-Level Spell Slot. The spell creates one more dart for each spell slot level above 1.' },
  'Shield': { name: 'Shield', level: 1, school: 'Abjuration', castingTime: 'Reaction, which you take when you are hit by an attack roll or targeted by the Magic Missile spell', range: 'Self', components: 'V, S', duration: '1 round', description: 'An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.' },
  'Sleep': { name: 'Sleep', level: 1, school: 'Enchantment', castingTime: 'Action', range: '60 feet', components: 'V, S, M (a pinch of sand or rose petals)', duration: 'Concentration, up to 1 minute', description: 'Each creature of your choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn, at which point it must repeat the save. If the target fails the second save, the target has the Unconscious condition for the duration. The spell ends on a target if it takes damage or someone within 5 feet of it takes an action to shake it out of the spell\'s effect.\nCreatures that don\'t sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell.' },

  // Level 2 Spells
  'Aid': { name: 'Aid', level: 2, school: 'Abjuration', castingTime: 'Action', range: '30 feet', components: 'V, S, M (a strip of white cloth)', duration: '8 hours', description: 'Choose up to three creatures within range. Each target\'s Hit Point maximum and current Hit Points increase by 5 for the duration.\n\nUsing a Higher-Level Spell Slot. Each target\'s Hit Points increase by 5 for each spell slot level above 2.' },
  'Alter Self': { name: 'Alter Self', level: 2, school: 'Transmutation', castingTime: 'Action', range: 'Self', components: 'V, S', duration: 'Concentration, up to 1 hour', description: 'You alter your physical form. Choose one of the following options. Its effects last for the duration, during which you can take a Magic action to replace the option you chose with a different one.\nAquatic Adaptation. You sprout gills and grow webs between your fingers. You can breathe underwater and gain a Swim Speed equal to your Speed.\nChange Appearance. You alter your appearance, including height, weight, facial features, voice, hair, etc. You can appear as a member of another species, but your statistics don\'t change and your basic shape stays the same.\nNatural Weapons. You grow claws (Slashing), fangs (Piercing), horns (Piercing), or hooves (Bludgeoning). When you use your Unarmed Strike, it deals 1d6 damage of that type, and you use your spellcasting ability modifier for the attack and damage rolls rather than Strength.' },
  'Invisibility': { name: 'Invisibility', level: 2, school: 'Illusion', castingTime: 'Action', range: 'Touch', components: 'V, S, M (an eyelash in gum arabic)', duration: 'Concentration, up to 1 hour', description: 'A creature you touch has the Invisible condition until the spell ends. The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.\n\nUsing a Higher-Level Spell Slot. You can target one additional creature for each spell slot level above 2.' },
  'Lesser Restoration': { name: 'Lesser Restoration', level: 2, school: 'Abjuration', castingTime: 'Bonus Action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', description: 'You touch a creature and end one condition on it: Blinded, Deafened, Paralyzed, or Poisoned.' },
  'Misty Step': { name: 'Misty Step', level: 2, school: 'Conjuration', castingTime: 'Bonus Action', range: 'Self', components: 'V', duration: 'Instantaneous', description: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space you can see.' },
  'Spiritual Weapon': { name: 'Spiritual Weapon', level: 2, school: 'Evocation', castingTime: 'Bonus Action', range: '60 feet', components: 'V, S', duration: 'Concentration, up to 1 minute', description: 'You create a floating, spectral force that resembles a weapon of your choice and lasts for the duration.\nThe force appears within range in a space of your choice, and you can immediately make one melee spell attack against one creature within 5 feet of the force. On a hit, the target takes Force damage equal to 1d8 plus your spellcasting ability modifier.\nAs a Bonus Action on your later turns, you can move the force up to 20 feet and repeat the attack against a creature within 5 feet of it.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d8 for every slot level above 2.' },
  'Suggestion': { name: 'Suggestion', level: 2, school: 'Enchantment', castingTime: 'Action', range: '30 feet', components: 'V, M (a drop of honey)', duration: 'Concentration, up to 8 hours', description: 'You suggest a course of activity (no more than 25 words) to one creature you can see that can hear and understand you. The suggestion must sound achievable and not obviously harmful.\nThe target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies deal damage to the target. The Charmed target pursues the suggestion to the best of its ability. The suggested activity can continue for the entire duration, but if it can be completed in a shorter time, the spell ends for the target upon completing it.' },

  // Level 3 Spells
  'Counterspell': { name: 'Counterspell', level: 3, school: 'Abjuration', castingTime: 'Reaction, which you take when you see a creature within 60 feet of yourself casting a spell with Verbal, Somatic, or Material components', range: '60 feet', components: 'S', duration: 'Instantaneous', description: 'You attempt to interrupt a creature in the process of casting a spell. The creature makes a Constitution saving throw. On a failed save, the spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn\'t expended.' },
  'Dispel Magic': { name: 'Dispel Magic', level: 3, school: 'Abjuration', castingTime: 'Action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'Choose one creature, object, or magical effect within range. Any ongoing spell of level 3 or lower on the target ends. For each ongoing spell of level 4 or higher on the target, make an ability check using your spellcasting ability (DC 10 plus that spell\'s level). On a successful check, the spell ends.\n\nUsing a Higher-Level Spell Slot. You automatically end a spell on the target if the spell\'s level is equal to or less than the level of the spell slot you use.' },
  'Fireball': { name: 'Fireball', level: 3, school: 'Evocation', castingTime: 'Action', range: '150 feet', components: 'V, S, M (a ball of bat guano and sulfur)', duration: 'Instantaneous', description: 'A bright streak flashes from you to a point you choose within range and then blossoms with a low roar into a fiery explosion. Each creature in a 20-foot-radius Sphere centered on that point makes a Dexterity saving throw, taking 8d6 Fire damage on a failed save or half as much damage on a successful one.\nFlammable objects in the area that aren\'t being worn or carried start burning.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 3.' },
  'Fly': { name: 'Fly', level: 3, school: 'Transmutation', castingTime: 'Action', range: 'Touch', components: 'V, S, M (a feather)', duration: 'Concentration, up to 10 minutes', description: 'You touch a willing creature. For the duration, the target gains a Fly Speed of 60 feet and can hover. When the spell ends, the target falls if it is still aloft unless it can stop the fall.\n\nUsing a Higher-Level Spell Slot. You can target one additional creature for each spell slot level above 3.' },
  'Haste': { name: 'Haste', level: 3, school: 'Transmutation', castingTime: 'Action', range: '30 feet', components: 'V, S, M (a shaving of licorice root)', duration: 'Concentration, up to 1 minute', description: 'Choose a willing creature that you can see within range. Until the spell ends, the target\'s Speed is doubled, it gains a +2 bonus to Armor Class, it has Advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used to take only the Attack (one attack only), Dash, Disengage, Hide, or Utilize action.\nWhen the spell ends, the target is Incapacitated and has a Speed of 0 until the end of its next turn, as a wave of lethargy washes over it.' },
  'Revivify': { name: 'Revivify', level: 3, school: 'Necromancy', castingTime: 'Action', range: 'Touch', components: 'V, S, M (a diamond worth 300+ GP, which the spell consumes)', duration: 'Instantaneous', description: 'You touch a creature that has died within the last minute. That creature revives with 1 Hit Point. This spell can\'t revive a creature that has died of old age, nor does it restore any missing body parts.' },
  'Spirit Guardians': { name: 'Spirit Guardians', level: 3, school: 'Conjuration', castingTime: 'Action', range: 'Self', components: 'V, S, M (a prayer scroll)', duration: 'Concentration, up to 10 minutes', description: 'Protective spirits flit around you in a 15-foot Emanation for the duration. Their form appears angelic, fey, or fiendish (your choice).\nWhen you cast this spell, you can designate creatures to be unaffected. Any other creature\'s Speed is halved in the Emanation, and whenever the Emanation enters a creature\'s space or a creature enters it or ends its turn there, it must make a Wisdom saving throw. On a failed save, it takes 3d8 Radiant damage (if good/neutral) or 3d8 Necrotic damage (if evil). On a success, it takes half damage.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d8 for each spell slot level above 3.' },
};

const spellsByLevel: Record<string, string[]> = {};
for (const spellName in SPELL_DETAILS) {
    const spell = SPELL_DETAILS[spellName];
    const level = spell.level.toString();
    if (!spellsByLevel[level]) {
        spellsByLevel[level] = [];
    }
    spellsByLevel[level].push(spellName);
}

for (const level in spellsByLevel) {
    spellsByLevel[level].sort();
}
export const SAMPLE_SPELLS_BY_LEVEL = spellsByLevel;
export const SAMPLE_SPELLS = Object.values(spellsByLevel).flat();


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
    'Scribe': { 
        description: 'You spent formative years in a scriptorium or library.', 
        scores: ['DEX', 'INT', 'WIS'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in 3 Skills or Tools.',
        skills: ['Investigation', 'Perception'],
        equipment: ['Calligrapher\'s Supplies', 'Fine Clothes', 'Lamp', 'Parchment (12 sheets)']
    },
    'Soldier': { 
        description: 'You were trained for war.', 
        scores: ['STR', 'DEX', 'CON'], 
        feat: 'Savage Attacker', 
        featDescription: 'Advantage on weapon damage rolls.',
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
    'Bard': ['Bardic Inspiration', 'Spellcasting'],
    'Cleric': ['Spellcasting', 'Divine Order'],
    'Druid': ['Spellcasting', 'Druidic', 'Primal Order'],
    'Fighter': ['Fighting Style', 'Second Wind', 'Weapon Mastery'],
    'Monk': ['Martial Arts', 'Unarmored Defense'],
    'Paladin': ['Lay On Hands', 'Spellcasting', 'Weapon Mastery'],
    'Ranger': ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'],
    'Rogue': ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'],
    'Sorcerer': ['Spellcasting', 'Innate Sorcery'],
    'Warlock': ['Eldritch Invocations', 'Pact Magic'],
    'Wizard': ['Spellcasting', 'Ritual Adept', 'Arcane Recovery']
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Barbarian': { 
        2: ['Reckless Attack', 'Danger Sense'], 
        3: ['Primal Knowledge'],
        5: ['Extra Attack', 'Fast Movement'], 
        7: ['Feral Instinct', 'Instinctive Pounce'],
        9: ['Brutal Strike'],
        11: ['Relentless Rage'],
        13: ['Improved Brutal Strike'],
        15: ['Persistent Rage'],
        18: ['Indomitable Might'],
        20: ['Primal Champion']
    },
    'Bard': { 
        2: ['Expertise', 'Jack of All Trades'], 
        5: ['Font of Inspiration'],
        7: ['Countercharm'],
        10: ['Magical Secrets'],
        18: ['Superior Inspiration'],
        20: ['Words of Creation']
    },
    'Cleric': { 
        2: ['Channel Divinity'],
        5: ['Sear Undead'],
        7: ['Blessed Strikes'],
        10: ['Divine Intervention'],
        14: ['Improved Blessed Strikes'],
        20: ['Greater Divine Intervention']
    },
    'Druid': { 
        2: ['Wild Shape', 'Wild Companion'],
        5: ['Wild Resurgence'],
        7: ['Elemental Fury'],
        15: ['Improved Elemental Fury'],
        18: ['Beast Spells'],
        20: ['Archdruid']
    },
    'Fighter': { 
        2: ['Action Surge', 'Tactical Mind'], 
        5: ['Extra Attack', 'Tactical Shift'], 
        9: ['Indomitable', 'Tactical Master'],
        11: ['Two Extra Attacks'],
        13: ['Studied Attacks'],
        17: ['Action Surge (two uses)', 'Indomitable (three uses)'],
        20: ['Three Extra Attacks']
    },
    'Monk': { 
        2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 
        3: ['Deflect Attacks'],
        4: ['Slow Fall'],
        5: ['Extra Attack', 'Stunning Strike'],
        6: ['Empowered Strikes'],
        7: ['Evasion'],
        9: ['Acrobatic Movement'],
        10: ['Heightened Focus', 'Self-Restoration'],
        13: ['Deflect Energy'],
        14: ['Disciplined Survivor'],
        15: ['Perfect Focus'],
        18: ['Superior Defense'],
        20: ['Body and Mind']
    },
    'Paladin': { 
        2: ['Fighting Style', 'Paladin\'s Smite'], 
        5: ['Extra Attack', 'Faithful Steed'],
        6: ['Aura of Protection'],
        9: ['Abjure Foes'],
        10: ['Aura of Courage'],
        11: ['Radiant Strikes'],
        14: ['Restoring Touch'],
        18: ['Aura Expansion']
    },
    'Ranger': { 
        2: ['Deft Explorer', 'Fighting Style'], 
        5: ['Extra Attack'],
        6: ['Roving'],
        9: ['Expertise'],
        10: ['Tireless'],
        13: ['Relentless Hunter'],
        14: ['Nature\'s Veil'],
        17: ['Precise Hunter'],
        18: ['Feral Senses'],
        20: ['Foe Slayer']
    },
    'Rogue': { 
        2: ['Cunning Action'], 
        3: ['Steady Aim'],
        5: ['Cunning Strike', 'Uncanny Dodge'], 
        6: ['Expertise'],
        7: ['Evasion', 'Reliable Talent'],
        11: ['Improved Cunning Strike'],
        14: ['Devious Strikes'],
        15: ['Slippery Mind'],
        18: ['Elusive'],
        20: ['Stroke of Luck']
    },
    'Sorcerer': { 
        2: ['Font of Magic', 'Metamagic'],
        5: ['Sorcerous Restoration'],
        7: ['Sorcery Incarnate'],
        20: ['Arcane Apotheosis']
    },
    'Warlock': { 
        2: ['Magical Cunning'],
        9: ['Contact Patron'],
        11: ['Mystic Arcanum (level 6)'],
        13: ['Mystic Arcanum (level 7)'],
        15: ['Mystic Arcanum (level 8)'],
        17: ['Mystic Arcanum (level 9)'],
        20: ['Eldritch Master']
    },
    'Wizard': { 
        2: ['Scholar'],
        5: ['Memorize Spell'],
        18: ['Spell Mastery'],
        20: ['Signature Spells']
    }
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
      { name: 'Elven Lineage', description: 'Choose Drow (120ft Darkvision, Dancing Lights), High Elf (Prestidigitation, swap on rest), or Wood Elf (Speed 35, Druidcraft).' },
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
      { name: 'Stonecunning', description: 'Bonus Action to gain Tremorsense (range 60ft) on stone surfaces for 10 minutes.' }
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
      { name: 'Naturally Stealthy', description: 'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.' }
    ] 
  },
  'Dragonborn': { 
    name: 'Dragonborn', 
    description: 'Born of dragons, they walk proudly through a world that greets them with fearful incomprehension.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Breath Weapon', description: 'Exhale energy (Line or Cone) dealing 1d10 damage (scales with level). Replaces an attack.' },
      { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your ancestry (Acid, Fire, Lightning, Poison, or Cold).' },
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Draconic Flight', description: 'At 5th level, you can sprout spectral wings to fly for 10 minutes (Fly Speed = Speed).' }
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
      { name: 'Gnomish Lineage', description: 'Choose Forest (Know Minor Illusion, Speak with Animals) or Rock (Know Mending/Prestidigitation, create tiny clockwork devices).' }
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
    ] 
  },
  'Tiefling': { 
    name: 'Tiefling', 
    description: 'Souls influenced by the Lower Planes, often bearing horns or tails.', 
    size: 'Medium',
    speed: 30,
    traits: [
      { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' },
      { name: 'Fiendish Legacy', description: 'Choose Abyssal (Poison res, Poison Spray), Chthonic (Necrotic res, Chill Touch), or Infernal (Fire res, Fire Bolt).' },
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
      { name: 'Healing Hands', description: 'Magic Action to heal a creature (roll d4s equal to PB). No spell slots required.' },
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
      { name: 'Giant Ancestry', description: 'Choose one: Cloud (Teleport), Fire (Fire Dmg), Frost (Cold Dmg/Slow), Hill (Topple), Stone (Reaction Reduce Dmg), Storm (Reaction Thunder Dmg).' },
      { name: 'Large Form', description: 'Starting at 5th level, you can grow to Large size as a Bonus Action for 10 minutes.' },
      { name: 'Powerful Build', description: 'Advantage on checks to end the Grappled condition. Lift as one size larger.' },
    ] 
  }
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': {
    name: 'Barbarian',
    description: 'A fierce warrior who can enter a battle rage.',
    traits: [
      { name: 'Rage', description: 'Bonus Action to enter. Adv on STR checks/saves, Resistance to B/P/S damage, +Rage Damage to STR attacks.' },
      { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + CON mod when not wearing armor.' },
      { name: 'Weapon Mastery', description: 'Unlock special properties (Cleave, Topple) on your chosen weapons.' }
    ]
  },
  'Bard': {
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    traits: [
      { name: 'Bardic Inspiration', description: 'Bonus Action to give a die (d6) to an ally to boost d20 rolls.' },
      { name: 'Spellcasting', description: 'Cast spells from the Arcane list. Charisma is your casting ability.' }
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
      { name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' },
      { name: 'Druidic', description: 'You know the secret language of Druids.' },
      { name: 'Primal Order', description: 'Choose Magician (Extra Cantrip + Arcana/Nature) or Warden (Medium Armor + Martial Weapons).' }
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
      { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + WIS mod.' }
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
      { name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' },
      { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. Cast it without a slot (limited use).' },
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
      { name: 'Spellcasting', description: 'Cast Arcane spells spontaneously. Charisma is your casting ability.' },
      { name: 'Innate Sorcery', description: 'Bonus Action to activate a rage-like state increasing spell DC and attack advantage.' }
    ]
  },
  'Warlock': {
    name: 'Warlock',
    description: 'A wielder of magic derived from a pact.',
    traits: [
      { name: 'Eldritch Invocations', description: 'Customize your powers with unique magical fragments.' },
      { name: 'Pact Magic', description: 'Spell slots are always max level and recharge on a Short Rest.' }
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
  'Tactical Mind': 'When you fail an ability check, you can expend a use of Second Wind to add 1d10 to the roll.',
  'Ability Score Improvement': 'You can increase one Ability Score by 2, or two Ability Scores by 1. Alternatively, you can take a Feat.',
  'Tactical Shift': 'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.',
  'Primal Knowledge': 'Gain proficiency in another skill. While Raging, use Strength for Acrobatics, Intimidation, Perception, Stealth, or Survival checks.',
  'Instinctive Pounce': 'As part of the Bonus Action to enter Rage, you can move up to half your Speed.',
  'Magical Cunning': 'Perform a 1-minute rite to regain expended Pact Magic spell slots (up to half max). Once per Long Rest.',
  'Memorize Spell': 'Whenever you finish a Short Rest, you can study your spellbook and replace one prepared level 1+ spell.',
  'Scholar': 'You have Expertise in one of the following skills: Arcana, History, Investigation, Medicine, Nature, or Religion.',
  'Metamagic': 'You gain the ability to twist your spells to suit your needs.',
  'Font of Magic': 'You can tap into the wellspring of magic within yourself, represented by Sorcery Points.',
  'Innate Sorcery': 'Bonus Action to increase spell Save DC by 1 and gain Advantage on Sorcerer spell attacks for 1 minute.',
  'Cunning Strike': 'Trade Sneak Attack damage dice for special effects like Poison (1d6), Trip (1d6), or Withdraw (1d6).',
  'Steady Aim': 'Bonus Action to give yourself Advantage on next attack roll. Speed becomes 0.',
  'Roving': 'Speed increases by 10 ft. Gain Climb and Swim speeds equal to Speed.',
  'Tireless': 'Action to gain Temp HP. Reduce Exhaustion on Short Rest.',
  'Nature\'s Veil': 'Bonus Action to become Invisible until the end of your next turn.',
  'Paladin\'s Smite': 'You always have Divine Smite prepared. Cast it once without a spell slot per Long Rest.',
  'Faithful Steed': 'You always have Find Steed prepared. Cast it once without a spell slot per Long Rest.',
  'Abjure Foes': 'Channel Divinity to Frighten foes and restrict their actions.',
  'Monk\'s Focus': 'You have a pool of Focus Points to fuel your monk features.',
  'Deflect Attacks': 'Reaction to reduce damage from melee or ranged attacks. Spend Focus to redirect.',
  'Divine Order': 'Choose Protector (Heavy Armor/Martial Weapons) or Thaumaturge (Extra Cantrip/Skill Bonus).',
  'Sear Undead': 'Turn Undead deals Radiant damage.',
  'Blessed Strikes': 'Choose Divine Strike (extra damage) or Potent Spellcasting (cantrip damage).',
  'Divine Intervention': 'As a Magic Action, cast any Cleric spell of level 5 or lower without a slot.',
  'Magical Secrets': 'Choose prepared spells from the Cleric, Druid, or Wizard spell lists.',
  'Words of Creation': 'You always have Power Word Heal and Power Word Kill prepared.',
  'Primal Order': 'Choose Magician (Extra Cantrip/Skill Bonus) or Warden (Medium Armor/Martial Weapons).',
  'Elemental Fury': 'Choose Potent Spellcasting (cantrip damage) or Primal Strike (weapon elemental damage).',
  'Tactical Master': 'When you attack with a weapon whose mastery property you can use, you can replace that property with Push, Sap, or Slow.',
  'Studied Attacks': 'If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature.',
  'Brutal Strike': 'If you use Reckless Attack, you can forgo Advantage to deal extra 1d10 damage and apply an effect like Forceful Blow or Hamstring Blow.',
  'Relentless Hunter': 'Taking damage can\'t break your Concentration on Hunter\'s Mark.',
  'Deflect Energy': 'You can now use Deflect Attacks against attacks that deal any damage type, not just B/P/S.',
  'Contact Patron': 'You always have Contact Other Plane prepared and can cast it without a slot once per Long Rest (success guaranteed).',
  'Mystic Arcanum': 'Choose a high-level spell (6th, 7th, 8th, or 9th) to cast once per Long Rest without a slot.',
  'Eldritch Master': 'When you use Magical Cunning, you regain all expended Pact Magic spell slots.'
};

export interface SubclassData {
  name: string;
  description: string;
  features: Record<number, Trait[]>;
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
    { name: 'Warrior of Mercy', description: 'Manipulate life force to heal or harm.', features: { 3: [{ name: 'Hand of Harm', description: 'Deal extra Necrotic damage.' }, { name: 'Hand of Healing', description: 'Heal creature with Focus Point.' }] } },
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
    { name: 'Archfey Patron', description: 'A pact with a lord or lady of the Feywild.', features: { 3: [{ name: 'Steps of the Fey', description: 'Misty Step uses. Teleport effects.' }] } },
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

export const MASTERY_DESCRIPTIONS: Record<string, string> = {
  'Cleave': 'If you hit a creature, you can make a second attack against a different creature within 5 feet of it.',
  'Graze': 'If you miss a creature, you deal damage equal to the ability modifier you used for the attack.',
  'Nick': 'When you make the extra attack of the Light property, you can make it as part of the Attack action.',
  'Push': 'If you hit a creature, you can push it 10 feet away from you.',
  'Sap': 'If you hit a creature, it has Disadvantage on its next attack roll before the start of your next turn.',
  'Slow': 'If you hit a creature, its Speed is reduced by 10 feet until the start of your next turn.',
  'Topple': 'If you hit a creature, you can force it to make a Constitution save or fall Prone.',
  'Vex': 'If you hit a creature and deal damage, you have Advantage on your next attack roll against it.',
  '-': 'No mastery property.'
};

export const ALL_WEAPONS: Record<string, Weapon> = {
    // Simple Melee
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
    
    // Simple Ranged
    'Dart': { name: 'Dart', damage: '1d4', type: 'Piercing', properties: ['Finesse', 'Thrown (20/60)'], mastery: 'Vex', equipped: false },
    'Light Crossbow': { name: 'Light Crossbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition (80/320)', 'Loading', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Shortbow': { name: 'Shortbow', damage: '1d6', type: 'Piercing', properties: ['Ammunition (80/320)', 'Two-Handed'], mastery: 'Vex', equipped: false },
    'Sling': { name: 'Sling', damage: '1d4', type: 'Bludgeoning', properties: ['Ammunition (30/120)'], mastery: 'Slow', equipped: false },
    
    // Martial Melee
    'Battleaxe': { name: 'Battleaxe', damage: '1d8', type: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Topple', equipped: false },
    'Flail': { name: 'Flail', damage: '1d8', type: 'Bludgeoning', properties: [], mastery: 'Sap', equipped: false },
    'Glaive': { name: 'Glaive', damage: '1d10', type: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze', equipped: false },
    'Greataxe': { name: 'Greataxe', damage: '1d12', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', equipped: false },
    'Greatsword': { name: 'Greatsword', damage: '2d6', type: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', equipped: false },
    'Halberd': { name: 'Halberd', damage: '1d10', type: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave', equipped: false },
    'Lance': { name: 'Lance', damage: '1d12', type: 'Piercing', properties: ['Reach', 'Two-Handed'], mastery: 'Topple', equipped: false },
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
    
    // Martial Ranged
    'Blowgun': { name: 'Blowgun', damage: '1', type: 'Piercing', properties: ['Ammunition (25/100)', 'Loading'], mastery: 'Vex', equipped: false },
    'Hand Crossbow': { name: 'Hand Crossbow', damage: '1d6', type: 'Piercing', properties: ['Ammunition (30/120)', 'Light', 'Loading'], mastery: 'Vex', equipped: false },
    'Heavy Crossbow': { name: 'Heavy Crossbow', damage: '1d10', type: 'Piercing', properties: ['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push', equipped: false },
    'Longbow': { name: 'Longbow', damage: '1d8', type: 'Piercing', properties: ['Ammunition (150/600)', 'Heavy', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Musket': { name: 'Musket', damage: '1d12', type: 'Piercing', properties: ['Ammunition (40/120)', 'Loading', 'Two-Handed'], mastery: 'Slow', equipped: false },
    'Pistol': { name: 'Pistol', damage: '1d10', type: 'Piercing', properties: ['Ammunition (30/90)', 'Loading'], mastery: 'Vex', equipped: false },
    
    // Special
    'Unarmed Strike': { name: 'Unarmed Strike', damage: '1', type: 'Bludgeoning', properties: [], mastery: '-', equipped: true },
    'Shield': { name: 'Shield', damage: '--', type: 'Armor', properties: ['+2 AC'], mastery: '-', equipped: false }
};

export interface Armor {
    baseAC: number;
    maxDex?: number; // undefined means unlimited
    stealthDisadvantage: boolean;
    strengthReq: number;
    type: 'Light' | 'Medium' | 'Heavy' | 'Shield';
}

export const ARMOR_OPTIONS: Record<string, Armor> = {
    'Padded': { baseAC: 11, type: 'Light', stealthDisadvantage: true, strengthReq: 0 },
    'Leather': { baseAC: 11, type: 'Light', stealthDisadvantage: false, strengthReq: 0 },
    'Studded Leather': { baseAC: 12, type: 'Light', stealthDisadvantage: false, strengthReq: 0 },
    'Hide': { baseAC: 12, maxDex: 2, type: 'Medium', stealthDisadvantage: false, strengthReq: 0 },
    'Chain Shirt': { baseAC: 13, maxDex: 2, type: 'Medium', stealthDisadvantage: false, strengthReq: 0 },
    'Scale Mail': { baseAC: 14, maxDex: 2, type: 'Medium', stealthDisadvantage: true, strengthReq: 0 },
    'Breastplate': { baseAC: 14, maxDex: 2, type: 'Medium', stealthDisadvantage: false, strengthReq: 0 },
    'Half Plate': { baseAC: 15, maxDex: 2, type: 'Medium', stealthDisadvantage: true, strengthReq: 0 },
    'Ring Mail': { baseAC: 14, maxDex: 0, type: 'Heavy', stealthDisadvantage: true, strengthReq: 0 },
    'Chain Mail': { baseAC: 16, maxDex: 0, type: 'Heavy', stealthDisadvantage: true, strengthReq: 13 },
    'Splint': { baseAC: 17, maxDex: 0, type: 'Heavy', stealthDisadvantage: true, strengthReq: 15 },
    'Plate': { baseAC: 18, maxDex: 0, type: 'Heavy', stealthDisadvantage: true, strengthReq: 15 },
    'Shield': { baseAC: 2, type: 'Shield', stealthDisadvantage: false, strengthReq: 0 }
};

export const FEAT_OPTIONS: { name: string, description: string }[] = [
    { name: 'Ability Score Improvement', description: 'Increase one Ability Score by 2, or two Ability Scores by 1.' },
    { name: 'Actor', description: 'Increase CHA. Advantage on Deception/Performance to mimic.' },
    { name: 'Alert', description: 'Add PB to Initiative. Swap initiative with willing ally.' },
    { name: 'Athlete', description: 'Increase STR/DEX. Stand up with 5ft movement. Climb faster.' },
    { name: 'Charger', description: 'Increase STR/DEX. Improved Dash or Push attacks.' },
    { name: 'Crafter', description: 'Discount on nonmagical items. Fast crafting.' },
    { name: 'Crossbow Expert', description: 'Increase DEX. Ignore Loading. Fire in melee without disadvantage.' },
    { name: 'Defensive Duelist', description: 'Increase DEX. Use Reaction to add PB to AC.' },
    { name: 'Dual Wielder', description: 'Increase STR/DEX. Two-Weapon Fighting with non-Light weapons.' },
    { name: 'Durable', description: 'Increase CON. Advantage on Death Saves. Hit Die healing improved.' },
    { name: 'Elementalist', description: 'Increase INT/WIS/CHA. Spells ignore resistance to an elemental type.' },
    { name: 'Great Weapon Master', description: 'Increase STR. On Crit/Kill, bonus action attack. Add PB to damage.' },
    { name: 'Healer', description: 'Increase WIS. Reroll 1s on healing spells. Med kit usage improved.' },
    { name: 'Heavily Armored', description: 'Increase STR/CON. Gain Heavy Armor proficiency.' },
    { name: 'Heavy Armor Master', description: 'Increase STR/CON. Reduce incoming non-magical damage by PB.' },
    { name: 'Inspiring Leader', description: 'Increase WIS/CHA. Grant Temp HP to allies after rest.' },
    { name: 'Keen Mind', description: 'Increase INT. Expertise in one INT skill.' },
    { name: 'Lightly Armored', description: 'Increase STR/DEX. Gain Light/Medium Armor and Shield proficiency.' },
    { name: 'Lucky', description: 'Gain Luck Points to grant Advantage or impose Disadvantage.' },
    { name: 'Mage Slayer', description: 'Increase STR/DEX. Reaction to attack caster. Adv on saves vs spells.' },
    { name: 'Magic Initiate', description: 'Learn 2 Cantrips and 1 Level 1 Spell from a class list.' },
    { name: 'Martial Weapon Training', description: 'Increase STR/DEX. Proficiency in Martial Weapons.' },
    { name: 'Medium Armor Master', description: 'Increase STR/DEX. Ignore Max Dex 2 limit on Medium Armor.' },
    { name: 'Mobile', description: 'Increase DEX/STR. Speed +10ft. Dash ignores difficult terrain.' },
    { name: 'Moderately Armored', description: 'Increase STR/DEX. Medium Armor and Shield proficiency.' },
    { name: 'Mounted Combatant', description: 'Increase STR/WIS. Advantage on attacks vs smaller creatures while mounted.' },
    { name: 'Musician', description: 'Increase STR/DEX/CHA. Grant Heroic Inspiration to allies after rest.' },
    { name: 'Observant', description: 'Increase INT/WIS. Expertise in Investigation, Perception, or Insight.' },
    { name: 'Polearm Master', description: 'Increase STR/DEX. Bonus action attack with butt end. Opportunity attack on entry.' },
    { name: 'Resilient', description: 'Increase one score. Gain proficiency in saves for that score.' },
    { name: 'Ritual Caster', description: 'Increase INT/WIS/CHA. Can cast ritual spells.' },
    { name: 'Savage Attacker', description: 'Increase STR/DEX. Advantage on weapon damage rolls.' },
    { name: 'Sentinel', description: 'Increase STR/DEX. Opportunity attacks stop movement. Reaction attack if ally hit.' },
    { name: 'Sharpshooter', description: 'Increase DEX. Ignore cover. Fire at long range without disadvantage.' },
    { name: 'Shield Master', description: 'Increase STR. Bash as bonus action. Add shield AC to DEX saves.' },
    { name: 'Skilled', description: 'Gain proficiency in 3 Skills or Tools.' },
    { name: 'Skulker', description: 'Increase DEX. Hide when lightly obscured. Missed hidden attacks don\'t reveal.' },
    { name: 'Speedy', description: 'Increase DEX/CON. Speed +10ft. Dash ignores difficult terrain.' },
    { name: 'Spell Sniper', description: 'Increase INT/WIS/CHA. Ignore cover. Spell range doubled.' },
    { name: 'Tavern Brawler', description: 'Increase STR/CON. Unarmed damage 1d4. Grapple as bonus action.' },
    { name: 'Tough', description: 'HP max increases by 2 per level.' },
    { name: 'War Caster', description: 'Increase INT/WIS/CHA. Advantage on CON saves. Cast spell as Opportunity Attack.' },
    { name: 'Weapon Master', description: 'Increase STR/DEX. Proficiency with 4 weapons. Unlock mastery.' },
];

export const getLevelData = (className: string, level: number): { features: string[], asi: boolean, subclass: boolean } => {
    const progression = CLASS_PROGRESSION[className] || {};
    const features = progression[level] || [];
    
    // Check for ASI (Levels 4, 8, 12, 16, 19 + Fighter/Rogue extras)
    let asi = [4, 8, 12, 16, 19].includes(level);
    if (className === 'Fighter' && [6, 14].includes(level)) asi = true;
    if (className === 'Rogue' && level === 10) asi = true;

    // Check for Subclass (Standard is 3, but some might differ in 2024, generally 3 across board now)
    const subclass = level === 3;

    return { features, asi, subclass };
};
// FIX: Removed extraneous text that was causing parsing errors.
