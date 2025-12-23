import React, { useState } from 'react';
import { Character, Ability } from '../types';
import { ABILITY_NAMES } from '../constants';
import DiceRoller from './DiceRoller';
import { Shield, Heart, Zap, Scroll, Swords, Backpack, ArrowLeft, BotMessageSquare } from 'lucide-react';
import { askDndRules } from '../services/geminiService';

interface CharacterSheetProps {
    character: Character;
    onBack: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack }) => {
    const [activeTab, setActiveTab] = useState<'main' | 'skills' | 'inventory' | 'features'>('main');
    const [ruleQuery, setRuleQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAskingAi, setIsAskingAi] = useState(false);

    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

    const handleAskRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleQuery.trim()) return;
        setIsAskingAi(true);
        setAiResponse(null);
        const ans = await askDndRules(ruleQuery);
        setAiResponse(ans);
        setIsAskingAi(false);
    }

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-4">
            
            {/* Left Column: Stats & Core Info */}
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                
                {/* Header Card */}
                <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 relative overflow-hidden">
                    <button onClick={onBack} className="absolute top-4 right-4 text-stone-500 hover:text-white flex items-center gap-1 text-sm">
                        <ArrowLeft size={16}/> Dashboard
                    </button>
                    <div className="flex gap-6 items-center z-10 relative">
                        <div className="w-20 h-20 bg-stone-800 rounded-full border-2 border-amber-600 flex items-center justify-center text-4xl font-serif text-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                            {character.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-white">{character.name}</h1>
                            <p className="text-amber-500 font-bold text-lg">Level {character.level} {character.species} {character.class}</p>
                            <p className="text-stone-400">{character.background}</p>
                        </div>
                    </div>
                    {/* Decorative bg pattern */}
                    <div className="absolute -right-10 -bottom-20 text-stone-800 opacity-20 pointer-events-none">
                        <Shield size={200} />
                    </div>
                </div>

                {/* Vitals Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-stone-900 border border-stone-700 rounded p-4 flex flex-col items-center">
                        <span className="text-stone-400 text-xs uppercase tracking-widest mb-1">Armor Class</span>
                        <div className="flex items-center gap-2 text-white">
                            <Shield size={24} className="text-stone-500"/>
                            <span className="text-3xl font-bold font-serif">{character.armorClass}</span>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-700 rounded p-4 flex flex-col items-center">
                        <span className="text-stone-400 text-xs uppercase tracking-widest mb-1">Hit Points</span>
                        <div className="flex items-center gap-2 text-white">
                            <Heart size={24} className="text-red-600"/>
                            <span className="text-3xl font-bold font-serif">{character.currentHp}<span className="text-lg text-stone-500">/{character.maxHp}</span></span>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-700 rounded p-4 flex flex-col items-center">
                        <span className="text-stone-400 text-xs uppercase tracking-widest mb-1">Initiative</span>
                        <div className="flex items-center gap-2 text-white">
                            <Zap size={24} className="text-yellow-500"/>
                            <span className="text-3xl font-bold font-serif">{formatMod(character.initiative)}</span>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-700 rounded p-4 flex flex-col items-center">
                        <span className="text-stone-400 text-xs uppercase tracking-widest mb-1">Proficiency</span>
                        <div className="flex items-center gap-2 text-white">
                            <Swords size={24} className="text-stone-400"/>
                            <span className="text-3xl font-bold font-serif">+{character.proficiencyBonus}</span>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {(Object.keys(character.abilityScores) as Ability[]).map(ability => {
                        const score = character.abilityScores[ability];
                        const mod = getModifier(score);
                        return (
                            <div key={ability} className="bg-stone-800 border border-stone-700 rounded p-3 text-center flex flex-col items-center justify-between h-32 hover:bg-stone-750 transition-colors group cursor-default">
                                <span className="text-stone-500 text-xs font-bold uppercase">{ability}</span>
                                <span className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{formatMod(mod)}</span>
                                <div className="bg-stone-950 rounded-full px-3 py-0.5 text-sm text-stone-400 border border-stone-800">
                                    {score}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div className="bg-stone-900 border border-stone-700 rounded-lg flex-1 flex flex-col min-h-[400px]">
                    <div className="flex border-b border-stone-700">
                        <button 
                            onClick={() => setActiveTab('main')}
                            className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab === 'main' ? 'text-amber-500 border-b-2 border-amber-500 bg-stone-800' : 'text-stone-400 hover:text-stone-200'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('features')}
                            className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab === 'features' ? 'text-amber-500 border-b-2 border-amber-500 bg-stone-800' : 'text-stone-400 hover:text-stone-200'}`}
                        >
                            Features & Traits
                        </button>
                         <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab === 'inventory' ? 'text-amber-500 border-b-2 border-amber-500 bg-stone-800' : 'text-stone-400 hover:text-stone-200'}`}
                        >
                            Inventory
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'main' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-stone-300 font-bold mb-3 flex items-center gap-2"><Scroll size={18}/> Backstory</h3>
                                    <p className="text-stone-400 leading-relaxed italic border-l-2 border-stone-700 pl-4">
                                        {character.backstory}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="space-y-4">
                                <h3 className="text-stone-300 font-bold mb-3">Class Features</h3>
                                <div className="grid gap-3">
                                    {character.features.map((feat, idx) => (
                                        <div key={idx} className="bg-stone-800 p-3 rounded border border-stone-700">
                                            <h4 className="font-bold text-amber-500">{feat}</h4>
                                            <p className="text-stone-400 text-sm mt-1">Class feature description placeholder.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'inventory' && (
                            <div className="space-y-4">
                                <h3 className="text-stone-300 font-bold mb-3 flex items-center gap-2"><Backpack size={18}/> Equipment</h3>
                                <ul className="list-disc list-inside text-stone-400 space-y-1">
                                    {character.equipment.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Column: Tools */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                
                {/* Dice Roller */}
                <DiceRoller className="w-full" />

                {/* AI Rules Assistant */}
                <div className="bg-stone-900 border border-stone-700 rounded-lg p-4 flex flex-col gap-3 flex-1 min-h-[300px]">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold font-serif border-b border-stone-800 pb-2">
                        <BotMessageSquare size={20} />
                        Rules Assistant
                    </div>
                    <div className="flex-1 bg-stone-950 rounded p-3 text-sm text-stone-300 overflow-y-auto custom-scrollbar border border-stone-800">
                        {!aiResponse && !isAskingAi && (
                            <p className="text-stone-600 italic">Ask me about specific rules, spell descriptions, or mechanics from the 2024 update.</p>
                        )}
                        {isAskingAi && (
                            <div className="flex items-center gap-2 text-stone-500 animate-pulse">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                Consulting the archives...
                            </div>
                        )}
                        {aiResponse && (
                            <div className="prose prose-invert prose-sm">
                                {aiResponse}
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleAskRule} className="flex gap-2">
                        <input 
                            type="text" 
                            value={ruleQuery}
                            onChange={(e) => setRuleQuery(e.target.value)}
                            className="flex-1 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            placeholder="How does grapple work?"
                        />
                        <button type="submit" className="bg-indigo-700 hover:bg-indigo-600 text-white rounded px-3 py-2 font-bold transition-colors">
                            Ask
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default CharacterSheet;