
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Character, Ability, Weapon, Skill, Note } from '../types';
import { Shield, Heart, Zap, Scroll, Swords, Backpack, ArrowLeft, BotMessageSquare, Sparkles, BookOpen, X, User, MessageCircle, Plus, Trash2, Settings, AlertCircle, ChevronsUp, Crown, ArrowRight, Check, Flame, Minus, RefreshCw, Dna, Star, GraduationCap, Skull, ChevronDown, PenSquare, Notebook } from 'lucide-react';
import { askDndRules } from '../services/geminiService';
import { 
    MASTERY_DESCRIPTIONS, ALL_WEAPONS, ARMOR_OPTIONS, HIT_DIE, getLevelData, SUBCLASS_OPTIONS, 
    FEAT_OPTIONS, ABILITY_NAMES, GENERIC_FEATURES, SPECIES_DETAILS, CLASS_DETAILS, BACKGROUNDS_DATA, 
    SKILL_LIST, SKILL_ABILITY_MAP, CLASS_SAVING_THROWS, SPELLCASTING_ABILITY, 
    CASTER_TYPE, MAX_SPELL_LEVEL, SPELL_DETAILS, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, 
    SPELLS_KNOWN_BY_LEVEL, PREPARED_CASTERS 
} from '../constants';

interface CharacterSheetProps {
    character: Character;
    onBack: () => void;
    onCharacterUpdate: (char: Character) => void;
}

type TabType = 'main' | 'combat' | 'spells' | 'inventory';
const TABS: TabType[] = ['main', 'combat', 'spells', 'inventory'];

