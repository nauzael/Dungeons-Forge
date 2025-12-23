
import React, { useState, useRef, useEffect } from 'react';
import { Character, Ability } from '../types';
import { Shield, Heart, Zap, Scroll, Swords, Backpack, ArrowLeft, BotMessageSquare, Sparkles, BookOpen, X, User } from 'lucide-react';
import { askDndRules } from '../services/geminiService';
import { MASTERY_DESCRIPTIONS } from '../constants';

interface CharacterSheetProps {
    character: Character;
    onBack: () => void;
}

// Removed 'rules' from tabs as it is now a modal
type TabType = 'main' | 'combat' | 'inventory' | 'spells';
const TABS: TabType[] = ['main', 'combat', 'inventory', 'spells'];

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack }) => {
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [showAiModal, setShowAiModal] = useState(false);
    
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

    // Focus input when AI modal opens
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

    // Swipe Handlers
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
            }
            if (isRightSwipe && currentIndex > 0) {
                setActiveTab(TABS[currentIndex - 1]);
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-1rem)] relative overflow-hidden bg-stone-950">
            
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-4 bg-stone-900 border-b border-stone-800 shrink-0 z-20 shadow-md">
                <button onClick={onBack} className="text-stone-400 hover:text-white p-2 -ml-2 rounded-full active:bg-stone-800">
                    <ArrowLeft size={24}/>
                </button>
                
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-serif font-bold text-white leading-tight">{character.name}</h1>
                    <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Lvl {character.level} {character.class}</span>
                </div>

                <button 
                    onClick={() => setShowAiModal(true)} 
                    className="text-indigo-400 hover:text-indigo-300 bg-indigo-950/30 p-2 rounded-full border border-indigo-900/50 active:bg-indigo-900/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                >
                    <BotMessageSquare size={24} />
                </button>
            </div>

            {/* --- SCROLLABLE CONTENT AREA --- */}
            <div 
                className="flex-1 overflow-y-auto custom-scrollbar pb-24" // pb-24 for footer space
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Vitals Bar (Always visible at top of scroll) */}
                <div className="grid grid-cols-4 gap-2 p-4 bg-stone-950/50 sticky top-0 z-10 backdrop-blur-sm border-b border-stone-800/50">
                    <div className="flex flex-col items-center justify-center bg-stone-900 border border-stone-800 rounded p-2">
                        <span className="text-[10px] text-stone-500 font-bold">AC</span>
                        <div className="flex items-center gap-1 text-white font-serif font-bold text-xl">
                            <Shield size={14} className="text-stone-600"/> {character.armorClass}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-stone-900 border border-stone-800 rounded p-2">
                        <span className="text-[10px] text-stone-500 font-bold">HP</span>
                        <div className="flex items-center gap-1 text-white font-serif font-bold text-xl">
                            <Heart size={14} className="text-red-700"/> {character.currentHp}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-stone-900 border border-stone-800 rounded p-2">
                        <span className="text-[10px] text-stone-500 font-bold">INIT</span>
                        <div className="flex items-center gap-1 text-white font-serif font-bold text-xl">
                            <Zap size={14} className="text-yellow-600"/> {formatMod(character.initiative)}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-stone-900 border border-stone-800 rounded p-2">
                        <span className="text-[10px] text-stone-500 font-bold">PROF</span>
                        <div className="flex items-center gap-1 text-white font-serif font-bold text-xl">
                            <Swords size={14} className="text-stone-600"/> +{character.proficiencyBonus}
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* --- TAB CONTENT --- */}
                    
                    {activeTab === 'main' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Ability Scores */}
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.keys(character.abilityScores) as Ability[]).map(ability => {
                                    const score = character.abilityScores[ability];
                                    const mod = getModifier(score);
                                    return (
                                        <div key={ability} className="bg-stone-900 border border-stone-800 rounded p-2 text-center flex flex-col items-center relative overflow-hidden">
                                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest z-10">{ability}</span>
                                            <span className="text-2xl font-bold text-white z-10">{formatMod(mod)}</span>
                                            <span className="text-xs text-stone-600 z-10">{score}</span>
                                            {/* Background number watermark */}
                                            <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-stone-800 opacity-20 pointer-events-none select-none">{score}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Sparkles size={14}/> Features & Traits</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-stone-500 bg-stone-900 border border-stone-800 px-2 py-1 rounded">{character.background}</span>
                                        {character.originFeat && <span className="text-xs font-bold text-indigo-400 bg-indigo-950/20 border border-indigo-900/50 px-2 py-1 rounded">{character.originFeat}</span>}
                                    </div>
                                    {character.features.map((feat, idx) => (
                                        <div key={idx} className="bg-stone-900 px-4 py-3 rounded border border-stone-800 shadow-sm">
                                            <span className="text-stone-200 font-bold text-sm">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Backstory */}
                            <div>
                                <h3 className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Scroll size={14}/> Backstory</h3>
                                <div className="bg-stone-900 p-4 rounded border border-stone-800">
                                    <p className="text-stone-400 text-sm leading-relaxed italic">
                                        "{character.backstory}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'combat' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                <Swords size={14}/> Active Weapons
                            </h3>
                            <div className="grid gap-3">
                                {character.weapons && character.weapons.length > 0 ? (
                                    character.weapons.map((wpn, idx) => (
                                        <div key={idx} className="bg-stone-900 border border-stone-800 rounded-lg p-4 shadow-sm relative overflow-hidden group">
                                            <div className="flex justify-between items-start mb-2 relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold text-lg">{wpn.name}</span>
                                                        {wpn.properties.includes('Light') && <span className="text-[10px] font-bold uppercase bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">Light</span>}
                                                    </div>
                                                    <span className="text-amber-500 font-mono text-sm font-bold">{wpn.damage} <span className="text-stone-500 font-sans text-xs font-normal">{wpn.type}</span></span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-xs text-stone-400 mb-3 relative z-10 border-b border-stone-800 pb-2">
                                                {wpn.properties.join(', ')}
                                            </div>

                                            <div className="bg-stone-950/80 border border-stone-800 p-2 rounded relative z-10">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Zap size={10} className="text-amber-600"/>
                                                    <span className="text-amber-600 font-bold text-[10px] uppercase tracking-wider">Mastery: {wpn.mastery}</span>
                                                </div>
                                                <p className="text-stone-500 text-[10px] leading-tight">
                                                    {MASTERY_DESCRIPTIONS[wpn.mastery]}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-500 italic text-center py-8">No weapons equipped.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Backpack size={14}/> Equipment</h3>
                            <ul className="grid grid-cols-1 gap-2">
                                {character.equipment.map((item, i) => (
                                    <li key={i} className="text-stone-300 bg-stone-900 px-4 py-3 rounded border border-stone-800 flex items-center justify-between">
                                        <span>{item}</span>
                                        <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-4 bg-stone-900/50 rounded border border-stone-800 border-dashed text-center">
                                <span className="text-stone-500 text-sm">Tap + to add items (Coming soon)</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'spells' && (
                        <div className="h-64 flex flex-col items-center justify-center text-stone-500 animate-in fade-in slide-in-from-right-4 duration-300">
                            <BookOpen size={48} className="mb-4 opacity-20"/>
                            <p className="font-serif text-lg text-stone-400">Grimoire</p>
                            <p className="text-xs text-stone-600 mt-1 max-w-[200px] text-center">Spell management is currently locked by the DM.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="bg-stone-950 border-t border-stone-800 p-2 safe-area-pb z-30 shrink-0">
                <nav className="flex justify-around items-center">
                    <NavButton 
                        active={activeTab === 'main'} 
                        onClick={() => setActiveTab('main')} 
                        icon={<User size={20}/>} 
                        label="Overview" 
                    />
                    <NavButton 
                        active={activeTab === 'combat'} 
                        onClick={() => setActiveTab('combat')} 
                        icon={<Swords size={20}/>} 
                        label="Combat" 
                    />
                    <NavButton 
                        active={activeTab === 'inventory'} 
                        onClick={() => setActiveTab('inventory')} 
                        icon={<Backpack size={20}/>} 
                        label="Items" 
                    />
                    <NavButton 
                        active={activeTab === 'spells'} 
                        onClick={() => setActiveTab('spells')} 
                        icon={<BookOpen size={20}/>} 
                        label="Spells" 
                    />
                </nav>
            </div>

            {/* --- AI MODAL OVERLAY --- */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setShowAiModal(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="bg-stone-900 w-full sm:max-w-lg h-[85vh] sm:h-[600px] sm:rounded-xl rounded-t-2xl flex flex-col relative z-10 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl border border-stone-800">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900 rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <BotMessageSquare className="text-indigo-500" />
                                <h3 className="font-bold text-white">DM Assistant AI</h3>
                            </div>
                            <button 
                                onClick={() => setShowAiModal(false)}
                                className="text-stone-500 hover:text-white p-1 rounded-full bg-stone-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 text-stone-300 bg-stone-950/30">
                            {!aiResponse && !isAskingAi && (
                                <div className="flex flex-col items-center justify-center h-full text-stone-600 text-center space-y-4">
                                    <BotMessageSquare size={48} className="opacity-20"/>
                                    <div>
                                        <p className="text-sm font-bold text-stone-500">I know the 2024 Rules.</p>
                                        <p className="text-xs mt-1">Ask about conditions, spells, or mechanics.</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <span className="text-[10px] border border-stone-800 rounded px-2 py-1">What is the Vex mastery?</span>
                                        <span className="text-[10px] border border-stone-800 rounded px-2 py-1">Grappled condition rules</span>
                                        <span className="text-[10px] border border-stone-800 rounded px-2 py-1">How does Exhaustion work?</span>
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
                                <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
                                    <div className="prose prose-invert prose-stone prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Input) */}
                        <div className="p-4 bg-stone-900 border-t border-stone-800">
                             <form onSubmit={handleAskRule} className="flex gap-2">
                                <input 
                                    ref={aiInputRef}
                                    type="text" 
                                    value={ruleQuery}
                                    onChange={(e) => setRuleQuery(e.target.value)}
                                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-stone-600"
                                    placeholder="Ask a rules question..."
                                />
                                <button 
                                    type="submit" 
                                    disabled={!ruleQuery.trim() || isAskingAi}
                                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 font-bold transition-colors shadow-lg shadow-indigo-900/20"
                                >
                                    Ask
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

// Helper component for Footer Buttons
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all w-20 ${active ? 'text-amber-500 bg-stone-900' : 'text-stone-500 hover:text-stone-300'}`}
    >
        <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </button>
);

export default CharacterSheet;
