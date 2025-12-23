
import React, { useState, useEffect } from 'react';
import { SPECIES_LIST, CLASS_LIST, BACKGROUNDS_DATA, STANDARD_ARRAY, ABILITY_NAMES, HIT_DIE, CLASS_FEATURES, STARTING_WEAPONS, CLASS_STAT_PRIORITIES } from '../constants';
import { Character, AbilityScores, Ability, Weapon } from '../types';
import { generateCharacterName, generateBackstory } from '../services/geminiService';
import { ChevronRight, ChevronLeft, Save, Sparkles, Loader2, Info, Dices, Keyboard, Wand2 } from 'lucide-react';

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
    const [backstory, setBackstory] = useState('');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    
    // Ability Score Allocation State
    const [scoreMethod, setScoreMethod] = useState<'standard' | 'manual'>('standard');
    const [scoreAllocation, setScoreAllocation] = useState<(number | null)[]>([...STANDARD_ARRAY]);
    const [assignedScores, setAssignedScores] = useState<Record<Ability, number | null>>({
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
    });

    // 2024 Rule: Background boosts stats
    const currentBackgroundData = BACKGROUNDS_DATA[background];

    const handleGenerateNames = async () => {
        setIsLoadingAI(true);
        const names = await generateCharacterName(species, charClass);
        setSuggestedNames(names);
        setIsLoadingAI(false);
    };

    const handleGenerateBackstory = async () => {
        setIsLoadingAI(true);
        const story = await generateBackstory(name, species, charClass, background);
        setBackstory(story);
        setIsLoadingAI(false);
    };

    // Auto-Assign scores based on class recommendations
    const handleAutoAssign = () => {
        const priorities = CLASS_STAT_PRIORITIES[charClass];
        if (!priorities) return;

        const newAssigned: any = {};
        // Assign standard array (15, 14, 13...) to priorities in order
        priorities.forEach((ability, index) => {
            if (index < STANDARD_ARRAY.length) {
                newAssigned[ability] = STANDARD_ARRAY[index];
            }
        });

        setScoreMethod('standard');
        setAssignedScores(newAssigned);
        setScoreAllocation([]); // All used
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

    // Apply 2024 Background Bonus Logic (+2 to one, +1 to another OR +1 to three)
    const getBackgroundAdjustedScore = (ability: Ability, baseScore: number) => {
        if (!currentBackgroundData) return baseScore;
        const bgScores = currentBackgroundData.scores;
        if (bgScores[0] === ability) return baseScore + 2;
        if (bgScores[1] === ability) return baseScore + 1;
        return baseScore;
    };

    const finishCreation = () => {
        const mod = (score: number) => Math.floor((score - 10) / 2);
        
        // Calculate final scores with background bonuses
        const finalScores: AbilityScores = { ...scores };
        (Object.keys(finalScores) as Ability[]).forEach(key => {
             finalScores[key] = getBackgroundAdjustedScore(key, scores[key]);
        });

        const conMod = mod(finalScores.CON);
        const dexMod = mod(finalScores.DEX);

        // Assign starting weapons based on class (Simplified)
        let startingWeapons: Weapon[] = [];
        if (['Fighter', 'Paladin', 'Barbarian', 'Ranger'].includes(charClass)) {
            startingWeapons = [STARTING_WEAPONS['Greatsword'], STARTING_WEAPONS['Longbow']];
        } else if (['Rogue', 'Bard', 'Monk'].includes(charClass)) {
             startingWeapons = [STARTING_WEAPONS['Shortsword'], STARTING_WEAPONS['Dagger']];
        } else {
             startingWeapons = [STARTING_WEAPONS['Quarterstaff'], STARTING_WEAPONS['Light Crossbow']];
        }

        const newCharacter: Character = {
            id: crypto.randomUUID(),
            name: name || 'Unnamed Hero',
            species,
            class: charClass,
            level: 1,
            background,
            abilityScores: finalScores,
            maxHp: HIT_DIE[charClass] + conMod,
            currentHp: HIT_DIE[charClass] + conMod,
            tempHp: 0,
            armorClass: 10 + dexMod, 
            speed: 30,
            initiative: dexMod,
            proficiencyBonus: 2,
            skills: [], 
            weapons: startingWeapons,
            equipment: ['Backpack', 'Rations (5 days)', 'Waterskin', 'Bedroll'],
            backstory,
            features: CLASS_FEATURES[charClass] || [],
            originFeat: currentBackgroundData.feat
        };
        onSave(newCharacter);
    };

    return (
        <div className="max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-stone-950 p-6 border-b border-stone-800 flex justify-between items-center">
                <h2 className="text-2xl font-serif text-amber-500">Character Creator (2024 Rules)</h2>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-amber-600' : 'bg-stone-700'}`} />
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">
                
                {/* Step 1: Class & Origin */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Class Selection */}
                             <div>
                                <label className="block text-amber-500 font-bold mb-2 font-serif text-lg">Class</label>
                                <select 
                                    className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                    value={charClass}
                                    onChange={(e) => setCharClass(e.target.value)}
                                >
                                    {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="mt-3 text-sm text-stone-400 bg-stone-950/50 p-3 rounded border border-stone-800">
                                    <p className="font-bold text-stone-300 mb-1">Level 1 Features:</p>
                                    <ul className="list-disc list-inside">
                                        {CLASS_FEATURES[charClass]?.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                </div>
                            </div>

                            {/* Background Selection (Crucial for 2024 Stats) */}
                            <div>
                                <label className="block text-amber-500 font-bold mb-2 font-serif text-lg">Background</label>
                                <select 
                                    className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                    value={background}
                                    onChange={(e) => setBackground(e.target.value)}
                                >
                                    {Object.keys(BACKGROUNDS_DATA).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <div className="mt-3 text-sm text-stone-400 bg-stone-950/50 p-3 rounded border border-stone-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-stone-300 font-bold">Ability Boosts:</span>
                                        <span className="text-amber-400">{BACKGROUNDS_DATA[background].scores.join(', ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-300 font-bold">Origin Feat:</span>
                                        <span className="text-indigo-400">{BACKGROUNDS_DATA[background].feat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Species & Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-stone-400 mb-2">Species</label>
                                <select 
                                    className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                    value={species}
                                    onChange={(e) => setSpecies(e.target.value)}
                                >
                                    {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-stone-400 mb-2">Name</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                        placeholder="Enter name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleGenerateNames}
                                        disabled={isLoadingAI}
                                        className="bg-stone-700 hover:bg-stone-600 text-white px-3 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isLoadingAI ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                                    </button>
                                </div>
                                {suggestedNames.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {suggestedNames.map(n => (
                                            <button key={n} onClick={() => setName(n)} className="text-xs bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-600 px-2 py-1 rounded-full transition-colors">{n}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Ability Scores */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                            <h3 className="text-xl text-stone-200 font-bold">Assign Scores</h3>
                            <div className="flex gap-2 bg-stone-900 p-1 rounded-lg border border-stone-800">
                                <button 
                                    onClick={() => setScoreMethod('standard')}
                                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${scoreMethod === 'standard' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
                                >
                                    <Dices size={16}/> Standard Array
                                </button>
                                <button 
                                    onClick={() => {
                                        setScoreMethod('manual');
                                        setAssignedScores({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
                                    }}
                                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${scoreMethod === 'manual' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
                                >
                                    <Keyboard size={16}/> Manual / Rolled
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-stone-800 p-4 rounded-lg mb-6 border border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4">
                            {scoreMethod === 'standard' ? (
                                <div className="flex-1">
                                    <p className="text-stone-400 mb-2 text-sm uppercase tracking-wider font-bold">Available Scores</p>
                                    <div className="flex flex-wrap gap-3">
                                        {scoreAllocation.map((val, idx) => (
                                            <div key={idx} className="w-10 h-10 bg-stone-700 rounded flex items-center justify-center font-bold text-amber-500 shadow-inner border border-stone-600">
                                                {val}
                                            </div>
                                        ))}
                                        {scoreAllocation.length === 0 && <span className="text-stone-500 italic">All assigned!</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <p className="text-stone-300 text-sm">Enter the scores you rolled or calculated using Point Buy.</p>
                                </div>
                            )}

                            <button 
                                onClick={handleAutoAssign}
                                className="bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-200 border border-indigo-700/50 px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                            >
                                <Wand2 size={16}/> Auto-Assign Best
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(Object.keys(ABILITY_NAMES) as Ability[]).map(ability => {
                                const isBoosted = currentBackgroundData.scores.includes(ability);
                                return (
                                <div key={ability} className={`p-4 rounded border ${isBoosted ? 'bg-stone-800/80 border-amber-900/50' : 'bg-stone-900 border-stone-800'}`}>
                                    <div className="flex justify-between mb-1">
                                        <label className="block text-stone-500 font-bold">{ABILITY_NAMES[ability]}</label>
                                        {isBoosted && <span className="text-xs text-amber-500 font-bold bg-amber-900/30 px-1.5 py-0.5 rounded">Boosted</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold w-12 text-center text-white">
                                            {assignedScores[ability] || '--'}
                                        </div>
                                        
                                        {scoreMethod === 'standard' ? (
                                            <select 
                                                className="flex-1 bg-stone-950 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:ring-1 focus:ring-amber-600"
                                                onChange={(e) => {
                                                    const val = e.target.value ? parseInt(e.target.value) : 0;
                                                    if (val) assignScore(ability, val);
                                                }}
                                                value={assignedScores[ability] || ''}
                                            >
                                                <option value="" disabled>Assign...</option>
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
                                                className="flex-1 bg-stone-950 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:ring-1 focus:ring-amber-600"
                                                value={assignedScores[ability] || ''}
                                                onChange={(e) => handleManualScoreChange(ability, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            )})}
                        </div>
                         <div className="text-sm text-stone-500 text-center mt-2 italic">
                            *Background bonuses will be applied in the final review.
                        </div>
                    </div>
                )}

                {/* Step 3: Backstory (Same as before) */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl text-stone-200 font-bold mb-4 border-b border-stone-700 pb-2">Backstory</h3>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-stone-400 text-sm">Let the stars guide your history.</p>
                            <button 
                                onClick={handleGenerateBackstory}
                                disabled={isLoadingAI || !name}
                                className="bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-200 border border-indigo-700/50 px-3 py-1.5 text-sm rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoadingAI ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                                Generate with Gemini
                            </button>
                        </div>
                        <textarea 
                            className="w-full h-64 bg-stone-800 border border-stone-700 text-stone-200 rounded p-4 focus:ring-2 focus:ring-amber-600 focus:outline-none leading-relaxed"
                            placeholder="Once upon a time..."
                            value={backstory}
                            onChange={(e) => setBackstory(e.target.value)}
                        />
                    </div>
                )}

                 {/* Step 4: Review */}
                 {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl text-stone-200 font-bold mb-4 border-b border-stone-700 pb-2">Review Character</h3>
                        
                        <div className="bg-stone-800 rounded p-6 border border-stone-700 grid gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center text-2xl font-serif text-amber-500">
                                    {name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white font-serif">{name}</h4>
                                    <p className="text-stone-400">{species} {charClass} (Level 1)</p>
                                    <p className="text-amber-500 text-sm font-bold">{background} • {currentBackgroundData.feat}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                                {(Object.keys(scores) as Ability[]).map(key => {
                                    // Calculate preview of final score
                                    const base = scores[key];
                                    const final = getBackgroundAdjustedScore(key, base);
                                    const boosted = final > base;
                                    return (
                                    <div key={key} className={`p-2 rounded text-center border ${boosted ? 'bg-amber-900/20 border-amber-800/50' : 'bg-stone-900 border-stone-800'}`}>
                                        <div className="text-xs text-stone-500 font-bold">{key}</div>
                                        <div className={`text-lg font-bold ${boosted ? 'text-amber-400' : 'text-white'}`}>{final}</div>
                                    </div>
                                )})}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Navigation */}
            <div className="bg-stone-950 p-6 border-t border-stone-800 flex justify-between">
                <button 
                    onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}
                    className="text-stone-400 hover:text-white px-4 py-2 flex items-center gap-2"
                >
                    {step === 1 ? 'Cancel' : <><ChevronLeft size={18}/> Back</>}
                </button>

                {step < 4 ? (
                    <button 
                        onClick={() => setStep(s => s + 1)}
                        className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-colors border border-stone-600"
                    >
                        Next <ChevronRight size={18}/>
                    </button>
                ) : (
                    <button 
                        onClick={finishCreation}
                        className="bg-amber-700 hover:bg-amber-600 text-white px-8 py-2 rounded flex items-center gap-2 transition-colors font-bold shadow-lg shadow-amber-900/20"
                    >
                        <Save size={18}/> Create Character
                    </button>
                )}
            </div>
        </div>
    );
};

export default CharacterCreator;