interface FeatureItem {
    name: string;
    description: string;
    source: 'Class' | 'Species' | 'Background' | 'Feat' | 'General';
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack, onCharacterUpdate }) => {
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
    const [showAiModal, setShowAiModal] = useState(false);
    
    // Weapon & Armor State management
    const [activeWeapons, setActiveWeapons] = useState<Weapon[]>(character.weapons || []);
    const [currentAC, setCurrentAC] = useState(character.armorClass);
    const [equippedArmorName, setEquippedArmorName] = useState<string>('Unarmored');
    
    // Modals
    const [showWeaponModal, setShowWeaponModal] = useState(false);
    const [showArmorModal, setShowArmorModal] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showHpModal, setShowHpModal] = useState(false);
    const [showSpellModal, setShowSpellModal] = useState(false);
    const [viewingSpell, setViewingSpell] = useState<string | null>(null);
    const [expandedSpellInModal, setExpandedSpellInModal] = useState<string | null>(null);
    const [hpInput, setHpInput] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [spellSearchTerm, setSpellSearchTerm] = useState('');
    const [customSpellName, setCustomSpellName] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    // Level Up State (Wizard)
    const [levelUpStep, setLevelUpStep] = useState(1);
    const [hpIncreaseMode, setHpIncreaseMode] = useState<'fixed' | 'manual'>('fixed');
    const [manualHpInput, setManualHpInput] = useState<number>(0);
    const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);
    const [improvementType, setImprovementType] = useState<'asi' | 'feat' | null>(null);
    const [selectedFeat, setSelectedFeat] = useState<string | null>(null);
    const [asiSelection, setAsiSelection] = useState<{ type: '+2' | '+1+1', score1: Ability | '', score2: Ability | '' }>({ type: '+2', score1: '', score2: '' });

    // AI State
    const [ruleQuery, setRuleQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAskingAi, setIsAskingAi] = useState(false);
    const aiInputRef = useRef<HTMLInputElement>(null);
    const hpInputRef = useRef<HTMLInputElement>(null);

    // Swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

    // Update character prop if parent changes
    useEffect(() => {
        setActiveWeapons(character.weapons || []);
        setCurrentAC(character.armorClass);
    }, [character]);

    // Focus HP input when modal opens
    useEffect(() => {
        if (showHpModal && hpInputRef.current) {
            setTimeout(() => hpInputRef.current?.focus(), 100);
        }
    }, [showHpModal]);
    
    useEffect(() => {
        if (!showSpellModal) {
            setExpandedSpellInModal(null);
            setSpellSearchTerm('');
        }
    }, [showSpellModal]);


    // Reset Level Up wizard on close
    useEffect(() => {
        if (!showLevelUpModal) {
            setLevelUpStep(1);
            setHpIncreaseMode('fixed');
            setManualHpInput(0);
            setSelectedSubclass(null);
            setImprovementType(null);
            setSelectedFeat(null);
            setAsiSelection({ type: '+2', score1: '', score2: '' });
        }
    }, [showLevelUpModal]);

    // Derived Logic for Level Up
    const nextLevel = character.level + 1;
    const hitDie = HIT_DIE[character.class] || 8;
    const conMod = getModifier(character.abilityScores.CON);
    const fixedHpIncrease = Math.max(1, (hitDie / 2) + 1 + conMod);
    const manualHpTotal = Math.max(1, manualHpInput + conMod);
    const nextPB = Math.ceil(nextLevel / 4) + 1;
    
    // Level Up Data Lookup
    const levelData = getLevelData(character.class, nextLevel);
    const needsSubclass = levelData.subclass && !character.features.some(f => f.startsWith('Subclass:')); // Simple check
    const needsAsi = levelData.asi;

    const getCharacterSubclass = (char: Character): string | undefined => {
        const entry = char.features.find(f => f.startsWith("Subclass: "));
        return entry ? entry.replace("Subclass: ", "") : undefined;
    };

    // Helper to find feature description for Level Up preview
    const getFeatureDescription = (featureName: string) => {
        if (GENERIC_FEATURES[featureName]) return GENERIC_FEATURES[featureName];
        const classTraits = CLASS_DETAILS[character.class]?.traits || [];
        const classTrait = classTraits.find(t => t.name === featureName);
        if (classTrait) return classTrait.description;
        const speciesTraits = SPECIES_DETAILS[character.species]?.traits || [];
        const speciesTrait = speciesTraits.find(t => t.name === featureName);
        if (speciesTrait) return speciesTrait.description;
        const feat = FEAT_OPTIONS.find(f => f.name === featureName);
        if (feat) return feat.description;
        return undefined;
    };

    // --- Spellcasting Calculations ---
    const spellcastingAbility = useMemo(() => SPELLCASTING_ABILITY[character.class], [character.class]);
    const spellcastingModifier = useMemo(() => {
        if (!spellcastingAbility) return 0;
        return getModifier(character.abilityScores[spellcastingAbility]);
    }, [character.abilityScores, spellcastingAbility]);

    const spellSaveDC = useMemo(() => {
        if (!spellcastingAbility) return null;
        return 8 + character.proficiencyBonus + spellcastingModifier;
    }, [character.proficiencyBonus, spellcastingModifier, spellcastingAbility]);

    const spellAttackBonus = useMemo(() => {
        if (!spellcastingAbility) return null;
        return character.proficiencyBonus + spellcastingModifier;
    }, [character.proficiencyBonus, spellcastingModifier, spellcastingAbility]);
    
    const casterType = useMemo(() => CASTER_TYPE[character.class], [character.class]);
    const maxSpellLevel = useMemo(() => {
        if (casterType === 'none' || !casterType) return 0;
        return MAX_SPELL_LEVEL[casterType][character.level] || 0;
    }, [casterType, character.level]);

    const knownSpellsByLevel = useMemo(() => {
        const grouped: Record<string, string[]> = {};
        if (!character.spellcasting?.known) return grouped;

        for (const spellName of character.spellcasting.known) {
            const detail = SPELL_DETAILS[spellName];
            if (detail) {
                const level = detail.level.toString();
                if (!grouped[level]) {
                    grouped[level] = [];
                }
                grouped[level].push(spellName);
            } else { // Handle custom spells
                 if (!grouped['custom']) {
                     grouped['custom'] = [];
                 }
                 grouped['custom'].push(spellName);
            }
        }
        return grouped;
    }, [character.spellcasting?.known]);

    const maxCantrips = useMemo(() => {
        const cantripMap = CANTRIPS_KNOWN_BY_LEVEL[character.class];
        if (!cantripMap) return 0;
        const applicableLevel = Object.keys(cantripMap)
            .map(Number)
            .sort((a, b) => b - a)
            .find(lvl => lvl <= character.level);
        return applicableLevel ? cantripMap[applicableLevel] : 0;
    }, [character.class, character.level]);

    const maxLeveledSpells = useMemo(() => {
        if (PREPARED_CASTERS.includes(character.class)) {
            return Math.max(1, character.level + spellcastingModifier);
        }
        const spellsMap = SPELLS_KNOWN_BY_LEVEL[character.class];
        if (!spellsMap) return 0;
        return spellsMap[character.level] || 0;
    }, [character.class, character.level, spellcastingModifier]);

    const currentCantripsCount = useMemo(() => (knownSpellsByLevel['0'] || []).length, [knownSpellsByLevel]);

    const currentLeveledSpellsCount = useMemo(() => {
        return Object.keys(knownSpellsByLevel)
            .filter(level => level !== '0' && level !== 'custom')
            .reduce((total, level) => total + knownSpellsByLevel[level].length, 0);
    }, [knownSpellsByLevel]);
    
    const availableSpellsForModal = useMemo(() => {
        const classSpellList = SPELL_LIST_BY_CLASS[character.class];
        if (!classSpellList) return {};

        const filteredAndGrouped = Object.values(SPELL_DETAILS)
            .filter(spell => 
                classSpellList.includes(spell.name) &&
                spell.level <= maxSpellLevel &&
                spell.name.toLowerCase().includes(spellSearchTerm.toLowerCase())
            )
            .reduce((acc, spell) => {
                const levelStr = spell.level.toString();
                if (!acc[levelStr]) {
                    acc[levelStr] = [];
                }
                acc[levelStr].push(spell.name);
                return acc;
            }, {} as Record<string, string[]>);

        // Sort spells within each level
        for (const level in filteredAndGrouped) {
            filteredAndGrouped[level].sort();
        }
        
        return filteredAndGrouped;
    }, [character.class, maxSpellLevel, spellSearchTerm]);

    // --- FEATURE RESOLUTION LOGIC ---
    const groupedFeatures = useMemo(() => {
        const groups: Record<string, FeatureItem[]> = { 'Class': [], 'Species': [], 'Feat': [], 'Background': [], 'General': [] };
        const currentSpeciesTraits = SPECIES_DETAILS[character.species]?.traits || [];
        const currentClassTraits = CLASS_DETAILS[character.class]?.traits || [];
        const currentBackground = BACKGROUNDS_DATA[character.background];

        character.features.forEach(featName => {
            let item: FeatureItem = { name: featName, description: '', source: 'General' };
            let found = false;

            const speciesMatch = currentSpeciesTraits.find(t => t.name === featName);
            if (speciesMatch) {
                item = { name: featName, description: speciesMatch.description, source: 'Species' };
                groups['Species'].push(item);
                found = true;
            }

            if (!found) {
                const classMatch = currentClassTraits.find(t => t.name === featName);
                if (classMatch) {
                    item = { name: featName, description: classMatch.description, source: 'Class' };
                    groups['Class'].push(item);
                    found = true;
                }
            }

            if (!found) {
                if (featName.startsWith('Subclass: ')) {
                    const scName = featName.replace('Subclass: ', '');
                    const scData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === scName);
                    item = { name: scName, description: scData?.description || 'Your chosen path.', source: 'Class' };
                    groups['Class'].push(item);
                    found = true;
                } else {
                    const mySubclass = getCharacterSubclass(character);
                    if (mySubclass) {
                         const subData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === mySubclass);
                         if (subData) {
                             for (const lvl in subData.features) {
                                 const f = subData.features[lvl].find(sf => sf.name === featName);
                                 if (f) {
                                     item = { name: featName, description: f.description, source: 'Class' };
                                     groups['Class'].push(item);
                                     found = true;
                                     break;
                                 }
                             }
                         }
                    }
                }
            }

            if (!found) {
                if (featName.startsWith('Feat: ')) {
                    const cleanName = featName.replace('Feat: ', '');
                    const fData = FEAT_OPTIONS.find(f => f.name === cleanName);
                    item = { name: cleanName, description: fData?.description || 'A special feat.', source: 'Feat' };
                    groups['Feat'].push(item);
                    found = true;
                } else if (featName === character.originFeat) {
                    const fData = FEAT_OPTIONS.find(f => f.name === featName);
                    item = { name: featName, description: fData?.description || currentBackground?.featDescription || '', source: 'Feat' };
                    groups['Feat'].push(item);
                    found = true;
                }
            }
            
            if (!found && featName === character.background) {
                 item = { name: featName, description: currentBackground?.description || '', source: 'Background' };
                 groups['Background'].push(item);
                 found = true;
            }

            if (!found) {
                const genericDesc = GENERIC_FEATURES[featName];
                if (genericDesc) {
                    item = { name: featName, description: genericDesc, source: 'Class' };
                    groups['Class'].push(item);
                } else {
                    item = { name: featName, description: 'Consult your rules for details.', source: 'General' };
                    groups['General'].push(item);
                }
            }
        });

        currentSpeciesTraits.forEach(trait => {
            if (!groups['Species'].some(i => i.name === trait.name)) {
                groups['Species'].push({ name: trait.name, description: trait.description, source: 'Species' });
            }
        });

        if (character.originFeat && !groups['Feat'].some(i => i.name === character.originFeat)) {
             const fData = FEAT_OPTIONS.find(f => f.name === character.originFeat);
             groups['Feat'].push({ 
                 name: character.originFeat, 
                 description: fData?.description || currentBackground?.featDescription || '', 
                 source: 'Feat' 
             });
        }

        return groups;
    }, [character]);

    const handleDeleteEquipment = (indexToRemove: number) => {
        const newEquipment = character.equipment.filter((_, index) => index !== indexToRemove);
        onCharacterUpdate({ ...character, equipment: newEquipment });
    };

    const handleSaveNote = (noteToSave: { title: string, content: string }) => {
        let newNotes: Note[];
        if (editingNote) { // Editing existing note
            newNotes = character.notes.map(n => 
                n.id === editingNote.id ? { ...n, ...noteToSave } : n
            );
        } else { // Adding new note
            const newNote: Note = {
                id: crypto.randomUUID(),
                title: noteToSave.title || 'Untitled Note',
                content: noteToSave.content
            };
            newNotes = [...(character.notes || []), newNote];
        }
        onCharacterUpdate({ ...character, notes: newNotes });
        setShowNoteModal(false);
        setEditingNote(null);
    };

    const handleDeleteNote = (noteId: string) => {
        const newNotes = (character.notes || []).filter(n => n.id !== noteId);
        onCharacterUpdate({ ...character, notes: newNotes });
    };

    const calculateAutoAC = (charClass: string, stats: Record<Ability, number>, armorName: string, weapons: Weapon[]) => {
        const hasShield = weapons.some(w => w.name === 'Shield') || armorName.includes('Shield');
        let baseArmorName = armorName.replace(' + Shield', '').trim();
        
        if (!ARMOR_OPTIONS[baseArmorName] && baseArmorName !== 'Unarmored') {
            baseArmorName = 'Unarmored';
        }

        const dexMod = getModifier(stats.DEX);
        const conMod = getModifier(stats.CON);
        const wisMod = getModifier(stats.WIS);
        
        let ac = 10 + dexMod; // Default fallback

        const armorData = ARMOR_OPTIONS[baseArmorName];

        if (baseArmorName === 'Unarmored') {
            if (charClass === 'Barbarian') {
                ac = 10 + dexMod + conMod;
                if (hasShield) ac += 2;
            } else if (charClass === 'Monk') {
                ac = hasShield ? 10 + dexMod + 2 : 10 + dexMod + wisMod;
            } else {
                ac = 10 + dexMod;
                if (hasShield) ac += 2;
            }
        } else if (armorData) {
            let effectiveDex = dexMod;
            if (armorData.maxDex !== undefined) {
                effectiveDex = Math.min(dexMod, armorData.maxDex);
            }
            ac = armorData.baseAC + effectiveDex;
            if (hasShield) ac += 2;
        }

        return ac;
    };

    const updateFocusPoints = (newValue: number) => {
        const max = character.level;
        const clamped = Math.max(0, Math.min(newValue, max));
        onCharacterUpdate({ ...character, currentFocusPoints: clamped });
    };

    const handleHpChange = (type: 'heal' | 'damage') => {
        const amount = parseInt(hpInput);
        if (isNaN(amount) || amount <= 0) return;
        let newHp = character.currentHp;
        newHp = type === 'heal' ? Math.min(character.maxHp, newHp + amount) : Math.max(0, newHp - amount);
        onCharacterUpdate({ ...character, currentHp: newHp });
        setHpInput('');
        setShowHpModal(false);
    };

    const getMartialArtsDie = (level: number) => {
        if (level >= 17) return '1d12';
        if (level >= 11) return '1d10';
        if (level >= 5) return '1d8';
        return '1d6';
    };

    const handleLevelUpConfirm = () => {
        let newScores = { ...character.abilityScores };
        if (needsAsi && improvementType === 'asi') {
            if (asiSelection.type === '+2' && asiSelection.score1) {
                newScores[asiSelection.score1 as Ability] += 2;
            } else if (asiSelection.type === '+1+1' && asiSelection.score1 && asiSelection.score2) {
                newScores[asiSelection.score1 as Ability] += 1;
                newScores[asiSelection.score2 as Ability] += 1;
            }
        }
        
        const newConMod = getModifier(newScores.CON);
        const newDexMod = getModifier(newScores.DEX);

        const finalHpGain = hpIncreaseMode === 'fixed' 
            ? Math.max(1, (hitDie / 2) + 1 + newConMod)
            : Math.max(1, manualHpInput + newConMod);

        const newAC = calculateAutoAC(character.class, newScores, equippedArmorName, activeWeapons);
        
        let newFeatures = [...character.features, ...levelData.features];
        if (needsAsi && improvementType === 'feat' && selectedFeat) newFeatures.push(`Feat: ${selectedFeat}`);

        let activeSubclass = getCharacterSubclass(character);
        if (selectedSubclass) {
            newFeatures.push(`Subclass: ${selectedSubclass}`);
            activeSubclass = selectedSubclass;
        }

        if (activeSubclass) {
            const subData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === activeSubclass);
            if (subData && subData.features[nextLevel]) {
                const subFeatures = subData.features[nextLevel].map(f => f.name);
                newFeatures = [...newFeatures, ...subFeatures];
            }
        }

        const updatedChar: Character = {
            ...character,
            level: nextLevel,
            maxHp: character.maxHp + finalHpGain,
            currentHp: character.currentHp + finalHpGain,
            proficiencyBonus: nextPB,
            features: newFeatures,
            abilityScores: newScores,
            weapons: activeWeapons, 
            armorClass: newAC,
            initiative: newDexMod,
            currentFocusPoints: character.class === 'Monk' ? nextLevel : undefined
        };
        onCharacterUpdate(updatedChar);
        setShowLevelUpModal(false);
    };

    const handleAddWeapon = (weaponKey: string) => {
        const weaponData = ALL_WEAPONS[weaponKey];
        if (weaponData) {
            const newWeapons = [...activeWeapons, { ...weaponData, equipped: true }];
            setActiveWeapons(newWeapons);
            if (weaponKey === 'Shield') setCurrentAC(calculateAutoAC(character.class, character.abilityScores, equippedArmorName, newWeapons));
            setShowWeaponModal(false);
        }
    };

    const handleRemoveWeapon = (index: number) => {
        const weaponToRemove = activeWeapons[index];
        const newWeapons = activeWeapons.filter((_, i) => i !== index);
        setActiveWeapons(newWeapons);
        if (weaponToRemove?.name === 'Shield') setCurrentAC(calculateAutoAC(character.class, character.abilityScores, equippedArmorName, newWeapons));
    };

    const handleEquipArmor = (armorKey: string) => {
        const armor = ARMOR_OPTIONS[armorKey];
        if (!armor) return;
        if (armor.type === 'Shield') {
            if (!activeWeapons.some(w => w.name === 'Shield')) {
                const shieldWeapon = ALL_WEAPONS['Shield'];
                if (shieldWeapon) {
                    const newWeapons = [...activeWeapons, { ...shieldWeapon, equipped: true }];
                    setActiveWeapons(newWeapons);
                    setCurrentAC(calculateAutoAC(character.class, character.abilityScores, equippedArmorName, newWeapons));
                }
            }
        } else {
            setEquippedArmorName(armorKey);
            setCurrentAC(calculateAutoAC(character.class, character.abilityScores, armorKey, activeWeapons));
        }
        setShowArmorModal(false);
    };

    const handleAddSpell = (spellName: string) => {
        const currentSpells = character.spellcasting?.known || [];
        if (!currentSpells.includes(spellName)) {
            const newSpells = [...currentSpells, spellName].sort();
            const currentAbility = character.spellcasting?.ability || spellcastingAbility;
            if (currentAbility) {
                onCharacterUpdate({
                    ...character,
                    spellcasting: { ...(character.spellcasting || { slots: {}, known: [] }), ability: currentAbility, known: newSpells }
                });
            }
        }
        setShowSpellModal(false);
        setCustomSpellName('');
        setSpellSearchTerm('');
    };

    const handleRemoveSpell = (spellName: string) => {
        if (!character.spellcasting) return;
        const newSpells = character.spellcasting.known.filter(s => s !== spellName);
        onCharacterUpdate({ ...character, spellcasting: { ...character.spellcasting, known: newSpells } });
    };

    const filteredWeapons = Object.keys(ALL_WEAPONS).filter(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (showAiModal && aiInputRef.current) setTimeout(() => aiInputRef.current?.focus(), 100);
    }, [showAiModal]);

    const handleAskRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleQuery.trim()) return;
        setIsAskingAi(true);
        setAiResponse(null);
        setAiResponse(await askDndRules(ruleQuery));
        setIsAskingAi(false);
    }

    const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };

    const handleTabChange = (newTab: TabType) => {
        const currentIndex = TABS.indexOf(activeTab);
        const newIndex = TABS.indexOf(newTab);
        if (newIndex === currentIndex) return;
        setTransitionDirection(newIndex > currentIndex ? 'right' : 'left');
        setActiveTab(newTab);
        window.scrollTo(0, 0);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        const currentIndex = TABS.indexOf(activeTab);
        if (isLeftSwipe && currentIndex < TABS.length - 1) handleTabChange(TABS[currentIndex + 1]);
        if (isRightSwipe && currentIndex > 0) handleTabChange(TABS[currentIndex - 1]);
    };

    const resolveWeapon = (w: Weapon): Weapon => {
        if (character.class === 'Monk' && w.name === 'Unarmed Strike') {
            const die = getMartialArtsDie(character.level);
            const mod = Math.max(getModifier(character.abilityScores.DEX), getModifier(character.abilityScores.STR));
            return { ...w, damage: `${die} ${formatMod(mod)}`, properties: [...w.properties, 'Martial Arts'] };
        }
        return w;
    };

    const mainHand = activeWeapons[0] ? resolveWeapon(activeWeapons[0]) : undefined;
    const offHand = activeWeapons[1] ? resolveWeapon(activeWeapons[1]) : undefined;
    const isTwoHanded = mainHand?.properties.some(p => p.includes('Two-Handed'));
    const otherWeapons = activeWeapons.slice(2).map(resolveWeapon);
    const displayArmorName = activeWeapons.some(w => w.name === 'Shield') && !equippedArmorName.includes('Shield') ? `${equippedArmorName} + Shield` : equippedArmorName;
    const animationClass = `animate-in fade-in zoom-in-95 duration-300 ease-out fill-mode-forwards ${transitionDirection === 'right' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'}`;

    const renderFeatureSection = (title: string, icon: React.ReactNode, items: FeatureItem[]) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-6">
                <SectionHeader icon={icon} title={title} />
                <div className="space-y-3">
                    {items.map((feat, idx) => (
                        <div key={idx} className="bg-stone-900/60 p-4 rounded-xl border border-stone-800/50 hover:bg-stone-900/80 transition-colors">
                            <div className="font-bold text-sm text-stone-200 mb-1">{feat.name}</div>
                            <p className="text-stone-500 text-xs leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const allSpellsFull = spellcastingAbility ? (currentCantripsCount >= maxCantrips && currentLeveledSpellsCount >= maxLeveledSpells) : true;

    return (
        <div className="min-h-screen bg-stone-950 font-sans pb-32" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="sticky top-0 z-50 px-4 py-3 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-md">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white rounded-full active:bg-stone-900 transition-colors"><ArrowLeft size={24}/></button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold text-stone-100 tracking-wide">{character.name}</h1>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Lvl {character.level} {character.class}</span>
                    </div>
                    <button onClick={() => setShowAiModal(true)} className="w-10 h-10 flex items-center justify-center text-indigo-400 bg-indigo-950/20 rounded-full border border-indigo-900/30 active:bg-indigo-900/50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"><BotMessageSquare size={22} /></button>
                </div>
            </div>

            <div>
                <div className="px-4 py-4">
                    <div className="flex justify-between items-center bg-stone-900/50 p-4 rounded-2xl border border-stone-800 shadow-lg">
                        <VitalStat label="AC" value={currentAC} icon={<Shield size={16} className="text-stone-500"/>} />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="HP" value={character.currentHp} icon={<Heart size={16} className="text-red-600"/>} onClick={() => setShowHpModal(true)} className="cursor-pointer hover:bg-stone-800/50 rounded-lg -m-1 p-1 transition-colors" />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="INIT" value={formatMod(character.initiative)} icon={<Zap size={16} className="text-amber-600"/>} />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="PROF" value={`+${character.proficiencyBonus}`} icon={<Swords size={16} className="text-stone-500"/>} />
                    </div>
                </div>

                <div className="px-4 py-2 space-y-8 overflow-hidden">
                    {activeTab === 'main' && (
                        <div key="main" className={`space-y-8 ${animationClass}`}>
                            <div className="grid grid-cols-3 gap-3">
                                {(Object.keys(character.abilityScores) as Ability[]).map(ability => (
                                    <div key={ability} className="bg-stone-900/40 border border-stone-800 rounded-xl p-3 flex flex-col items-center justify-between aspect-[4/5] shadow-sm relative overflow-hidden group">
                                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">{ability}</span>
                                        <span className="text-3xl font-serif font-bold text-stone-200 z-10">{formatMod(getModifier(character.abilityScores[ability]))}</span>
                                        <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-xs text-stone-500 font-bold z-10 mb-1">{character.abilityScores[ability]}</div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/50 pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <SectionHeader icon={<Shield size={16}/>} title="Saving Throws" />
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {(Object.keys(character.abilityScores) as Ability[]).map(ability => {
                                        const mod = getModifier(character.abilityScores[ability]);
                                        const isProficient = CLASS_SAVING_THROWS[character.class]?.includes(ability);
                                        const saveValue = mod + (isProficient ? character.proficiencyBonus : 0);
                                        return (
                                            <div key={ability} className={`flex flex-col items-center p-2 rounded-xl border ${isProficient ? 'bg-amber-950/20 border-amber-800/50' : 'bg-stone-950 border-stone-800'}`}>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isProficient ? 'text-amber-500' : 'text-stone-500'}`}>{ability}</span>
                                                <span className={`text-lg font-bold ${isProficient ? 'text-stone-200' : 'text-stone-400'}`}>{formatMod(saveValue)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <SectionHeader icon={<GraduationCap size={16}/>} title="Skills" />
                                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 grid grid-cols-2 gap-x-4 gap-y-2">
                                    {SKILL_LIST.map(skill => {
                                        const ability = SKILL_ABILITY_MAP[skill];
                                        const mod = getModifier(character.abilityScores[ability]);
                                        const isProficient = character.skills.includes(skill);
                                        const total = mod + (isProficient ? character.proficiencyBonus : 0);
                                        return (
                                            <div key={skill} className="flex justify-between items-center text-sm py-1 border-b border-stone-800/50 last:border-0">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProficient ? 'bg-amber-500' : 'bg-stone-700'}`}></div>
                                                    <span className={`truncate ${isProficient ? 'text-stone-200 font-bold' : 'text-stone-500'}`}>{skill}</span>
                                                </div>
                                                <span className={`font-mono text-xs ${isProficient ? 'text-amber-500 font-bold' : 'text-stone-600'}`}>{formatMod(total)}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge>{character.alignment}</Badge>
                                <Badge>{character.size} Size</Badge>
                                <Badge>{character.speed} ft Speed</Badge>
                                {character.languages?.map((l, i) => (<div key={i} className="text-xs font-bold px-3 py-1.5 rounded-lg border text-stone-400 bg-stone-900 border-stone-800 flex items-center gap-1"><MessageCircle size={10} /> {l}</div>))}
                            </div>
                            <SectionHeader icon={<Swords size={16}/>} title="Weapons" />
                            <div className="space-y-4">
                                <div className="relative pl-6"><div className="absolute -left-2 top-3 -rotate-90 text-[10px] font-bold text-stone-600 uppercase tracking-widest origin-center">Main</div>{mainHand ? <WeaponCard weapon={mainHand} onRemove={() => handleRemoveWeapon(0)} /> : <button onClick={() => setShowWeaponModal(true)} className="w-full h-24 border-2 border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-600 hover:text-stone-400 hover:border-stone-600 transition-all bg-stone-900/30"><Plus size={24} className="mb-1"/><span className="text-xs font-bold uppercase">Equip Main Hand</span></button>}</div>
                                <div className="relative pl-6"><div className="absolute -left-2 top-5 -rotate-90 text-[10px] font-bold text-stone-600 uppercase tracking-widest origin-center">Off</div>{isTwoHanded ? <div className="w-full p-4 border border-stone-800/50 bg-stone-950/30 rounded-2xl flex items-center justify-center gap-2 text-stone-600"><AlertCircle size={16}/><span className="text-sm font-medium italic">Occupied by Two-Handed Weapon</span></div> : (offHand ? <WeaponCard weapon={offHand} onRemove={() => handleRemoveWeapon(1)} /> : <button onClick={() => setShowWeaponModal(true)} disabled={!mainHand} className="w-full h-20 border-2 border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-600 hover:text-stone-400 hover:border-stone-600 transition-all bg-stone-900/30 disabled:opacity-50 disabled:cursor-not-allowed"><Plus size={20} className="mb-1"/><span className="text-xs font-bold uppercase">Equip Off-Hand / Shield</span></button>)}</div>
                            </div>
                            {otherWeapons.length > 0 && <div className="pt-4 border-t border-stone-800"><h4 className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-3">Backpack</h4><div className="space-y-3">{otherWeapons.map((wpn, i) => (<WeaponCard key={i + 2} weapon={wpn} onRemove={() => handleRemoveWeapon(i + 2)} />))}</div></div>}
                            {activeWeapons.length >= 2 && <button onClick={() => setShowWeaponModal(true)} className="w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"><Plus size={16}/> Add to Backpack</button>}
                            <SectionHeader icon={<Shield size={16}/>} title="Defense" />
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
                                <div><div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Equipped Armor</div><div className="text-stone-100 font-serif font-bold text-lg">{displayArmorName}</div></div>
                                <div className="flex items-center gap-4"><div className="text-right"><div className="text-2xl font-bold text-stone-100">{currentAC}</div><div className="text-xs text-stone-500 font-bold uppercase">AC</div></div><button onClick={() => setShowArmorModal(true)} className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-all"><Settings size={18} /></button></div>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-700"></div>
                            </div>
                            <button onClick={() => setShowLevelUpModal(true)} className="w-full bg-gradient-to-r from-amber-900/40 to-stone-900 border border-amber-900/50 p-4 rounded-xl flex items-center justify-between group hover:border-amber-500/50 transition-all shadow-lg"><div className="flex items-center gap-3"><div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><ChevronsUp size={24} /></div><div className="text-left"><div className="text-base font-bold text-stone-200">Level Up Available</div><div className="text-sm text-stone-500">Advance to Level {nextLevel}</div></div></div><div className="text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">Begin</div></button>
                        </div>
                    )}
                    {activeTab === 'combat' && (
                        <div key="combat" className={`space-y-6 ${animationClass}`}>
                            {character.class === 'Monk' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <SectionHeader icon={<Flame size={16}/>} title="Class Resources" />
                                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex justify-between items-center">
                                        <div><div className="text-stone-100 font-bold text-lg">Focus Points</div><div className="text-stone-500 text-xs">Monk Level {character.level}</div></div>
                                        <div className="flex items-center gap-3 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
                                            <button onClick={() => updateFocusPoints((character.currentFocusPoints ?? character.level) - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 text-stone-400 hover:text-white active:scale-95 transition-all"><Minus size={16} /></button>
                                            <div className="w-12 text-center"><span className="text-xl font-bold text-amber-500">{character.currentFocusPoints ?? character.level}</span><span className="text-xs text-stone-600 font-bold"> / {character.level}</span></div>
                                            <button onClick={() => updateFocusPoints((character.currentFocusPoints ?? character.level) + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 text-stone-400 hover:text-white active:scale-95 transition-all"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => updateFocusPoints(character.level)} className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs font-bold text-stone-500 hover:text-amber-500 transition-colors"><RefreshCw size={12}/> Reset on Short/Long Rest</button>
                                </div>
                            )}
                            <div>
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar"><Badge>{character.background}</Badge><Badge color="indigo">{character.originFeat}</Badge><Badge color="stone">{character.species}</Badge></div>
                                <div className="space-y-6">{renderFeatureSection(`${character.class} Features`, <Crown size={16}/>, groupedFeatures['Class'])}{renderFeatureSection(`${character.species} Traits`, <Dna size={16}/>, groupedFeatures['Species'])}{renderFeatureSection('Feats & Talents', <Star size={16}/>, groupedFeatures['Feat'])}{renderFeatureSection('Background', <Scroll size={16}/>, groupedFeatures['Background'])}{renderFeatureSection('General', <Sparkles size={16}/>, groupedFeatures['General'])}</div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'inventory' && (
                        <div key="inventory" className={`space-y-6 ${animationClass}`}>
                            <SectionHeader icon={<Backpack size={16}/>} title="Equipment" />
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
                                {character.equipment.map((item, i) => (
                                    <div key={i} className="px-5 py-4 border-b border-stone-800 last:border-0 flex items-center justify-between group hover:bg-stone-800/50 transition-colors">
                                        <span className="text-stone-300 font-medium">{item}</span>
                                        <button 
                                            onClick={() => handleDeleteEquipment(i)}
                                            className="text-stone-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-4 border border-dashed border-stone-700 text-stone-500 rounded-xl hover:bg-stone-900/50 transition-colors text-sm font-medium">+ Add Item</button>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-stone-800">
                                <SectionHeader icon={<Notebook size={16}/>} title="Notes" />
                                <div className="space-y-3">
                                    {(character.notes || []).map(note => (
                                        <NoteCard 
                                            key={note.id} 
                                            note={note} 
                                            onEdit={() => { setEditingNote(note); setShowNoteModal(true); }}
                                            onDelete={() => handleDeleteNote(note.id)}
                                        />
                                    ))}
                                </div>
                                <button 
                                    onClick={() => { setEditingNote(null); setShowNoteModal(true); }}
                                    className="w-full mt-3 py-3 border border-dashed border-stone-700 text-stone-500 rounded-xl hover:bg-stone-900/50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add Note
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'spells' && (
                        <div key="spells" className={`space-y-6 ${animationClass}`}>
                            <SectionHeader icon={<BookOpen size={16}/>} title="Spellcasting" />
                            {spellcastingAbility ? (
                                <div className="grid grid-cols-3 gap-3">
                                    <SpellStatCard label="Ability" value={spellcastingAbility} />
                                    <SpellStatCard label="Save DC" value={spellSaveDC} />
                                    <SpellStatCard label="Attack" value={spellAttackBonus !== null ? formatMod(spellAttackBonus) : null} />
                                </div>
                            ) : null}

                            {spellcastingAbility && (
                                <div className="grid grid-cols-2 gap-3">
                                    <SpellStatCard label="Cantrips Known" value={`${currentCantripsCount} / ${maxCantrips}`} />
                                    <SpellStatCard label={PREPARED_CASTERS.includes(character.class) ? "Spells Prepared" : "Spells Known"} value={`${currentLeveledSpellsCount} / ${maxLeveledSpells}`} />
                                </div>
                            )}

                            {(!character.spellcasting || !character.spellcasting.known || character.spellcasting.known.length === 0) ? (
                                <div className="text-center py-10 bg-stone-900/30 rounded-2xl border border-stone-800 border-dashed">
                                    <BookOpen size={48} className="mx-auto text-stone-700 mb-4" strokeWidth={1} />
                                    <h4 className="text-stone-400 font-serif font-bold text-lg mb-2">{spellcastingAbility ? 'Grimoire is Empty' : 'Not a Spellcaster'}</h4>
                                    <p className="text-stone-600 text-sm max-w-xs mx-auto mb-6">{spellcastingAbility ? 'Add cantrips or leveled spells to begin weaving magic.' : 'This character does not have spellcasting abilities from their class.'}</p>
                                    {spellcastingAbility && <button onClick={() => setShowSpellModal(true)} disabled={allSpellsFull} className="bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-400 border border-indigo-500/30 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-900/30">+ Add First Spell</button>}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.keys(knownSpellsByLevel).sort((a,b) => (a === 'custom' ? 1 : b === 'custom' ? -1 : parseInt(a) - parseInt(b))).map(level => (
                                        <div key={level}>
                                            <h4 className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-2 flex justify-between items-center">
                                                <span>{level === '0' ? 'Cantrips' : level === 'custom' ? 'Custom Spells' : `Level ${level}`}</span>
                                                <span className="font-mono text-stone-600 bg-stone-900 px-1.5 py-0.5 rounded-sm border border-stone-800">{knownSpellsByLevel[level].length}</span>
                                            </h4>
                                            <div className="grid gap-2">
                                                {knownSpellsByLevel[level].map(spell => (
                                                    <button key={spell} onClick={() => setViewingSpell(spell)} className="bg-stone-900 border border-stone-800 p-3 rounded-lg flex justify-between items-center group hover:border-indigo-500/30 transition-colors w-full text-left">
                                                        <span className="text-stone-300 font-medium text-sm">{spell}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveSpell(spell); }} className="text-stone-600 hover:text-red-500 p-1 rounded-md hover:bg-stone-950 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"><Trash2 size={14} /></button>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowSpellModal(true)} disabled={allSpellsFull} className="w-full py-3 border border-dashed border-stone-700 text-stone-500 rounded-xl hover:bg-stone-900/50 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                        <Plus size={16} /> {allSpellsFull ? 'Spellbook Full' : 'Add Spell'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-stone-950/95 backdrop-blur-md border-t border-stone-800 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                <nav className="flex justify-around items-center h-[60px] w-full max-w-lg mx-auto px-2">
                    <NavButton active={activeTab === 'main'} onClick={() => handleTabChange('main')} icon={<User size={22}/>} label="Hero" />
                    <NavButton active={activeTab === 'combat'} onClick={() => handleTabChange('combat')} icon={<Swords size={22}/>} label="Combat" />
                    <NavButton active={activeTab === 'spells'} onClick={() => handleTabChange('spells')} icon={<BookOpen size={22}/>} label="Spells" />
                    <NavButton active={activeTab === 'inventory'} onClick={() => handleTabChange('inventory')} icon={<Backpack size={22}/>} label="Items" />
                </nav>
            </div>
            {viewingSpell && <SpellDetailModal spellName={viewingSpell} onClose={() => setViewingSpell(null)} />}
            {showHpModal && <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4"><div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" onClick={() => setShowHpModal(false)} /><div className="bg-stone-900 w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 p-6"><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-stone-100 text-xl font-serif">Manage Health</h3><button onClick={() => setShowHpModal(false)} className="p-2 hover:bg-stone-800 rounded-full text-stone-500"><X size={24}/></button></div><div className="mb-6"><div className="flex justify-between text-sm mb-2 font-bold"><span className="text-stone-400">Current HP</span><span className="text-stone-200">{character.currentHp} <span className="text-stone-600">/</span> {character.maxHp}</span></div><div className="h-4 bg-stone-800 rounded-full overflow-hidden border border-stone-700"><div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (character.currentHp / character.maxHp) * 100)}%` }}/></div></div><div className="relative mb-6"><input ref={hpInputRef} type="number" pattern="[0-9]*" className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-6 text-center text-4xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-600 placeholder-stone-700" placeholder="0" value={hpInput} onChange={(e) => setHpInput(e.target.value)} /><div className="absolute inset-x-0 bottom-2 text-center text-[10px] text-stone-600 font-bold uppercase tracking-widest pointer-events-none">Amount</div></div><div className="flex gap-3"><button onClick={() => handleHpChange('damage')} className="flex-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/50 text-red-500 py-4 rounded-xl font-bold flex flex-col items-center gap-1 transition-all active:scale-95"><Skull size={24} /><span>Damage</span></button><button onClick={() => handleHpChange('heal')} className="flex-1 bg-green-950/40 hover:bg-green-900/50 border border-green-900/50 text-green-500 py-4 rounded-xl font-bold flex flex-col items-center gap-1 transition-all active:scale-95"><Heart size={24} /><span>Heal</span></button></div></div></div>}
            {showNoteModal && <NoteModal note={editingNote} onClose={() => { setShowNoteModal(false); setEditingNote(null); }} onSave={handleSaveNote} />}
            {showSpellModal && <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"><div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowSpellModal(false)} /><div className="bg-stone-900 w-full max-w-lg h-[85vh] rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95"><div className="p-4 border-b border-stone-800 flex justify-between items-center shrink-0"><h3 className="font-bold text-stone-100 text-lg font-serif">Add Spell</h3><button onClick={() => setShowSpellModal(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20}/></button></div><div className="p-4 border-b border-stone-800 space-y-3 shrink-0"><input type="text" placeholder="Search available spells..." className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={spellSearchTerm} onChange={(e) => setSpellSearchTerm(e.target.value)} /><div className="flex gap-2"><input type="text" placeholder="Or add a custom spell..." className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" value={customSpellName} onChange={(e) => setCustomSpellName(e.target.value)} /><button onClick={() => handleAddSpell(customSpellName)} disabled={!customSpellName.trim()} className="px-4 bg-stone-800 text-stone-200 font-bold rounded-xl border border-stone-700 disabled:opacity-50">Add</button></div></div><div className="overflow-y-auto p-2 custom-scrollbar flex-1">{Object.keys(availableSpellsForModal).length > 0 ? (Object.keys(availableSpellsForModal).sort().map(level => (<div key={level} className="mb-3"><h5 className="px-2 mb-1 text-xs font-bold uppercase text-stone-500 tracking-wider">{level === '0' ? 'Cantrips' : `Level ${level}`}</h5><div className="space-y-1">{availableSpellsForModal[level].map(spell => { const isExpanded = expandedSpellInModal === spell; const spellDetails = SPELL_DETAILS[spell]; const isCantrip = spellDetails?.level === 0; const cantripsFull = isCantrip && currentCantripsCount >= maxCantrips; const leveledSpellsFull = !isCantrip && currentLeveledSpellsCount >= maxLeveledSpells; const alreadyKnown = character.spellcasting?.known.includes(spell); return (<div key={spell} className={`bg-stone-800/50 rounded-lg border border-stone-700/80 overflow-hidden transition-all duration-300`}> <button onClick={() => setExpandedSpellInModal(isExpanded ? null : spell)} className="w-full text-left p-3 flex justify-between items-center group"> <span className="font-medium text-stone-300 group-hover:text-indigo-400">{spell}</span> <ChevronDown size={16} className={`text-stone-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /> </button> {isExpanded && ( <div className="px-4 pb-4 animate-in fade-in duration-300"> <div className="border-t border-stone-700/80 pt-3 space-y-3"> {spellDetails ? <p className="text-xs text-stone-400 italic leading-relaxed">{spellDetails.description.split('\n')[0]}</p> : <p className="text-xs text-stone-500 italic">No details available for this spell.</p>} <button onClick={() => handleAddSpell(spell)} disabled={cantripsFull || leveledSpellsFull || alreadyKnown} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:bg-stone-700 disabled:cursor-not-allowed"> <Plus size={16}/> {alreadyKnown ? 'Known' : (cantripsFull || leveledSpellsFull) ? 'Limit Reached' : 'Add to Grimoire'} </button> </div> </div> )} </div>);})}</div></div>))) : (<div className="p-8 text-center text-stone-500 italic">No matching spells found for your class and level.</div>)}</div></div></div>}
            {showLevelUpModal && <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" onClick={() => setShowLevelUpModal(false)} /><div className="bg-stone-900 w-full max-w-md max-h-[90vh] rounded-2xl border-2 border-amber-600/50 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden"><div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 text-center relative overflow-hidden shrink-0"><Crown className="absolute -right-4 -top-4 text-amber-500/20 w-32 h-32 rotate-12" /><h3 className="font-serif font-bold text-white text-2xl relative z-10">Level Up!</h3><p className="text-amber-100/80 text-sm relative z-10">Advancing to Level {nextLevel}</p><div className="flex justify-center gap-2 mt-4 relative z-10"><div className={`w-2 h-2 rounded-full ${levelUpStep >= 1 ? 'bg-white' : 'bg-white/30'}`} /><div className={`w-2 h-2 rounded-full ${levelUpStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />{(needsSubclass || needsAsi) && (<div className={`w-2 h-2 rounded-full ${levelUpStep >= 3 ? 'bg-white' : 'bg-white/30'}`} />)}<div className={`w-2 h-2 rounded-full ${levelUpStep >= 4 ? 'bg-white' : 'bg-white/30'}`} /></div></div><div className="p-6 overflow-y-auto custom-scrollbar flex-1">{levelUpStep === 1 && <div className="space-y-6 animate-in slide-in-from-right-4"><h4 className="text-xl font-serif font-bold text-stone-200">Vitality & Proficiency</h4><div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800"><label className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-3 block">Hit Points</label><div className="flex bg-stone-950 rounded-xl p-1 border border-stone-800 mb-4"><button onClick={() => setHpIncreaseMode('fixed')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${hpIncreaseMode === 'fixed' ? 'bg-stone-800 text-amber-500 shadow' : 'text-stone-500'}`}>Fixed ({fixedHpIncrease})</button><button onClick={() => setHpIncreaseMode('manual')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${hpIncreaseMode === 'manual' ? 'bg-stone-800 text-amber-500 shadow' : 'text-stone-500'}`}>Manual</button></div>{hpIncreaseMode === 'manual' && (<div className="flex items-center gap-2"><input type="number" min="1" max={hitDie} value={manualHpInput || ''} onChange={(e) => setManualHpInput(parseInt(e.target.value) || 0)} className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-center text-lg font-bold text-white focus:ring-1 focus:ring-amber-600 outline-none" placeholder={`Roll d${hitDie}`} /><span className="font-bold text-stone-500">+ {conMod} (CON)</span></div>)}<div className="text-center text-stone-300 text-sm font-bold mt-2">Total: +{hpIncreaseMode === 'fixed' ? fixedHpIncrease : manualHpTotal} HP</div></div><div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex justify-between items-center"><span className="text-stone-400 text-sm font-bold">Proficiency Bonus</span><div className="flex items-center gap-2"><span className="text-stone-600 text-sm">+{character.proficiencyBonus}</span><ArrowRight size={14} className="text-stone-600"/><span className="text-amber-500 font-bold text-lg">+{nextPB}</span></div></div></div>}{levelUpStep === 2 && <div className="space-y-6 animate-in slide-in-from-right-4"><h4 className="text-xl font-serif font-bold text-stone-200">New Class Features</h4>{levelData.features.length > 0 ? <div className="space-y-3">{levelData.features.map((feat, i) => { if (feat === 'Subclass Feature') { const currentSubclass = getCharacterSubclass(character); if (currentSubclass) { const classData = SUBCLASS_OPTIONS[character.class]; const subclassData = classData?.find(s => s.name === currentSubclass); const specificFeatures = subclassData?.features[nextLevel]; if (specificFeatures) { return specificFeatures.map((scFeat, j) => (<div key={`${i}-${j}`} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3"><div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 h-fit"><Sparkles size={18} /></div><div><div className="font-bold text-amber-500">{scFeat.name}</div><div className="text-xs text-stone-500 mb-1">Subclass Feature ({currentSubclass})</div><div className="text-sm text-stone-300 leading-relaxed">{scFeat.description}</div></div></div>)); } } else { return (<div key={i} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3 opacity-80"><div className="p-2 bg-stone-800 rounded-lg text-stone-500 h-fit"><Sparkles size={18} /></div><div><div className="font-bold text-stone-400">Subclass Features</div><div className="text-xs text-stone-500 mt-1">Select your Subclass in the next step to see what you gain!</div></div></div>) } } const desc = getFeatureDescription(feat); return (<div key={i} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3"><div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 h-fit"><Sparkles size={18} /></div><div><div className="font-bold text-stone-200">{feat}</div><div className="text-xs text-stone-500 mt-1 mb-1">Class Feature (Level {nextLevel})</div>{desc && <div className="text-sm text-stone-400 leading-relaxed">{desc}</div>}</div></div>)})}</div> : <div className="text-center py-8 text-stone-500 italic">No generic class features this level. Check for Subclass or Feat options next!</div>}</div>}{levelUpStep === 3 && (needsSubclass || needsAsi) && <div className="space-y-6 animate-in slide-in-from-right-4"><h4 className="text-xl font-serif font-bold text-stone-200">Heroic Path</h4>{needsSubclass && <div className="space-y-3"><label className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Choose Subclass</label><div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">{(SUBCLASS_OPTIONS[character.class] || []).map(sc => { const isSelected = selectedSubclass === sc.name; const gainedFeatures = sc.features[nextLevel]; return (<button key={sc.name} onClick={() => setSelectedSubclass(sc.name)} className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected ? 'bg-amber-900/20 border-amber-600 ring-1 ring-amber-600/30' : 'bg-stone-950 border-stone-800 hover:border-stone-600'}`}><div className="flex justify-between items-start mb-1"><div className="font-bold text-stone-200 text-sm">{sc.name}</div>{isSelected && <Check size={16} className="text-amber-500"/>}</div><div className="text-xs text-stone-500 mb-2">{sc.description}</div>{isSelected && gainedFeatures && (<div className="mt-3 space-y-2"><div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Gains:</div>{gainedFeatures.map((gf, idx) => (<div key={idx} className="bg-stone-900/80 p-2 rounded border border-stone-800/50"><span className="text-xs font-bold text-stone-300 block">{gf.name}</span><span className="text-[10px] text-stone-400">{gf.description}</span></div>))}</div>)}</button>)})}</div></div>}{needsAsi && <div className="space-y-4"><label className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Ability Score Improvement</label><div className="flex gap-2 mb-4"><button onClick={() => { setImprovementType('asi'); setSelectedFeat(null); }} className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${improvementType === 'asi' ? 'bg-amber-900/40 border-amber-600 text-amber-500' : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600'}`}>Boost Ability Scores</button><button onClick={() => { setImprovementType('feat'); setSelectedFeat(null); }} className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${improvementType === 'feat' ? 'bg-indigo-900/40 border-indigo-500 text-indigo-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600'}`}>Choose a Feat</button></div>{improvementType === 'asi' && <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 space-y-4 animate-in fade-in slide-in-from-top-2"><div className="flex gap-2 text-xs font-bold text-stone-400 mb-2"><button onClick={() => setAsiSelection(p => ({ ...p, type: '+2' }))} className={`flex-1 py-2 rounded-lg border transition-all ${asiSelection.type === '+2' ? 'bg-amber-600 text-white border-amber-500' : 'bg-stone-900 border-stone-700 hover:bg-stone-800'}`}>+2 to One Stat</button><button onClick={() => setAsiSelection(p => ({ ...p, type: '+1+1' }))} className={`flex-1 py-2 rounded-lg border transition-all ${asiSelection.type === '+1+1' ? 'bg-amber-600 text-white border-amber-500' : 'bg-stone-900 border-stone-700 hover:bg-stone-800'}`}>+1 to Two Stats</button></div><select className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-sm text-stone-200 outline-none focus:border-amber-600" value={asiSelection.score1} onChange={(e) => setAsiSelection(p => ({...p, score1: e.target.value as Ability}))}><option value="">Select Ability...</option>{Object.keys(ABILITY_NAMES).map(k => <option key={k} value={k}>{k} ({character.abilityScores[k as Ability]})</option>)}</select>{asiSelection.type === '+1+1' && (<select className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-sm text-stone-200 outline-none focus:border-amber-600" value={asiSelection.score2} onChange={(e) => setAsiSelection(p => ({...p, score2: e.target.value as Ability}))}><option value="">Select Second Ability...</option>{Object.keys(ABILITY_NAMES).map(k => <option key={k} value={k}>{k} ({character.abilityScores[k as Ability]})</option>)}</select>)}</div>}{improvementType === 'feat' && <div className="space-y-4 animate-in fade-in slide-in-from-top-2"><select className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 mb-2 focus:ring-1 focus:ring-indigo-500 outline-none" onChange={(e) => setSelectedFeat(e.target.value)} value={selectedFeat || ''}><option value="" disabled>Select a feat...</option>{FEAT_OPTIONS.filter(f => f.name !== 'Ability Score Improvement').map(f => (<option key={f.name} value={f.name}>{f.name}</option>))}</select>{selectedFeat && (<div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/50"><div className="font-bold text-indigo-300 text-sm mb-1">{selectedFeat}</div><div className="text-xs text-stone-400 leading-relaxed">{FEAT_OPTIONS.find(f => f.name === selectedFeat)?.description}</div></div>)}</div>}</div>}</div>}{levelUpStep === 4 && <div className="space-y-6 animate-in slide-in-from-right-4 text-center"><div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-2 border border-green-500/50"><Check size={32} /></div><h4 className="text-xl font-serif font-bold text-stone-200">Ready to Ascend</h4><p className="text-stone-500 text-sm">Review your changes before making them permanent.</p><div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 text-left space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">New Level</span><span className="text-stone-200 font-bold">{nextLevel}</span></div><div className="flex justify-between"><span className="text-stone-500">HP Gained</span><span className="text-stone-200 font-bold">+{hpIncreaseMode === 'fixed' ? Math.max(1, (hitDie / 2) + 1 + (asiSelection.type === '+2' && asiSelection.score1 === 'CON' ? getModifier(character.abilityScores.CON + 2) : getModifier(character.abilityScores.CON))) : manualHpTotal}</span></div>{selectedSubclass && (<div className="flex justify-between"><span className="text-stone-500">Subclass</span><span className="text-amber-500 font-bold">{selectedSubclass}</span></div>)}{improvementType === 'feat' && selectedFeat && (<div className="flex justify-between"><span className="text-stone-500">Feat Gained</span><span className="text-indigo-400 font-bold">{selectedFeat}</span></div>)}{improvementType === 'asi' && (<div className="flex justify-between"><span className="text-stone-500">Stats Gained</span><span className="text-amber-500 font-bold">{asiSelection.type === '+2' && asiSelection.score1 ? `+2 ${asiSelection.score1}` : ''}{asiSelection.type === '+1+1' && asiSelection.score1 && asiSelection.score2 ? `+1 ${asiSelection.score1}, +1 ${asiSelection.score2}` : ''}</span></div>)}</div></div>}</div><div className="p-6 border-t border-stone-800 flex gap-3 bg-stone-900 shrink-0">{levelUpStep > 1 && (<button onClick={() => setLevelUpStep(p => p - 1)} className="px-4 py-3 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 font-bold">Back</button>)}{levelUpStep < 4 ? (<button onClick={() => { let next = levelUpStep + 1; if (next === 3 && !needsSubclass && !needsAsi) next = 4; setLevelUpStep(next); }} disabled={(levelUpStep === 3 && needsSubclass && !selectedSubclass) || (levelUpStep === 3 && needsAsi && !improvementType) || (levelUpStep === 3 && needsAsi && improvementType === 'feat' && !selectedFeat) || (levelUpStep === 3 && needsAsi && improvementType === 'asi' && asiSelection.type === '+2' && !asiSelection.score1) || (levelUpStep === 3 && needsAsi && improvementType === 'asi' && asiSelection.type === '+1+1' && (!asiSelection.score1 || !asiSelection.score2))} className="flex-1 py-3 bg-stone-100 hover:bg-white text-stone-950 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Next Step</button>) : (<button onClick={handleLevelUpConfirm} className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-95 transition-all">Confirm Level Up</button>)}</div></div></div>}
            {showWeaponModal && <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"><div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowWeaponModal(false)} /><div className="bg-stone-900 w-full max-w-lg h-[80vh] rounded-t-3xl sm:rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10"><div className="p-4 border-b border-stone-800 flex justify-between items-center"><h3 className="font-bold text-stone-100 text-lg">Add Weapon</h3><button onClick={() => setShowWeaponModal(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20}/></button></div><div className="p-4 border-b border-stone-800"><input type="text" placeholder="Search weapons..." className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><div className="overflow-y-auto p-2 custom-scrollbar flex-1">{filteredWeapons.map(key => { const w = ALL_WEAPONS[key]; return (<button key={key} onClick={() => handleAddWeapon(key)} className="w-full text-left p-4 hover:bg-stone-800 border-b border-stone-800 last:border-0 flex justify-between items-center group transition-colors"><div><div className="font-bold text-stone-200 group-hover:text-amber-500">{w.name}</div><div className="text-xs text-stone-500">{w.type} • {w.properties.join(', ')}</div></div><div className="text-right"><div className="font-bold text-amber-600">{w.damage}</div><div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{w.mastery}</div></div></button>) })}</div></div></div>}
            {showArmorModal && <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"><div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowArmorModal(false)} /><div className="bg-stone-900 w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10"><div className="p-4 border-b border-stone-800 flex justify-between items-center"><h3 className="font-bold text-stone-100 text-lg">Equip Armor</h3><button onClick={() => setShowArmorModal(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20}/></button></div><div className="overflow-y-auto p-2 custom-scrollbar max-h-[60vh]">{Object.entries(ARMOR_OPTIONS).map(([name, armor]) => (<button key={name} onClick={() => handleEquipArmor(name)} className="w-full text-left p-4 hover:bg-stone-800 border-b border-stone-800 last:border-0 flex justify-between items-center group"><div><div className="font-bold text-stone-200 group-hover:text-amber-500">{name}</div><div className="text-xs text-stone-500">{armor.type} {armor.stealthDisadvantage && '• Stealth Disadv.'}</div></div><div className="flex flex-col items-end"><span className="font-bold text-stone-100 text-lg">{armor.type === 'Shield' ? `+${armor.baseAC}` : armor.baseAC}</span><span className="text-[10px] text-stone-500 uppercase font-bold">AC</span></div></button>))}</div></div></div>}
            {showAiModal && <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"><div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAiModal(false)} /><div className="bg-stone-900 w-full sm:max-w-lg h-[80vh] sm:h-[600px] sm:rounded-2xl rounded-t-3xl flex flex-col relative z-10 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl border border-stone-800"><div className="flex items-center justify-between p-5 border-b border-stone-800"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-500/10 rounded-lg"><BotMessageSquare className="text-indigo-400" size={24}/></div><div><h3 className="font-bold text-stone-100 text-lg">DM Assistant</h3><p className="text-xs text-indigo-400">Powered by Gemini</p></div></div><button onClick={() => setShowAiModal(false)} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-white rounded-full bg-stone-800"><X size={18} /></button></div><div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-stone-300 bg-stone-950/30">{!aiResponse && !isAskingAi && (<div className="flex flex-col items-center justify-center h-full text-stone-600 text-center space-y-6"><BotMessageSquare size={64} strokeWidth={1.5} className="opacity-20"/><div><p className="text-base font-bold text-stone-400 mb-2">Rules Reference</p><p className="text-sm leading-relaxed max-w-xs mx-auto">Ask about the 2024 Player's Handbook updates, conditions, or spell mechanics.</p></div></div>)}{isAskingAi && (<div className="flex items-center justify-center h-full gap-3 text-indigo-400 animate-pulse"><Sparkles size={20} /><span className="font-bold">Consulting the ancient tomes...</span></div>)}{aiResponse && (<div className="bg-stone-800/80 p-5 rounded-xl border border-stone-700 shadow-lg"><div className="prose prose-invert prose-stone max-w-none leading-relaxed"><p className="whitespace-pre-wrap">{aiResponse}</p></div></div>)}</div><div className="p-4 bg-stone-900 border-t border-stone-800 pb-8"><form onSubmit={handleAskRule} className="flex gap-3"><input ref={aiInputRef} type="text" value={ruleQuery} onChange={(e) => setRuleQuery(e.target.value)} className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-stone-100 text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-stone-600" placeholder="Ask a question..." /><button type="submit" disabled={!ruleQuery.trim() || isAskingAi} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95"><ArrowLeft size={24} className="rotate-180"/></button></form></div></div></div>}
        </div>
    );
};

const WeaponCard: React.FC<{ weapon: Weapon, onRemove: () => void }> = ({ weapon, onRemove }) => (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2"><div><div className="flex items-center gap-2"><span className="text-stone-100 font-bold text-lg font-serif">{weapon.name}</span></div><div className="text-xs font-medium text-stone-500 uppercase tracking-wider">{weapon.type}</div></div><button onClick={onRemove} className="text-stone-700 hover:text-red-500 p-2 rounded-lg bg-stone-950/50 -mr-2 -mt-2 transition-colors"><Trash2 size={16} /></button></div>
        <div className="flex flex-wrap gap-1 mb-4 pr-8">{weapon.properties.map(p => (<span key={p} className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800">{p}</span>))}</div>
        <div className="bg-stone-950/50 border border-stone-800/50 p-3 rounded-xl flex justify-between items-center gap-3">
            <div className="flex items-start gap-2 max-w-[65%]"><div className="mt-0.5">{weapon.damage === '--' ? <Shield size={14} className="text-stone-400"/> : <Zap size={14} className="text-amber-600"/>}</div><div><span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-0.5">{weapon.mastery}</span><p className="text-stone-500 text-[10px] leading-tight line-clamp-2">{MASTERY_DESCRIPTIONS[weapon.mastery]}</p></div></div>
            <div className="text-right"><span className="text-xl font-serif font-bold text-stone-200 block">{weapon.damage === '--' ? '+2' : weapon.damage}</span><span className="text-[10px] text-stone-600 font-bold uppercase">{weapon.damage === '--' ? 'DEF' : 'Dmg'}</span></div>
        </div>
    </div>
);

const VitalStat: React.FC<{ label: string; value: string | number; icon: React.ReactNode; onClick?: () => void; className?: string }> = ({ label, value, icon, onClick, className }) => ( <div onClick={onClick} className={`flex flex-col items-center gap-1 w-14 ${className || ''}`}><span className="text-[10px] text-stone-500 font-bold tracking-widest">{label}</span><div className="flex items-center gap-1.5">{icon}<span className="text-xl font-serif font-bold text-stone-200">{value}</span></div></div>);
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => ( <h3 className="text-stone-400 text-xs uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2 pl-1">{icon} {title}</h3>);
const Badge: React.FC<{ children: React.ReactNode; color?: 'stone' | 'indigo' }> = ({ children, color = 'stone' }) => { if (!children) return null; const styles = color === 'indigo' ? "text-indigo-300 bg-indigo-950/40 border-indigo-900/50" : "text-stone-400 bg-stone-900 border-stone-800"; return ( <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border whitespace-nowrap ${styles}`}>{children}</span>);};
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => ( <button onClick={onClick} className={`relative flex flex-col items-center justify-center w-20 h-full transition-all duration-300`}><div className={`p-2 rounded-2xl transition-all duration-300 ease-out transform ${active ? 'text-amber-500 -translate-y-2 scale-125' : 'text-stone-500'}`}>{icon}</div><span className={`absolute bottom-1 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 ${active ? 'opacity-100 translate-y-0 text-amber-500' : 'opacity-0 translate-y-2'}`}>{label}</span></button>);
const SpellStatCard: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-2xl font-serif font-bold text-indigo-400">{value ?? '-'}</span>
    </div>
);

const NoteCard: React.FC<{note: Note, onEdit: () => void, onDelete: () => void}> = ({note, onEdit, onDelete}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800/50 transition-colors">
            <div className="flex justify-between items-start">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-left flex-1">
                    <div className="font-bold text-sm text-stone-200 mb-1">{note.title}</div>
                    {!isExpanded && <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{note.content}</p>}
                </button>
                <div className="flex gap-1 pl-2">
                    <button onClick={onEdit} className="text-stone-500 hover:text-amber-500 p-1.5"><PenSquare size={14}/></button>
                    <button onClick={onDelete} className="text-stone-500 hover:text-red-500 p-1.5"><Trash2 size={14}/></button>
                </div>
            </div>
            {isExpanded && <p className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap mt-3 border-t border-stone-800/50 pt-3">{note.content}</p>}
        </div>
    );
}

const NoteModal: React.FC<{note: Note | null, onClose: () => void, onSave: (data: {title: string, content: string}) => void}> = ({note, onClose, onSave}) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');

    const handleSave = () => {
        if (title.trim() || content.trim()) {
            onSave({title: title.trim() || 'Untitled Note', content: content.trim()});
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" onClick={onClose} />
            <div className="bg-stone-900 w-full max-w-lg rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95 max-h-[80vh]">
                <div className="p-5 border-b border-stone-800 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-stone-100 text-xl font-serif">{note ? 'Edit Note' : 'New Note'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full text-stone-500"><X size={24}/></button>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <input 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-lg font-bold text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Jot down your thoughts..."
                        className="w-full flex-1 bg-stone-950 border border-stone-800 rounded-xl p-4 text-base text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none"
                    />
                </div>
                <div className="p-4 border-t border-stone-800 shrink-0">
                    <button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
};

const SpellDetailModal: React.FC<{ spellName: string; onClose: () => void }> = ({ spellName, onClose }) => {
    const spell = SPELL_DETAILS[spellName];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-stone-900 w-full max-w-md max-h-[85vh] rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95">
                <div className="p-5 border-b border-stone-800 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-indigo-400 text-xl font-serif">{spellName}</h3>
                        {spell && <p className="text-xs text-stone-500">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} {spell.school}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 -mt-2 -mr-2 hover:bg-stone-800 rounded-full text-stone-500"><X size={20}/></button>
                </div>
                <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
                    {spell ? (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <SpellInfoItem label="Casting Time" value={spell.castingTime} />
                                <SpellInfoItem label="Range" value={spell.range} />
                                <SpellInfoItem label="Components" value={spell.components} />
                                <SpellInfoItem label="Duration" value={spell.duration} />
                            </div>
                            <div className="prose prose-sm prose-invert text-stone-300 leading-relaxed whitespace-pre-wrap border-t border-stone-800 pt-4">
                                {spell.description}
                            </div>
                        </>
                    ) : (
                        <p className="text-stone-400 italic">Details for this custom or unlisted spell are not available in the grimoire.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const SpellInfoItem: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div>
        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{label}</div>
        <div className="text-stone-300">{value}</div>
    </div>
);


export default CharacterSheet;
