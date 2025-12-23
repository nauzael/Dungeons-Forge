
import React, { useState, useRef, useEffect } from 'react';
import { Character, Ability, Weapon } from '../types';
import { Shield, Heart, Zap, Scroll, Swords, Backpack, ArrowLeft, BotMessageSquare, Sparkles, BookOpen, X, User, MessageCircle, Plus, Trash2, Settings, AlertCircle, ChevronsUp, Crown, ArrowRight, Check } from 'lucide-react';
import { askDndRules } from '../services/geminiService';
import { MASTERY_DESCRIPTIONS, ALL_WEAPONS, ARMOR_OPTIONS, HIT_DIE, getLevelData, SUBCLASS_OPTIONS, FEAT_OPTIONS, ABILITY_NAMES, GENERIC_FEATURES, SPECIES_DETAILS, CLASS_DETAILS, BACKGROUNDS_DATA } from '../constants';

interface CharacterSheetProps {
    character: Character;
    onBack: () => void;
    onCharacterUpdate: (char: Character) => void;
}

type TabType = 'main' | 'combat' | 'inventory' | 'spells';
const TABS: TabType[] = ['main', 'combat', 'inventory', 'spells'];

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack, onCharacterUpdate }) => {
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [showAiModal, setShowAiModal] = useState(false);
    
    // Weapon & Armor State management
    const [activeWeapons, setActiveWeapons] = useState<Weapon[]>(character.weapons || []);
    const [currentAC, setCurrentAC] = useState(character.armorClass);
    const [equippedArmorName, setEquippedArmorName] = useState<string>('Unarmored');
    
    // Modals
    const [showWeaponModal, setShowWeaponModal] = useState(false);
    const [showArmorModal, setShowArmorModal] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Level Up State (Wizard)
    const [levelUpStep, setLevelUpStep] = useState(1);
    const [hpIncreaseMode, setHpIncreaseMode] = useState<'fixed' | 'manual'>('fixed');
    const [manualHpInput, setManualHpInput] = useState<number>(0);
    const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);
    const [selectedFeat, setSelectedFeat] = useState<string | null>(null);
    const [asiSelection, setAsiSelection] = useState<{ type: '+2' | '+1+1', score1: Ability | '', score2: Ability | '' }>({ type: '+2', score1: '', score2: '' });

    // AI State
    const [ruleQuery, setRuleQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAskingAi, setIsAskingAi] = useState(false);
    const aiInputRef = useRef<HTMLInputElement>(null);

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

    // Reset Level Up wizard on close
    useEffect(() => {
        if (!showLevelUpModal) {
            setLevelUpStep(1);
            setHpIncreaseMode('fixed');
            setManualHpInput(0);
            setSelectedSubclass(null);
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

    const getFeatureDescription = (featName: string): string | null => {
        // 1. Check Generic/Global Glossary
        if (GENERIC_FEATURES[featName]) return GENERIC_FEATURES[featName];

        // 2. Check Class Details (Level 1)
        const classTrait = CLASS_DETAILS[character.class]?.traits.find(t => t.name === featName);
        if (classTrait) return classTrait.description;

        // 3. Check Species Traits
        const speciesTrait = SPECIES_DETAILS[character.species]?.traits.find(t => t.name === featName);
        if (speciesTrait) return speciesTrait.description;

        // 4. Handle "Feat: X"
        if (featName.startsWith('Feat: ')) {
            const rawName = featName.replace('Feat: ', '');
            const feat = FEAT_OPTIONS.find(f => f.name === rawName);
            if (feat) return feat.description;
        }

        // 5. Handle "Subclass: X"
        if (featName.startsWith('Subclass: ')) {
            const rawName = featName.replace('Subclass: ', '');
            const sc = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === rawName);
            if (sc) return sc.description;
        }
        
        // 6. Check Background Feat (Origin Feat)
        if (featName === character.originFeat) {
             const bg = BACKGROUNDS_DATA[character.background];
             if (bg && bg.featDescription) return bg.featDescription;
             const standardFeat = FEAT_OPTIONS.find(f => f.name === featName);
             if(standardFeat) return standardFeat.description;
        }

        return null;
    };

    const handleLevelUpConfirm = () => {
        const hpGain = hpIncreaseMode === 'fixed' ? fixedHpIncrease : manualHpTotal;
        
        let newFeatures = [...character.features];
        // Add class features
        newFeatures = [...newFeatures, ...levelData.features];
        
        // Add Subclass if selected
        if (selectedSubclass) {
            newFeatures.push(`Subclass: ${selectedSubclass}`);
        }

        // Handle ASI
        let newScores = { ...character.abilityScores };
        if (selectedFeat === 'Ability Score Improvement' && needsAsi) {
             if (asiSelection.type === '+2' && asiSelection.score1) {
                 newScores[asiSelection.score1 as Ability] += 2;
             } else if (asiSelection.type === '+1+1' && asiSelection.score1 && asiSelection.score2) {
                 newScores[asiSelection.score1 as Ability] += 1;
                 newScores[asiSelection.score2 as Ability] += 1;
             }
        } else if (selectedFeat && needsAsi) {
            newFeatures.push(`Feat: ${selectedFeat}`);
        }

        const updatedChar: Character = {
            ...character,
            level: nextLevel,
            maxHp: character.maxHp + hpGain,
            currentHp: character.currentHp + hpGain, // Heal the gained amount
            proficiencyBonus: nextPB,
            features: newFeatures,
            abilityScores: newScores,
            weapons: activeWeapons, // Persist current weapons
            armorClass: currentAC   // Persist current AC
        };

        onCharacterUpdate(updatedChar);
        setShowLevelUpModal(false);
    };

    const handleAddWeapon = (weaponKey: string) => {
        const weaponData = ALL_WEAPONS[weaponKey];
        if (weaponData) {
            setActiveWeapons(prev => [...prev, { ...weaponData, equipped: true }]);
            // Auto-apply shield bonus if equipped as weapon
            if (weaponKey === 'Shield') {
                setCurrentAC(prev => prev + 2);
            }
            setShowWeaponModal(false);
        }
    };

    const handleRemoveWeapon = (index: number) => {
        const weaponToRemove = activeWeapons[index];
        // Remove shield bonus
        if (weaponToRemove && weaponToRemove.name === 'Shield') {
             setCurrentAC(prev => prev - 2);
        }
        setActiveWeapons(prev => prev.filter((_, i) => i !== index));
    };

    const handleEquipArmor = (armorKey: string) => {
        const armor = ARMOR_OPTIONS[armorKey];
        if (!armor) return;

        let dexMod = getModifier(character.abilityScores.DEX);
        if (armor.maxDex !== undefined) {
            dexMod = Math.min(dexMod, armor.maxDex);
        }
        
        let newAC = 0;
        let name = armorKey;

        // Simple logic: if shield, add to current. If armor, replace base.
        if (armor.type === 'Shield') {
            newAC = currentAC + armor.baseAC; 
            name = `${equippedArmorName} + Shield`;
        } else {
            newAC = armor.baseAC + dexMod;
        }
        
        setEquippedArmorName(name);
        setCurrentAC(newAC);
        setShowArmorModal(false);
    };

    const filteredWeapons = Object.keys(ALL_WEAPONS).filter(k => 
        k.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (showAiModal && aiInputRef.current) {
            setTimeout(() => aiInputRef.current?.focus(), 100);
        }
    }, [showAiModal]);

    const handleAskRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleQuery.trim()) return;
        setIsAskingAi(true);
        setAiResponse(null);
        const ans = await askDndRules(ruleQuery);
        setAiResponse(ans);
        setIsAskingAi(false);
    }

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe || isRightSwipe) {
            const currentIndex = TABS.indexOf(activeTab);
            if (isLeftSwipe && currentIndex < TABS.length - 1) {
                setActiveTab(TABS[currentIndex + 1]);
                window.scrollTo(0, 0); // Reset scroll on tab change
            }
            if (isRightSwipe && currentIndex > 0) {
                setActiveTab(TABS[currentIndex - 1]);
                window.scrollTo(0, 0);
            }
        }
    };

    // Helper for Weapon Slots
    const mainHand = activeWeapons[0];
    const offHand = activeWeapons[1];
    const isTwoHanded = mainHand?.properties.some(p => p.includes('Two-Handed'));
    const otherWeapons = activeWeapons.slice(2);

    return (
        <div 
            className="min-h-screen bg-stone-950 font-sans pb-32" 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            
            {/* --- STICKY HEADER --- */}
            <div className="sticky top-0 z-50 px-4 py-3 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-md">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={onBack} 
                        className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white rounded-full active:bg-stone-900 transition-colors"
                    >
                        <ArrowLeft size={24}/>
                    </button>
                    
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold text-stone-100 tracking-wide">{character.name}</h1>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Lvl {character.level} {character.class}</span>
                    </div>

                    <button 
                        onClick={() => setShowAiModal(true)} 
                        className="w-10 h-10 flex items-center justify-center text-indigo-400 bg-indigo-950/20 rounded-full border border-indigo-900/30 active:bg-indigo-900/50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    >
                        <BotMessageSquare size={22} />
                    </button>
                </div>
            </div>

            {/* --- SCROLLABLE CONTENT AREA (Native Scroll) --- */}
            <div>
                {/* Vitals Bar - Flows naturally under header */}
                <div className="px-4 py-4">
                    <div className="flex justify-between items-center bg-stone-900/50 p-4 rounded-2xl border border-stone-800 shadow-lg">
                        <VitalStat label="AC" value={currentAC} icon={<Shield size={16} className="text-stone-500"/>} />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="HP" value={character.currentHp} icon={<Heart size={16} className="text-red-600"/>} />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="INIT" value={formatMod(character.initiative)} icon={<Zap size={16} className="text-amber-600"/>} />
                        <div className="w-px h-8 bg-stone-800"></div>
                        <VitalStat label="PROF" value={`+${character.proficiencyBonus}`} icon={<Swords size={16} className="text-stone-500"/>} />
                    </div>
                </div>

                <div className="px-4 py-2 space-y-8">
                    {/* --- TAB CONTENT --- */}
                    
                    {activeTab === 'main' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                            
                            {/* Level Up Banner */}
                            <button 
                                onClick={() => setShowLevelUpModal(true)}
                                className="w-full bg-gradient-to-r from-amber-900/40 to-stone-900 border border-amber-900/50 p-3 rounded-xl flex items-center justify-between group hover:border-amber-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <ChevronsUp size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-stone-200">Level Up Available</div>
                                        <div className="text-xs text-stone-500">Advance to Level {nextLevel}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                    Begin
                                </div>
                            </button>

                            {/* Ability Scores */}
                            <div className="grid grid-cols-3 gap-3">
                                {(Object.keys(character.abilityScores) as Ability[]).map(ability => {
                                    const score = character.abilityScores[ability];
                                    const mod = getModifier(score);
                                    return (
                                        <div key={ability} className="bg-stone-900/40 border border-stone-800 rounded-xl p-3 flex flex-col items-center justify-between aspect-[4/5] shadow-sm relative overflow-hidden group">
                                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">{ability}</span>
                                            <span className="text-3xl font-serif font-bold text-stone-200 z-10">{formatMod(mod)}</span>
                                            <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-xs text-stone-500 font-bold z-10 mb-1">
                                                {score}
                                            </div>
                                            {/* Decorative */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/50 pointer-events-none" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Info Badges */}
                            <div className="flex flex-wrap gap-2">
                                <Badge>{character.alignment}</Badge>
                                <Badge>{character.size} Size</Badge>
                                <Badge>{character.speed} ft Speed</Badge>
                                {character.languages && character.languages.map((l, i) => (
                                    <div key={i} className="text-xs font-bold px-3 py-1.5 rounded-lg border text-stone-400 bg-stone-900 border-stone-800 flex items-center gap-1">
                                        <MessageCircle size={10} /> {l}
                                    </div>
                                ))}
                            </div>

                            {/* Features */}
                            <div>
                                <SectionHeader icon={<Sparkles size={16}/>} title="Features & Traits" />
                                <div className="space-y-3">
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                        <Badge>{character.background}</Badge>
                                        <Badge color="indigo">{character.originFeat}</Badge>
                                        <Badge color="stone">{character.species}</Badge>
                                    </div>
                                    {character.features.map((featName, idx) => {
                                        const description = getFeatureDescription(featName);
                                        return (
                                            <div key={idx} className="bg-stone-900/60 p-4 rounded-xl border border-stone-800/50">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0"></div>
                                                    <span className="text-stone-200 font-bold text-sm">{featName}</span>
                                                </div>
                                                {description && (
                                                    <p className="text-stone-500 text-xs leading-relaxed pl-4.5">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Backstory */}
                            <div>
                                <SectionHeader icon={<Scroll size={16}/>} title="Backstory" />
                                <div className="bg-stone-900/30 p-5 rounded-xl border border-stone-800/50 relative">
                                    <p className="text-stone-400 text-sm leading-7 font-serif italic">
                                        "{character.backstory}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'combat' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            
                            {/* --- ARMOR SECTION --- */}
                            <SectionHeader icon={<Shield size={16}/>} title="Defense" />
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
                                <div>
                                    <div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Equipped Armor</div>
                                    <div className="text-stone-100 font-serif font-bold text-lg">{equippedArmorName}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-stone-100">{currentAC}</div>
                                        <div className="text-[10px] text-stone-500 font-bold uppercase">AC</div>
                                    </div>
                                    <button 
                                        onClick={() => setShowArmorModal(true)}
                                        className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-all"
                                    >
                                        <Settings size={18} />
                                    </button>
                                </div>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-700"></div>
                            </div>

                            {/* --- WEAPON SLOTS --- */}
                            <SectionHeader icon={<Swords size={16}/>} title="Weapons" />
                            
                            {/* Main Hand */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute -left-2 top-3 -rotate-90 text-[10px] font-bold text-stone-600 uppercase tracking-widest origin-center">Main</div>
                                    <div className="pl-6">
                                        {mainHand ? (
                                            <WeaponCard 
                                                weapon={mainHand} 
                                                onRemove={() => handleRemoveWeapon(0)} 
                                            />
                                        ) : (
                                            <button 
                                                onClick={() => setShowWeaponModal(true)}
                                                className="w-full h-24 border-2 border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-600 hover:text-stone-400 hover:border-stone-600 transition-all bg-stone-900/30"
                                            >
                                                <Plus size={24} className="mb-1"/>
                                                <span className="text-xs font-bold uppercase">Equip Main Hand</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Off Hand */}
                                <div className="relative">
                                    <div className="absolute -left-2 top-5 -rotate-90 text-[10px] font-bold text-stone-600 uppercase tracking-widest origin-center">Off</div>
                                    <div className="pl-6">
                                        {isTwoHanded ? (
                                            <div className="w-full p-4 border border-stone-800/50 bg-stone-950/30 rounded-2xl flex items-center justify-center gap-2 text-stone-600">
                                                <AlertCircle size={16}/>
                                                <span className="text-sm font-medium italic">Occupied by Two-Handed Weapon</span>
                                            </div>
                                        ) : (
                                            offHand ? (
                                                <WeaponCard 
                                                    weapon={offHand} 
                                                    onRemove={() => handleRemoveWeapon(1)} 
                                                />
                                            ) : (
                                                <button 
                                                    onClick={() => setShowWeaponModal(true)}
                                                    disabled={!mainHand}
                                                    className="w-full h-20 border-2 border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-600 hover:text-stone-400 hover:border-stone-600 transition-all bg-stone-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={20} className="mb-1"/>
                                                    <span className="text-xs font-bold uppercase">Equip Off-Hand / Shield</span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stashed / Backup Weapons */}
                            {otherWeapons.length > 0 && (
                                <div className="pt-4 border-t border-stone-800">
                                    <h4 className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-3">Backpack</h4>
                                    <div className="space-y-3">
                                        {otherWeapons.map((wpn, i) => (
                                            <WeaponCard 
                                                key={i + 2} 
                                                weapon={wpn} 
                                                onRemove={() => handleRemoveWeapon(i + 2)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Add Button if slots are full but want more backup */}
                             {activeWeapons.length >= 2 && (
                                <button 
                                    onClick={() => setShowWeaponModal(true)}
                                    className="w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus size={16}/> Add to Backpack
                                </button>
                            )}

                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <SectionHeader icon={<Backpack size={16}/>} title="Equipment" />
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
                                {character.equipment.map((item, i) => (
                                    <div key={i} className="px-5 py-4 border-b border-stone-800 last:border-0 flex items-center justify-between hover:bg-stone-800/50 transition-colors">
                                        <span className="text-stone-300 font-medium">{item}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-700"></div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 border border-dashed border-stone-700 text-stone-500 rounded-xl hover:bg-stone-900/50 transition-colors text-sm font-medium">
                                + Add Item
                            </button>
                        </div>
                    )}

                    {activeTab === 'spells' && (
                        <div className="h-[50vh] flex flex-col items-center justify-center text-stone-500 animate-in fade-in slide-in-from-right-8 duration-300">
                            <BookOpen size={56} strokeWidth={1} className="mb-6 opacity-30 text-stone-400"/>
                            <p className="font-serif text-2xl text-stone-400 mb-2">Grimoire</p>
                            <p className="text-sm text-stone-600 max-w-[220px] text-center leading-relaxed">
                                The weave is quiet. Spell management coming in future updates.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- FOOTER NAVIGATION (Fixed) --- */}
            <div className="fixed bottom-0 w-full bg-stone-950/95 backdrop-blur-md border-t border-stone-800 pb-safe pt-2 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                <nav className="flex justify-around items-end h-[70px] pb-2">
                    <NavButton 
                        active={activeTab === 'main'} 
                        onClick={() => setActiveTab('main')} 
                        icon={<User size={24}/>} 
                        label="Hero" 
                    />
                    <NavButton 
                        active={activeTab === 'combat'} 
                        onClick={() => setActiveTab('combat')} 
                        icon={<Swords size={24}/>} 
                        label="Combat" 
                    />
                    <NavButton 
                        active={activeTab === 'inventory'} 
                        onClick={() => setActiveTab('inventory')} 
                        icon={<Backpack size={24}/>} 
                        label="Items" 
                    />
                    <NavButton 
                        active={activeTab === 'spells'} 
                        onClick={() => setActiveTab('spells')} 
                        icon={<BookOpen size={24}/>} 
                        label="Spells" 
                    />
                </nav>
            </div>

            {/* --- LEVEL UP MODAL (WIZARD STYLE) --- */}
            {showLevelUpModal && (
                 <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" onClick={() => setShowLevelUpModal(false)} />
                    <div className="bg-stone-900 w-full max-w-md max-h-[90vh] rounded-2xl border-2 border-amber-600/50 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 text-center relative overflow-hidden shrink-0">
                            <Crown className="absolute -right-4 -top-4 text-amber-500/20 w-32 h-32 rotate-12" />
                            <h3 className="font-serif font-bold text-white text-2xl relative z-10">Level Up!</h3>
                            <p className="text-amber-100/80 text-sm relative z-10">Advancing to Level {nextLevel}</p>
                            
                            {/* Wizard Steps Dots */}
                            <div className="flex justify-center gap-2 mt-4 relative z-10">
                                <div className={`w-2 h-2 rounded-full ${levelUpStep >= 1 ? 'bg-white' : 'bg-white/30'}`} />
                                <div className={`w-2 h-2 rounded-full ${levelUpStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />
                                {(needsSubclass || needsAsi) && (
                                    <div className={`w-2 h-2 rounded-full ${levelUpStep >= 3 ? 'bg-white' : 'bg-white/30'}`} />
                                )}
                                <div className={`w-2 h-2 rounded-full ${levelUpStep >= 4 ? 'bg-white' : 'bg-white/30'}`} />
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            
                            {/* STEP 1: VITALITY */}
                            {levelUpStep === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h4 className="text-xl font-serif font-bold text-stone-200">Vitality & Proficiency</h4>
                                    
                                    {/* HP Input */}
                                    <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                                        <label className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-3 block">Hit Points</label>
                                        <div className="flex bg-stone-950 rounded-xl p-1 border border-stone-800 mb-4">
                                            <button 
                                                onClick={() => setHpIncreaseMode('fixed')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${hpIncreaseMode === 'fixed' ? 'bg-stone-800 text-amber-500 shadow' : 'text-stone-500'}`}
                                            >
                                                Fixed ({fixedHpIncrease})
                                            </button>
                                            <button 
                                                onClick={() => setHpIncreaseMode('manual')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${hpIncreaseMode === 'manual' ? 'bg-stone-800 text-amber-500 shadow' : 'text-stone-500'}`}
                                            >
                                                Manual
                                            </button>
                                        </div>
                                        {hpIncreaseMode === 'manual' && (
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    max={hitDie} 
                                                    value={manualHpInput || ''}
                                                    onChange={(e) => setManualHpInput(parseInt(e.target.value) || 0)}
                                                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-center text-lg font-bold text-white focus:ring-1 focus:ring-amber-600 outline-none"
                                                    placeholder={`Roll d${hitDie}`}
                                                />
                                                <span className="font-bold text-stone-500">+ {conMod} (CON)</span>
                                            </div>
                                        )}
                                        <div className="text-center text-stone-300 text-sm font-bold mt-2">
                                            Total: +{hpIncreaseMode === 'fixed' ? fixedHpIncrease : manualHpTotal} HP
                                        </div>
                                    </div>

                                    {/* PB Info */}
                                    <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex justify-between items-center">
                                        <span className="text-stone-400 text-sm font-bold">Proficiency Bonus</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-stone-600 text-sm">+{character.proficiencyBonus}</span>
                                            <ArrowRight size={14} className="text-stone-600"/>
                                            <span className="text-amber-500 font-bold text-lg">+{nextPB}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CLASS FEATURES */}
                            {levelUpStep === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h4 className="text-xl font-serif font-bold text-stone-200">New Class Features</h4>
                                    
                                    {levelData.features.length > 0 ? (
                                        <div className="space-y-3">
                                            {levelData.features.map((feat, i) => {
                                                // Handle Subclass Feature specific display
                                                if (feat === 'Subclass Feature') {
                                                    const currentSubclass = getCharacterSubclass(character);
                                                    if (currentSubclass) {
                                                        const classData = SUBCLASS_OPTIONS[character.class];
                                                        const subclassData = classData?.find(s => s.name === currentSubclass);
                                                        const specificFeatures = subclassData?.features[nextLevel];
                                                        
                                                        if (specificFeatures) {
                                                            return specificFeatures.map((scFeat, j) => (
                                                                <div key={`${i}-${j}`} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3">
                                                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 h-fit">
                                                                        <Sparkles size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-amber-500">{scFeat.name}</div>
                                                                        <div className="text-xs text-stone-500 mb-1">Subclass Feature ({currentSubclass})</div>
                                                                        <div className="text-sm text-stone-300 leading-relaxed">{scFeat.description}</div>
                                                                    </div>
                                                                </div>
                                                            ));
                                                        }
                                                    } else {
                                                         return (
                                                            <div key={i} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3 opacity-80">
                                                                <div className="p-2 bg-stone-800 rounded-lg text-stone-500 h-fit">
                                                                    <Sparkles size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-stone-400">Subclass Features</div>
                                                                    <div className="text-xs text-stone-500 mt-1">Select your Subclass in the next step to see what you gain!</div>
                                                                </div>
                                                            </div>
                                                         )
                                                    }
                                                }

                                                return (
                                                <div key={i} className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex gap-3">
                                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 h-fit">
                                                        <Sparkles size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-stone-200">{feat}</div>
                                                        <div className="text-xs text-stone-500 mt-1">Class Feature (Level {nextLevel})</div>
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-stone-500 italic">
                                            No generic class features this level. Check for Subclass or Feat options next!
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: CHOICES (SUBCLASS / ASI) */}
                            {levelUpStep === 3 && (needsSubclass || needsAsi) && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h4 className="text-xl font-serif font-bold text-stone-200">Heroic Path</h4>

                                    {/* SUBCLASS SELECTION */}
                                    {needsSubclass && (
                                        <div className="space-y-3">
                                            <label className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Choose Subclass</label>
                                            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                                                {(SUBCLASS_OPTIONS[character.class] || []).map(sc => {
                                                    const isSelected = selectedSubclass === sc.name;
                                                    const gainedFeatures = sc.features[nextLevel];
                                                    
                                                    return (
                                                    <button
                                                        key={sc.name}
                                                        onClick={() => setSelectedSubclass(sc.name)}
                                                        className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected ? 'bg-amber-900/20 border-amber-600 ring-1 ring-amber-600/30' : 'bg-stone-950 border-stone-800 hover:border-stone-600'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                             <div className="font-bold text-stone-200 text-sm">{sc.name}</div>
                                                             {isSelected && <Check size={16} className="text-amber-500"/>}
                                                        </div>
                                                        <div className="text-xs text-stone-500 mb-2">{sc.description}</div>
                                                        
                                                        {/* Show specific features gained immediately */}
                                                        {isSelected && gainedFeatures && (
                                                            <div className="mt-3 space-y-2">
                                                                <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Gains:</div>
                                                                {gainedFeatures.map((gf, idx) => (
                                                                    <div key={idx} className="bg-stone-900/80 p-2 rounded border border-stone-800/50">
                                                                        <span className="text-xs font-bold text-stone-300 block">{gf.name}</span>
                                                                        <span className="text-[10px] text-stone-400">{gf.description}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </button>
                                                )})}
                                            </div>
                                        </div>
                                    )}

                                    {/* ASI / FEAT SELECTION */}
                                    {needsAsi && (
                                        <div className="space-y-4">
                                            <label className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Improvement Type</label>
                                            <select 
                                                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 mb-2 focus:ring-1 focus:ring-amber-600 outline-none"
                                                onChange={(e) => setSelectedFeat(e.target.value)}
                                                value={selectedFeat || ''}
                                            >
                                                <option value="" disabled>Select an option...</option>
                                                {FEAT_OPTIONS.map(f => (
                                                    <option key={f.name} value={f.name}>{f.name}</option>
                                                ))}
                                            </select>

                                            {/* Feat Details Preview */}
                                            {selectedFeat && selectedFeat !== 'Ability Score Improvement' && (
                                                 <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                                                     <div className="font-bold text-stone-300 text-sm mb-1">{selectedFeat}</div>
                                                     <div className="text-xs text-stone-500 leading-relaxed">
                                                        {FEAT_OPTIONS.find(f => f.name === selectedFeat)?.description}
                                                     </div>
                                                 </div>
                                            )}

                                            {/* Logic for manual ASI inputs */}
                                            {selectedFeat === 'Ability Score Improvement' && (
                                                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 space-y-3">
                                                    <div className="flex gap-2 text-xs font-bold text-stone-400 mb-2">
                                                        <button 
                                                            onClick={() => setAsiSelection(p => ({ ...p, type: '+2' }))}
                                                            className={`flex-1 py-1.5 rounded border ${asiSelection.type === '+2' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-stone-700'}`}
                                                        >
                                                            +2 to One
                                                        </button>
                                                        <button 
                                                            onClick={() => setAsiSelection(p => ({ ...p, type: '+1+1' }))}
                                                            className={`flex-1 py-1.5 rounded border ${asiSelection.type === '+1+1' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-stone-700'}`}
                                                        >
                                                            +1 to Two
                                                        </button>
                                                    </div>

                                                    <select 
                                                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-sm text-stone-300 outline-none"
                                                        value={asiSelection.score1}
                                                        onChange={(e) => setAsiSelection(p => ({...p, score1: e.target.value as Ability}))}
                                                    >
                                                        <option value="">Select Ability...</option>
                                                        {Object.keys(ABILITY_NAMES).map(k => <option key={k} value={k}>{k} ({character.abilityScores[k as Ability]})</option>)}
                                                    </select>

                                                    {asiSelection.type === '+1+1' && (
                                                        <select 
                                                            className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-sm text-stone-300 outline-none"
                                                            value={asiSelection.score2}
                                                            onChange={(e) => setAsiSelection(p => ({...p, score2: e.target.value as Ability}))}
                                                        >
                                                            <option value="">Select Ability...</option>
                                                            {Object.keys(ABILITY_NAMES).map(k => <option key={k} value={k}>{k} ({character.abilityScores[k as Ability]})</option>)}
                                                        </select>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* STEP 4: CONFIRMATION */}
                             {levelUpStep === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-2 border border-green-500/50">
                                        <Check size={32} />
                                    </div>
                                    <h4 className="text-xl font-serif font-bold text-stone-200">Ready to Ascend</h4>
                                    <p className="text-stone-500 text-sm">Review your changes before making them permanent.</p>
                                    
                                    <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 text-left space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-stone-500">New Level</span>
                                            <span className="text-stone-200 font-bold">{nextLevel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-500">HP Gained</span>
                                            <span className="text-stone-200 font-bold">+{hpIncreaseMode === 'fixed' ? fixedHpIncrease : manualHpTotal}</span>
                                        </div>
                                        {selectedSubclass && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-500">Subclass</span>
                                                <span className="text-amber-500 font-bold">{selectedSubclass}</span>
                                            </div>
                                        )}
                                        {selectedFeat && (
                                            <div className="flex justify-between">
                                                <span className="text-stone-500">Feat/ASI</span>
                                                <span className="text-indigo-400 font-bold">{selectedFeat}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             )}

                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-stone-800 flex gap-3 bg-stone-900 shrink-0">
                            {levelUpStep > 1 && (
                                <button 
                                    onClick={() => setLevelUpStep(p => p - 1)}
                                    className="px-4 py-3 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 font-bold"
                                >
                                    Back
                                </button>
                            )}
                            
                            {levelUpStep < 4 ? (
                                <button 
                                    onClick={() => {
                                        // Skip step 3 if not needed
                                        let next = levelUpStep + 1;
                                        if (next === 3 && !needsSubclass && !needsAsi) next = 4;
                                        setLevelUpStep(next);
                                    }}
                                    disabled={
                                        (levelUpStep === 3 && needsSubclass && !selectedSubclass) ||
                                        (levelUpStep === 3 && needsAsi && !selectedFeat) ||
                                        (levelUpStep === 3 && needsAsi && selectedFeat === 'Ability Score Improvement' && asiSelection.type === '+2' && !asiSelection.score1) ||
                                        (levelUpStep === 3 && needsAsi && selectedFeat === 'Ability Score Improvement' && asiSelection.type === '+1+1' && (!asiSelection.score1 || !asiSelection.score2))
                                    }
                                    className="flex-1 py-3 bg-stone-100 hover:bg-white text-stone-950 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button 
                                    onClick={handleLevelUpConfirm}
                                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-95 transition-all"
                                >
                                    Confirm Level Up
                                </button>
                            )}
                        </div>
                    </div>
                 </div>
            )}

            {/* --- WEAPON SELECTOR MODAL --- */}
            {showWeaponModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
                    <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowWeaponModal(false)} />
                    <div className="bg-stone-900 w-full max-w-lg h-[80vh] rounded-t-3xl sm:rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                            <h3 className="font-bold text-stone-100 text-lg">Add Weapon</h3>
                            <button onClick={() => setShowWeaponModal(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="p-4 border-b border-stone-800">
                            <input 
                                type="text" 
                                placeholder="Search weapons..." 
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="overflow-y-auto p-2 custom-scrollbar flex-1">
                            {filteredWeapons.map(key => {
                                const w = ALL_WEAPONS[key];
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => handleAddWeapon(key)}
                                        className="w-full text-left p-4 hover:bg-stone-800 border-b border-stone-800 last:border-0 flex justify-between items-center group transition-colors"
                                    >
                                        <div>
                                            <div className="font-bold text-stone-200 group-hover:text-amber-500">{w.name}</div>
                                            <div className="text-xs text-stone-500">{w.type} • {w.properties.join(', ')}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-amber-600">{w.damage}</div>
                                            <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{w.mastery}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- ARMOR SELECTOR MODAL --- */}
            {showArmorModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
                    <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" onClick={() => setShowArmorModal(false)} />
                    <div className="bg-stone-900 w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                            <h3 className="font-bold text-stone-100 text-lg">Equip Armor</h3>
                            <button onClick={() => setShowArmorModal(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="overflow-y-auto p-2 custom-scrollbar max-h-[60vh]">
                            {Object.entries(ARMOR_OPTIONS).map(([name, armor]) => (
                                <button 
                                    key={name}
                                    onClick={() => handleEquipArmor(name)}
                                    className="w-full text-left p-4 hover:bg-stone-800 border-b border-stone-800 last:border-0 flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="font-bold text-stone-200 group-hover:text-amber-500">{name}</div>
                                        <div className="text-xs text-stone-500">{armor.type} {armor.stealthDisadvantage && '• Stealth Disadv.'}</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-stone-100 text-lg">{armor.type === 'Shield' ? `+${armor.baseAC}` : armor.baseAC}</span>
                                        <span className="text-[10px] text-stone-500 uppercase font-bold">AC</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- AI MODAL OVERLAY --- */}
            {showAiModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
                    <div 
                        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowAiModal(false)}
                    />
                    
                    <div className="bg-stone-900 w-full sm:max-w-lg h-[80vh] sm:h-[600px] sm:rounded-2xl rounded-t-3xl flex flex-col relative z-10 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl border border-stone-800">
                        <div className="flex items-center justify-between p-5 border-b border-stone-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <BotMessageSquare className="text-indigo-400" size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-100 text-lg">DM Assistant</h3>
                                    <p className="text-xs text-indigo-400">Powered by Gemini</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowAiModal(false)}
                                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-white rounded-full bg-stone-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-stone-300 bg-stone-950/30">
                            {!aiResponse && !isAskingAi && (
                                <div className="flex flex-col items-center justify-center h-full text-stone-600 text-center space-y-6">
                                    <BotMessageSquare size={64} strokeWidth={1.5} className="opacity-20"/>
                                    <div>
                                        <p className="text-base font-bold text-stone-400 mb-2">Rules Reference</p>
                                        <p className="text-sm leading-relaxed max-w-xs mx-auto">Ask about the 2024 Player's Handbook updates, conditions, or spell mechanics.</p>
                                    </div>
                                </div>
                            )}
                             {isAskingAi && (
                                <div className="flex items-center justify-center h-full gap-3 text-indigo-400 animate-pulse">
                                    <Sparkles size={20} />
                                    <span className="font-bold">Consulting the ancient tomes...</span>
                                </div>
                            )}
                            {aiResponse && (
                                <div className="bg-stone-800/80 p-5 rounded-xl border border-stone-700 shadow-lg">
                                    <div className="prose prose-invert prose-stone max-w-none leading-relaxed">
                                        <p className="whitespace-pre-wrap">{aiResponse}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-stone-900 border-t border-stone-800 pb-8">
                             <form onSubmit={handleAskRule} className="flex gap-3">
                                <input 
                                    ref={aiInputRef}
                                    type="text" 
                                    value={ruleQuery}
                                    onChange={(e) => setRuleQuery(e.target.value)}
                                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-stone-100 text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-stone-600"
                                    placeholder="Ask a question..."
                                />
                                <button 
                                    type="submit" 
                                    disabled={!ruleQuery.trim() || isAskingAi}
                                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
                                >
                                    <ArrowLeft size={24} className="rotate-180"/>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

// --- Subcomponents for clearer structure ---

const WeaponCard: React.FC<{ weapon: Weapon, onRemove: () => void }> = ({ weapon, onRemove }) => (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-stone-100 font-bold text-lg font-serif">{weapon.name}</span>
                </div>
                <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    {weapon.type}
                </div>
            </div>
            
            <button 
                onClick={onRemove}
                className="text-stone-700 hover:text-red-500 p-2 rounded-lg bg-stone-950/50 -mr-2 -mt-2 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4 pr-8">
            {weapon.properties.map(p => (
                <span key={p} className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800">{p}</span>
            ))}
        </div>

        <div className="bg-stone-950/50 border border-stone-800/50 p-3 rounded-xl flex justify-between items-center gap-3">
            <div className="flex items-start gap-2 max-w-[65%]">
                <div className="mt-0.5">
                    {weapon.damage === '--' ? <Shield size={14} className="text-stone-400"/> : <Zap size={14} className="text-amber-600"/>}
                </div>
                <div>
                    <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-0.5">{weapon.mastery}</span>
                    <p className="text-stone-500 text-[10px] leading-tight line-clamp-2">
                        {MASTERY_DESCRIPTIONS[weapon.mastery]}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xl font-serif font-bold text-stone-200 block">{weapon.damage === '--' ? '+2' : weapon.damage}</span>
                <span className="text-[10px] text-stone-600 font-bold uppercase">{weapon.damage === '--' ? 'DEF' : 'Dmg'}</span>
            </div>
        </div>
    </div>
);

const VitalStat: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center gap-1 w-14">
        <span className="text-[10px] text-stone-500 font-bold tracking-widest">{label}</span>
        <div className="flex items-center gap-1.5">
            {icon}
            <span className="text-xl font-serif font-bold text-stone-200">{value}</span>
        </div>
    </div>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h3 className="text-stone-400 text-xs uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2 pl-1">
        {icon} {title}
    </h3>
);

const Badge: React.FC<{ children: React.ReactNode; color?: 'stone' | 'indigo' }> = ({ children, color = 'stone' }) => {
    if (!children) return null;
    const styles = color === 'indigo' 
        ? "text-indigo-300 bg-indigo-950/40 border-indigo-900/50" 
        : "text-stone-400 bg-stone-900 border-stone-800";
    
    return (
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border whitespace-nowrap ${styles}`}>
            {children}
        </span>
    );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl transition-all w-20 group relative`}
    >
        <div className={`transition-all duration-300 p-1.5 rounded-xl ${active ? 'text-amber-500 -translate-y-2 bg-stone-900 border border-stone-800 shadow-lg' : 'text-stone-500 group-hover:text-stone-300'}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${active ? 'text-amber-500 -translate-y-1 opacity-100' : 'text-stone-600 opacity-0 h-0 overflow-hidden'}`}>
            {label}
        </span>
    </button>
);

export default CharacterSheet;
