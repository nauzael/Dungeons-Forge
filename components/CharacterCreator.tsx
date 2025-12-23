import React, { useState, useEffect } from 'react';
import { SPECIES_LIST, CLASS_LIST, BACKGROUND_LIST, STANDARD_ARRAY, ABILITY_NAMES, HIT_DIE, CLASS_FEATURES } from '../constants';
import { Character, AbilityScores, Ability } from '../types';
import { generateCharacterName, generateBackstory } from '../services/geminiService';
import { ChevronRight, ChevronLeft, Save, Sparkles, Loader2, Dice5 } from 'lucide-react';

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
    const [background, setBackground] = useState(BACKGROUND_LIST[0]);
    const [scores, setScores] = useState<AbilityScores>({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
    const [backstory, setBackstory] = useState('');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    
    // Ability Score Allocation State
    const [scoreAllocation, setScoreAllocation] = useState<(number | null)[]>([...STANDARD_ARRAY]);
    const [assignedScores, setAssignedScores] = useState<Record<Ability, number | null>>({
        STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
    });

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

    const assignScore = (ability: Ability, value: number) => {
        // If this ability already had a value, return it to the pool
        const previousValue = assignedScores[ability];
        
        // Remove the new value from the pool
        const newAllocation = [...scoreAllocation];
        const valIndex = newAllocation.indexOf(value);
        if (valIndex > -1) {
            newAllocation.splice(valIndex, 1);
        }

        // Add previous value back if exists
        if (previousValue !== null) {
            newAllocation.push(previousValue);
            newAllocation.sort((a, b) => (b || 0) - (a || 0));
        }

        setScoreAllocation(newAllocation);
        setAssignedScores(prev => ({ ...prev, [ability]: value }));
    };
    
    // Auto-fill assigned scores to final scores object when changed
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


    const finishCreation = () => {
        const mod = (score: number) => Math.floor((score - 10) / 2);
        const conMod = mod(scores.CON);
        const dexMod = mod(scores.DEX);

        const newCharacter: Character = {
            id: crypto.randomUUID(),
            name: name || 'Unnamed Hero',
            species,
            class: charClass,
            level: 1,
            background,
            abilityScores: scores,
            maxHp: HIT_DIE[charClass] + conMod,
            currentHp: HIT_DIE[charClass] + conMod,
            tempHp: 0,
            armorClass: 10 + dexMod, // Base Unarmored
            speed: 30, // Simplified default
            initiative: dexMod,
            proficiencyBonus: 2,
            skills: [], // Would add skill selection in full version
            equipment: ['Backpack', 'Rations (5 days)', 'Waterskin'],
            backstory,
            features: CLASS_FEATURES[charClass] || []
        };
        onSave(newCharacter);
    };

    return (
        <div className="max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-stone-950 p-6 border-b border-stone-800 flex justify-between items-center">
                <h2 className="text-2xl font-serif text-amber-500">Character Creator</h2>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-amber-600' : 'bg-stone-700'}`} />
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">
                
                {/* Step 1: Concept */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl text-stone-200 font-bold mb-4 border-b border-stone-700 pb-2">Concept & Lineage</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label className="block text-stone-400 mb-2">Class</label>
                                <select 
                                    className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                    value={charClass}
                                    onChange={(e) => setCharClass(e.target.value)}
                                >
                                    {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-stone-400 mb-2">Name</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                    placeholder="Enter character name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button 
                                    onClick={handleGenerateNames}
                                    disabled={isLoadingAI}
                                    className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isLoadingAI ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                                    Suggest
                                </button>
                            </div>
                            {suggestedNames.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {suggestedNames.map(n => (
                                        <button 
                                            key={n} 
                                            onClick={() => setName(n)}
                                            className="text-xs bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-600 px-3 py-1 rounded-full transition-colors"
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-stone-400 mb-2">Background</label>
                            <select 
                                className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded p-3 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                            >
                                {BACKGROUND_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <p className="text-sm text-stone-500 mt-2">Backgrounds in 2024 rules provide your initial Ability Score bonuses and a level 1 Feat.</p>
                        </div>
                    </div>
                )}

                {/* Step 2: Ability Scores */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl text-stone-200 font-bold mb-4 border-b border-stone-700 pb-2">Ability Scores (Standard Array)</h3>
                        
                        <div className="bg-stone-800 p-4 rounded-lg mb-6 border border-stone-700">
                            <p className="text-stone-400 mb-2 text-sm uppercase tracking-wider font-bold">Available Scores</p>
                            <div className="flex flex-wrap gap-3">
                                {scoreAllocation.map((val, idx) => (
                                    <div key={idx} className="w-12 h-12 bg-stone-700 rounded flex items-center justify-center font-bold text-lg text-amber-500 shadow-inner border border-stone-600">
                                        {val}
                                    </div>
                                ))}
                                {scoreAllocation.length === 0 && <span className="text-stone-500 italic">All assigned!</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(Object.keys(ABILITY_NAMES) as Ability[]).map(ability => (
                                <div key={ability} className="bg-stone-900 p-4 rounded border border-stone-800">
                                    <label className="block text-stone-500 font-bold mb-1">{ABILITY_NAMES[ability]}</label>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold w-12 text-center text-white">
                                            {assignedScores[ability] || '--'}
                                        </div>
                                        <select 
                                            className="flex-1 bg-stone-800 border border-stone-700 text-stone-300 rounded p-2 text-sm"
                                            onChange={(e) => {
                                                const val = e.target.value ? parseInt(e.target.value) : 0;
                                                if (val) assignScore(ability, val);
                                            }}
                                            value={assignedScores[ability] || ''}
                                        >
                                            <option value="" disabled>Assign...</option>
                                            {/* Show current value + available pool */}
                                            {assignedScores[ability] && (
                                                <option value={assignedScores[ability]!}>{assignedScores[ability]}</option>
                                            )}
                                            {scoreAllocation.map((s, i) => (
                                                <option key={`${s}-${i}`} value={s!}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Backstory */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl text-stone-200 font-bold mb-4 border-b border-stone-700 pb-2">Backstory</h3>
                        
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-stone-400 text-sm">Describe your character's past or let the AI help you.</p>
                            <button 
                                onClick={handleGenerateBackstory}
                                disabled={isLoadingAI || !name}
                                className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 text-sm rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    <p className="text-stone-500 text-sm">{background} Background</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                                {(Object.keys(scores) as Ability[]).map(key => (
                                    <div key={key} className="bg-stone-900 p-2 rounded text-center border border-stone-800">
                                        <div className="text-xs text-stone-500 font-bold">{key}</div>
                                        <div className="text-lg text-white font-bold">{scores[key]}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 p-4 bg-stone-900/50 rounded italic text-stone-400 text-sm border-l-2 border-amber-700">
                                "{backstory || 'No backstory provided.'}"
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