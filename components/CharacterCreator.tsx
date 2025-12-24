
import React, { useState, useEffect } from 'react';
import { SPECIES_LIST, CLASS_LIST, BACKGROUNDS_DATA, STANDARD_ARRAY, ABILITY_NAMES, HIT_DIE, CLASS_FEATURES, CLASS_STAT_PRIORITIES, CLASS_DETAILS, SPECIES_DETAILS, ALIGNMENTS, LANGUAGES, CLASS_SKILL_DATA, SKILL_LIST, CLASS_SAVING_THROWS, SPELLCASTING_ABILITY } from '../constants';
import { Character, AbilityScores, Ability, Weapon, Skill, DetailData, BackgroundData } from '../types';
import { generateCharacterName, generateBackstory } from '../services/geminiService';
import { ChevronRight, Save, Sparkles, Loader2, Wand2, X, Check, GraduationCap, Heart, Shield, Zap, Footprints, Ruler, Star, Medal, Sword, Crown, Scroll, Dna } from 'lucide-react';

interface SelectionModalProps {
    title: string;
    options: string[];
    selected: string;
    variant: 'class' | 'species' | 'background' | 'simple';
    onSelect: (value: string) => void;
    onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ title, options, selected, variant, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />
             <div className="bg-stone-900 w-full max-w-lg max-h-[85vh] rounded-2xl border border-stone-800 relative z-10 flex flex-col shadow-2xl animate-in zoom-in-95">
                <div className="p-5 border-b border-stone-800 flex justify-between items-center bg-stone-900 rounded-t-2xl z-20 sticky top-0 shadow-sm">
                    <h3 className="font-bold text-stone-100 text-xl font-serif">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full text-stone-500 hover:text-white transition-colors">
                        <X size={20}/>
                    </button>
                </div>
                <div className="overflow-y-auto p-3 custom-scrollbar flex-1 space-y-2 bg-stone-950/30">
                    {options.map(opt => {
                        const isSelected = selected === opt;
                        
                        // Data Retrieval based on Variant
                        let details: any = {};
                        if (variant === 'class') {
                            details = {
                                desc: CLASS_DETAILS[opt]?.description,
                                hitDie: HIT_DIE[opt],
                                saves: CLASS_SAVING_THROWS[opt],
                                traits: CLASS_DETAILS[opt]?.traits.map(t => t.name).slice(0, 3), // Show first 3 traits
                                primary: CLASS_STAT_PRIORITIES[opt]?.slice(0, 2)
                            };
                        } else if (variant === 'species') {
                            details = {
                                desc: SPECIES_DETAILS[opt]?.description,
                                speed: SPECIES_DETAILS[opt]?.speed,
                                size: SPECIES_DETAILS[opt]?.size,
                                traits: SPECIES_DETAILS[opt]?.traits.map(t => t.name)
                            };
                        } else if (variant === 'background') {
                            const bg = BACKGROUNDS_DATA[opt];
                            details = {
                                desc: bg?.description,
                                scores: bg?.scores,
                                feat: bg?.feat,
                                featDesc: bg?.featDescription,
                                skills: bg?.skills
                            };
                        }

                        return (
                            <button 
                                key={opt}
                                onClick={() => onSelect(opt)}
                                className={`w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${
                                    isSelected 
                                    ? 'bg-stone-800 border-amber-600 ring-1 ring-amber-600/50' 
                                    : 'bg-stone-900 border-stone-800 hover:border-stone-600 hover:bg-stone-800/50'
                                }`}
                            >
                                {/* Active Indicator */}
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600" />}

                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <div>
                                        <div className={`font-bold text-lg font-serif ${isSelected ? 'text-amber-500' : 'text-stone-200 group-hover:text-stone-100'}`}>
                                            {opt}
                                        </div>
                                        <div className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{details.desc}</div>
                                    </div>
                                    {isSelected && <Check size={20} className="text-amber-500 shrink-0" />}
                                </div>

                                {/* Rich Details Grid */}
                                <div className="pl-2 mt-3 grid grid-cols-1 gap-2">
                                    {variant === 'class' && (
                                        <>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="flex items-center gap-1 bg-red-950/30 text-red-400 px-2 py-1 rounded border border-red-900/30 font-bold" title="Hit Die">
                                                    <Heart size={12} fill="currentColor" className="opacity-50"/> d{details.hitDie}
                                                </span>
                                                <span className="flex items-center gap-1 bg-indigo-950/30 text-indigo-400 px-2 py-1 rounded border border-indigo-900/30 font-bold" title="Saving Throws">
                                                    <Shield size={12}/> {details.saves.join('/')}
                                                </span>
                                                <span className="flex items-center gap-1 bg-amber-950/30 text-amber-500 px-2 py-1 rounded border border-amber-900/30 font-bold" title="Primary Stats">
                                                    <Star size={12}/> {details.primary.join('/')}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-stone-500 mt-1">
                                                <strong className="text-stone-400">Features:</strong> {details.traits.join(', ')}...
                                            </div>
                                        </>
                                    )}

                                    {variant === 'species' && (
                                        <>
                                            <div className="flex gap-2 text-xs">
                                                <span className="flex items-center gap-1 bg-stone-950 text-stone-400 px-2 py-1 rounded border border-stone-800 font-bold">
                                                    <Footprints size={12}/> {details.speed} ft
                                                </span>
                                                <span className="flex items-center gap-1 bg-stone-950 text-stone-400 px-2 py-1 rounded border border-stone-800 font-bold">
                                                    <Ruler size={12}/> {details.size}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-stone-500 mt-1 flex flex-wrap gap-1">
                                                {details.traits.map((t: string) => (
                                                    <span key={t} className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-400">{t}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {variant === 'background' && (
                                        <>
                                            <div className="flex flex-wrap gap-2 text-xs mb-2">
                                                <span className="flex items-center gap-1 bg-amber-950/30 text-amber-500 px-2 py-1 rounded border border-amber-900/30 font-bold">
                                                    <Zap size={12}/> {details.scores.join('/')}
                                                </span>
                                                <span className="flex items-center gap-1 bg-purple-950/30 text-purple-400 px-2 py-1 rounded border border-purple-900/30 font-bold">
                                                    <Medal size={12}/> {details.feat}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-stone-500 mb-2 leading-relaxed italic border-l-2 border-stone-800 pl-2">
                                                {details.featDesc}
                                            </div>
                                            <div className="text-[10px] text-stone-500">
                                                <strong className="text-stone-400">Skills:</strong> {details.skills.join(', ')}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
             </div>
        </div>
    );
};

interface CharacterCreatorProps {
    onSave: (character: Character) => void;
    onCancel: () => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onSave, onCancel }) => {
    const [step, setStep] = useState(1);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [species, setSpecies] = useState(SPECIES_LIST[0]);
    const [charClass, setCharClass] = useState(CLASS_LIST[0]);
    const [background, setBackground] = useState(Object.keys(BACKGROUNDS_DATA)[0]);
    const [scores, setScores] = useState<AbilityScores>({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
    const [initialNote, setInitialNote] = useState('');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    
    // Details State (Step 3)
    const [alignment, setAlignment] = useState(ALIGNMENTS[4]); // True Neutral default
    const [language, setLanguage] = useState(LANGUAGES[0]); // Common default

    // Proficiency State (Step 4)
    const [selectedClassSkills, setSelectedClassSkills] = useState<Skill[]>([]);

    // Modal State
    const [activeModal, setActiveModal] = useState<'class' | 'species' | 'background' | 'alignment' | 'language' | null>(null);

    // Ability Score Allocation State
    const [scoreMethod, setScoreMethod] = useState<'standard' | 'manual'>('standard');
    const [scoreAllocation, setScoreAllocation] = useState<(number | null)[]>([...STANDARD_ARRAY]);
    const [assignedScores, setAssignedScores] = useState<Record<Ability, number | null>>({
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
    });

    const currentBackgroundData = BACKGROUNDS_DATA[background];
    const currentClassData = CLASS_DETAILS[charClass];
    const currentSpeciesData = SPECIES_DETAILS[species];
    const currentClassSkills = CLASS_SKILL_DATA[charClass];

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    // Reset selections when class/background changes
    useEffect(() => {
        setSelectedClassSkills([]);
    }, [charClass, background]);

    const handleGenerateNames = async () => {
        setIsLoadingAI(true);
        const names = await generateCharacterName(species, charClass);
        setSuggestedNames(names);
        setIsLoadingAI(false);
    };

    const handleGenerateBackstory = async () => {
        setIsLoadingAI(true);
        const story = await generateBackstory(name, species, charClass, background);
        setInitialNote(story);
        setIsLoadingAI(false);
    };

    const handleAutoAssign = () => {
        const priorities = CLASS_STAT_PRIORITIES[charClass];
        if (!priorities) return;

        const newAssigned: any = {};
        priorities.forEach((ability, index) => {
            if (index < STANDARD_ARRAY.length) {
                newAssigned[ability] = STANDARD_ARRAY[index];
            }
        });

        setScoreMethod('standard');
        setAssignedScores(newAssigned);
        setScoreAllocation([]); 
    };

    const assignScore = (ability: Ability, value: number) => {
        const previousValue = assignedScores[ability];
        const newAllocation = [...scoreAllocation];
        const valIndex = newAllocation.indexOf(value);
        if (valIndex > -1) newAllocation.splice(valIndex, 1);
        if (previousValue !== null) {
            newAllocation.push(previousValue);
            newAllocation.sort((a, b) => (b || 0) - (a || 0));
        }
        setScoreAllocation(newAllocation);
        setAssignedScores(prev => ({ ...prev, [ability]: value }));
    };

    const handleManualScoreChange = (ability: Ability, value: string) => {
        const numVal = parseInt(value) || 0;
        setAssignedScores(prev => ({ ...prev, [ability]: numVal }));
    };

    const toggleClassSkill = (skill: Skill) => {
        if (selectedClassSkills.includes(skill)) {
            setSelectedClassSkills(prev => prev.filter(s => s !== skill));
        } else {
            if (selectedClassSkills.length < currentClassSkills.count) {
                setSelectedClassSkills(prev => [...prev, skill]);
            }
        }
    };
    
    useEffect(() => {
        const newScores = { ...scores };
        (Object.keys(assignedScores) as Ability[]).forEach(key => {
            if (assignedScores[key] !== null) {
                newScores[key] = assignedScores[key] as number;
            }
        });
        setScores(newScores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedScores]);

    const getBackgroundAdjustedScore = (ability: Ability, baseScore: number) => {
        if (!currentBackgroundData) return baseScore;
        const bgScores = currentBackgroundData.scores;
        if (bgScores[0] === ability) return baseScore + 2;
        if (bgScores[1] === ability) return baseScore + 1;
        return baseScore;
    };

    const finishCreation = () => {
        const mod = (score: number) => Math.floor((score - 10) / 2);
        
        const finalScores: AbilityScores = { ...scores };
        (Object.keys(finalScores) as Ability[]).forEach(key => {
             finalScores[key] = getBackgroundAdjustedScore(key, scores[key]);
        });

        const conMod = mod(finalScores.CON);
        const dexMod = mod(finalScores.DEX);
        const wisMod = mod(finalScores.WIS);

        // Calculate Initial AC with Unarmored Defense Logic
        let initialAC = 10 + dexMod;
        if (charClass === 'Barbarian') {
            initialAC = 10 + dexMod + conMod;
        } else if (charClass === 'Monk') {
            initialAC = 10 + dexMod + wisMod;
        }

        const finalWeapons: Weapon[] = []; // No weapons selected at creation
        const finalEquipment: string[] = [
            ...(currentBackgroundData.equipment || []),
            "Backpack", 
            "Bedroll", 
            "Rations (5)"
        ];

        const languages = Array.from(new Set(['Common', language]));
        
        // Combine Skills
        const finalSkills = [...currentBackgroundData.skills, ...selectedClassSkills];
        const spellcastingAbility = SPELLCASTING_ABILITY[charClass];

        const newCharacter: Character = {
            id: crypto.randomUUID(),
            name: name || 'Unnamed Hero',
            species,
            class: charClass,
            level: 1,
            background,
            alignment,
            size: currentSpeciesData.size || 'Medium',
            abilityScores: finalScores,
            maxHp: HIT_DIE[charClass] + conMod,
            currentHp: HIT_DIE[charClass] + conMod,
            tempHp: 0,
            armorClass: initialAC,
            speed: currentSpeciesData.speed || 30,
            initiative: dexMod,
            proficiencyBonus: 2,
            skills: finalSkills, 
            weapons: finalWeapons,
            equipment: finalEquipment, 
            languages,
            notes: initialNote ? [{ id: crypto.randomUUID(), title: 'Character Backstory', content: initialNote }] : [],
            features: CLASS_FEATURES[charClass] || [],
            originFeat: currentBackgroundData.feat,
            currentFocusPoints: charClass === 'Monk' ? 1 : undefined,
            spellcasting: spellcastingAbility ? {
                ability: spellcastingAbility,
                slots: {},
                known: [],
            } : undefined,
        };
        onSave(newCharacter);
    };

    return (
        <div className="min-h-screen bg-stone-900 pb-32 flex flex-col font-sans relative">
            {/* Sticky Header with Safe Area Padding */}
            <div className="sticky top-0 z-30 bg-stone-950 px-6 pb-6 pt-[calc(1.5rem_+_env(safe-area-inset-top))] border-b border-stone-800 flex justify-between items-center shadow-lg">
                <h2 className="text-xl font-serif font-bold text-amber-500">New Character</h2>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`w-2 h-2 rounded-full transition-colors ${step >= s ? 'bg-amber-600' : 'bg-stone-800'}`} />
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
                
                {/* Step 1: Class & Origin */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                        {/* Name Input */}
                         <div>
                            <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider">Name</label>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-stone-950 border border-stone-800 text-stone-100 rounded-xl p-4 text-lg focus:ring-1 focus:ring-amber-600 focus:outline-none placeholder-stone-700"
                                    placeholder="Enter character name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button 
                                    onClick={handleGenerateNames}
                                    disabled={isLoadingAI}
                                    className="bg-stone-800 hover:bg-stone-700 text-amber-500 px-4 rounded-xl transition-colors disabled:opacity-50 border border-stone-700"
                                >
                                    {isLoadingAI ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24}/>}
                                </button>
                            </div>
                            {suggestedNames.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {suggestedNames.map(n => (
                                        <button key={n} onClick={() => setName(n)} className="text-sm bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 px-3 py-1.5 rounded-lg transition-colors">{n}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Class Selection */}
                             <div>
                                <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Crown size={12}/> Class
                                </label>
                                <button
                                    onClick={() => setActiveModal('class')}
                                    className="w-full bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left rounded-xl p-4 flex justify-between items-center group transition-all"
                                >
                                    <div>
                                        <div className="text-xl font-bold text-stone-200 font-serif mb-1">{charClass}</div>
                                        <div className="text-xs text-stone-500">{currentClassData?.description}</div>
                                    </div>
                                    <ChevronRight className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>

                            {/* Species Selection */}
                            <div>
                                <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Dna size={12}/> Species
                                </label>
                                <button
                                    onClick={() => setActiveModal('species')}
                                    className="w-full bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left rounded-xl p-4 flex justify-between items-center group transition-all"
                                >
                                    <div>
                                        <div className="text-xl font-bold text-stone-200 font-serif mb-1">{species}</div>
                                        <div className="text-xs text-stone-500">{currentSpeciesData?.description}</div>
                                    </div>
                                    <ChevronRight className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Background Selection */}
                        <div>
                            <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                <Scroll size={12}/> Background
                            </label>
                            <button
                                onClick={() => setActiveModal('background')}
                                className="w-full bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left rounded-xl p-4 flex justify-between items-center group transition-all mb-4"
                            >
                                <div>
                                    <div className="text-xl font-bold text-stone-200 font-serif mb-1">{background}</div>
                                    <div className="text-xs text-stone-500">
                                        Feat: <span className="text-indigo-400">{currentBackgroundData.feat}</span>
                                    </div>
                                </div>
                                <ChevronRight className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                                    <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block mb-1">Boosts</span>
                                    <span className="text-amber-500 font-bold">{BACKGROUNDS_DATA[background].scores.join(', ')}</span>
                                </div>
                                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                                    <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block mb-1">Origin Feat</span>
                                    <span className="text-indigo-400 font-bold block mb-1">{BACKGROUNDS_DATA[background].feat}</span>
                                    <span className="text-xs text-stone-500 leading-snug block">{BACKGROUNDS_DATA[background].featDescription}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Ability Scores */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-xl font-bold text-stone-200">Ability Scores</h3>
                             <button 
                                onClick={handleAutoAssign}
                                className="bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors font-bold"
                            >
                                <Wand2 size={16}/> Auto-Assign
                            </button>
                        </div>
                        
                        <div className="flex gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800 mb-6">
                            <button 
                                onClick={() => setScoreMethod('standard')}
                                className={`flex-1 py-2 text-sm rounded-lg font-bold transition-colors ${scoreMethod === 'standard' ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                                Standard Array
                            </button>
                            <button 
                                onClick={() => {
                                    setScoreMethod('manual');
                                    setAssignedScores({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
                                }}
                                className={`flex-1 py-2 text-sm rounded-lg font-bold transition-colors ${scoreMethod === 'manual' ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                                Manual / Rolled
                            </button>
                        </div>

                        {scoreMethod === 'standard' && (
                            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                {scoreAllocation.map((val, idx) => (
                                    <div key={idx} className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center font-bold text-xl text-stone-300 border border-stone-700">
                                        {val}
                                    </div>
                                ))}
                                {scoreAllocation.length === 0 && <span className="text-stone-500 text-sm font-medium py-3">All scores assigned!</span>}
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(Object.keys(ABILITY_NAMES) as Ability[]).map(ability => {
                                const isBoosted = currentBackgroundData.scores.includes(ability);
                                return (
                                <div key={ability} className={`p-4 rounded-xl border relative ${isBoosted ? 'bg-amber-950/10 border-amber-900/30' : 'bg-stone-950/50 border-stone-800'}`}>
                                    {isBoosted && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-600"></div>}
                                    <label className="block text-stone-500 font-bold text-xs uppercase tracking-widest mb-2">{ability}</label>
                                    
                                    {scoreMethod === 'standard' ? (
                                        <select 
                                            className="w-full bg-stone-900 border border-stone-700 text-stone-200 rounded-lg p-2 text-lg font-bold focus:ring-1 focus:ring-amber-600"
                                            onChange={(e) => {
                                                const val = e.target.value ? parseInt(e.target.value) : 0;
                                                if (val) assignScore(ability, val);
                                            }}
                                            value={assignedScores[ability] || ''}
                                        >
                                            <option value="" disabled>-</option>
                                            {assignedScores[ability] && (
                                                <option value={assignedScores[ability]!}>{assignedScores[ability]}</option>
                                            )}
                                            {scoreAllocation.map((s, i) => (
                                                <option key={`${s}-${i}`} value={s!}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="20"
                                            className="w-full bg-stone-900 border border-stone-700 text-stone-200 rounded-lg p-2 text-lg font-bold text-center focus:ring-1 focus:ring-amber-600"
                                            value={assignedScores[ability] || ''}
                                            onChange={(e) => handleManualScoreChange(ability, e.target.value)}
                                        />
                                    )}
                                </div>
                            )})}
                        </div>
                    </div>
                )}

                {/* Step 3: Details (Alignment, Languages, Notes) */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Alignment Selection */}
                            <div>
                                <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider">Alignment</label>
                                <button
                                    onClick={() => setActiveModal('alignment')}
                                    className="w-full bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left rounded-xl p-4 flex justify-between items-center group transition-all"
                                >
                                    <div className="text-xl font-bold text-stone-200 font-serif">{alignment}</div>
                                    <ChevronRight className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>
                            
                            {/* Language Selection */}
                            <div>
                                <label className="block text-stone-400 font-bold mb-2 uppercase text-xs tracking-wider">Extra Language</label>
                                <button
                                    onClick={() => setActiveModal('language')}
                                    className="w-full bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left rounded-xl p-4 flex justify-between items-center group transition-all"
                                >
                                    <div>
                                        <div className="text-xl font-bold text-stone-200 font-serif">{language}</div>
                                        <div className="text-xs text-stone-500">Plus: Common</div>
                                    </div>
                                    <ChevronRight className="text-stone-500 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                 <label className="text-stone-400 font-bold uppercase text-xs tracking-wider">Notes</label>
                                 <button 
                                    onClick={handleGenerateBackstory}
                                    disabled={isLoadingAI || !name}
                                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1.5 transition-colors font-bold disabled:opacity-50"
                                >
                                    {isLoadingAI ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                                    Generate Backstory
                                </button>
                            </div>
                            <textarea 
                                className="w-full h-64 bg-stone-950 border border-stone-800 text-stone-300 rounded-xl p-5 text-lg leading-relaxed focus:ring-1 focus:ring-amber-600 focus:outline-none"
                                placeholder="Once upon a time..."
                                value={initialNote}
                                onChange={(e) => setInitialNote(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Proficiencies Selection */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <h3 className="text-xl font-bold text-stone-200 flex items-center gap-2">
                            <GraduationCap size={20}/> Proficiencies
                        </h3>
                        
                        {/* Background Skills (Fixed) */}
                        <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block mb-2">Background Skills ({background})</span>
                            <div className="flex flex-wrap gap-2">
                                {currentBackgroundData.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-amber-950/30 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-900/40 flex items-center gap-1">
                                        <Check size={12}/> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                         {/* Class Skill Choices */}
                         <div className="bg-stone-900 p-5 rounded-xl border border-stone-700">
                            <div className="flex justify-between items-end mb-3">
                                 <label className="text-stone-400 font-bold text-xs uppercase tracking-wider">
                                    Class Skills ({charClass})
                                 </label>
                                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedClassSkills.length === currentClassSkills.count ? 'bg-green-900 text-green-300' : 'bg-stone-800 text-stone-400'}`}>
                                    Selected: {selectedClassSkills.length} / {currentClassSkills.count}
                                 </span>
                            </div>
                             
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                 {/* Determine available options: Either 'Any' or specific list */}
                                 {(currentClassSkills.options === 'Any' ? SKILL_LIST : currentClassSkills.options).map(skill => {
                                     // Check if skill is already granted by background
                                     const isBackgroundSkill = currentBackgroundData.skills.includes(skill);
                                     const isSelected = selectedClassSkills.includes(skill);
                                     const isDisabled = isBackgroundSkill || (!isSelected && selectedClassSkills.length >= currentClassSkills.count);

                                     if (isBackgroundSkill) return null; // Or render disabled state

                                     return (
                                         <label 
                                            key={skill}
                                            className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all select-none
                                                ${isSelected ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-stone-950 border-stone-800'}
                                                ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:border-stone-600'}
                                            `}
                                         >
                                             <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                disabled={isDisabled}
                                                onChange={() => toggleClassSkill(skill)}
                                                className="w-4 h-4 text-indigo-500 rounded focus:ring-indigo-500 border-stone-600 bg-stone-900"
                                             />
                                             <span className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-stone-400'}`}>{skill}</span>
                                         </label>
                                     );
                                 })}
                             </div>
                             {currentClassSkills.options === 'Any' && (
                                 <p className="text-xs text-stone-500 mt-2 italic">Bards may choose any skills not already provided by their background.</p>
                             )}
                         </div>
                    </div>
                )}

                 {/* Step 5: Review */}
                 {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="bg-stone-900 rounded-2xl p-8 border border-stone-800 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center text-4xl font-serif text-amber-500 mb-4 shadow-inner border border-stone-700">
                                {name.charAt(0)}
                            </div>
                            <h4 className="text-3xl font-bold text-stone-100 font-serif mb-1">{name}</h4>
                            <p className="text-stone-500 text-lg mb-4">{species} {charClass} (Lvl 1)</p>
                            
                            <div className="flex gap-2 mb-6">
                                <span className="bg-stone-950 px-3 py-1 rounded-lg text-sm text-stone-400 border border-stone-800 font-bold">{background}</span>
                                <span className="bg-stone-950 px-3 py-1 rounded-lg text-sm text-stone-400 border border-stone-800 font-bold">{alignment}</span>
                            </div>

                            <div className="grid grid-cols-6 gap-2 w-full max-w-md mb-6">
                                {(Object.keys(scores) as Ability[]).map(key => {
                                    const base = scores[key];
                                    const final = getBackgroundAdjustedScore(key, base);
                                    const boosted = final > base;
                                    return (
                                    <div key={key} className={`p-2 rounded-lg text-center flex flex-col items-center ${boosted ? 'bg-amber-950/20' : 'bg-stone-950/50'}`}>
                                        <div className="text-[10px] text-stone-600 font-bold uppercase mb-1">{key}</div>
                                        <div className={`text-xl font-bold font-serif ${boosted ? 'text-amber-500' : 'text-stone-300'}`}>{final}</div>
                                    </div>
                                )})}
                            </div>

                            <div className="w-full bg-stone-950/50 rounded-xl p-4 border border-stone-800 text-left mb-4">
                                <h5 className="text-stone-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <GraduationCap size={14}/> Skills
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {[...currentBackgroundData.skills, ...selectedClassSkills].map(s => (
                                        <span key={s} className="text-xs bg-stone-900 text-stone-300 px-2 py-1 rounded border border-stone-700">{s}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/30 text-center">
                                <p className="text-sm text-stone-500 italic">Weapons and Armor can be equipped on your Character Sheet.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Navigation (Fixed Bottom) with Safe Area Padding */}
            <div className="fixed bottom-0 w-full bg-stone-950 px-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] pt-4 border-t border-stone-800 flex justify-between gap-4 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                <button 
                    onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white py-4 rounded-xl font-bold transition-colors border border-stone-800"
                >
                    {step === 1 ? 'Cancel' : 'Back'}
                </button>

                {step < 5 ? (
                    <button 
                        onClick={() => setStep(s => s + 1)}
                        className="flex-[2] bg-stone-100 hover:bg-white text-stone-950 py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Next <ChevronRight size={20}/>
                    </button>
                ) : (
                    <button 
                        onClick={finishCreation}
                        className="flex-[2] bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
                    >
                        <Save size={20}/> Create
                    </button>
                )}
            </div>

            {/* --- SELECTION MODALS --- */}
            {activeModal === 'class' && (
                <SelectionModal 
                    title="Choose Class"
                    options={CLASS_LIST}
                    selected={charClass}
                    variant="class"
                    onSelect={(val) => { setCharClass(val); setActiveModal(null); }}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'species' && (
                <SelectionModal 
                    title="Choose Species"
                    options={SPECIES_LIST}
                    selected={species}
                    variant="species"
                    onSelect={(val) => { setSpecies(val); setActiveModal(null); }}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'background' && (
                <SelectionModal 
                    title="Choose Background"
                    options={Object.keys(BACKGROUNDS_DATA)}
                    selected={background}
                    variant="background"
                    onSelect={(val) => { setBackground(val); setActiveModal(null); }}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'alignment' && (
                <SelectionModal 
                    title="Choose Alignment"
                    options={ALIGNMENTS}
                    selected={alignment}
                    variant="simple"
                    onSelect={(val) => { setAlignment(val); setActiveModal(null); }}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'language' && (
                <SelectionModal 
                    title="Choose Additional Language"
                    options={LANGUAGES}
                    selected={language}
                    variant="simple"
                    onSelect={(val) => { setLanguage(val); setActiveModal(null); }}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div>
    );
};

export default CharacterCreator;
