
import React, { useState, useRef, useEffect } from 'react';
import { Character, Ability } from '../types';
import { Shield, Heart, Zap, Scroll, Swords, Backpack, ArrowLeft, BotMessageSquare, Sparkles, BookOpen, X, User } from 'lucide-react';
import { askDndRules } from '../services/geminiService';
import { MASTERY_DESCRIPTIONS } from '../constants';

interface CharacterSheetProps {
    character: Character;
    onBack: () => void;
}

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
                        <VitalStat label="AC" value={character.armorClass} icon={<Shield size={16} className="text-stone-500"/>} />
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

                            {/* Features */}
                            <div>
                                <SectionHeader icon={<Sparkles size={16}/>} title="Features & Traits" />
                                <div className="space-y-3">
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                        <Badge>{character.background}</Badge>
                                        <Badge color="indigo">{character.originFeat}</Badge>
                                        <Badge color="stone">{character.species}</Badge>
                                    </div>
                                    {character.features.map((feat, idx) => (
                                        <div key={idx} className="bg-stone-900/60 px-5 py-4 rounded-xl border border-stone-800/50 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0"></div>
                                            <span className="text-stone-300 font-medium text-sm leading-relaxed">{feat}</span>
                                        </div>
                                    ))}
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
                            <SectionHeader icon={<Swords size={16}/>} title="Active Weapons" />
                            <div className="grid gap-4">
                                {character.weapons && character.weapons.length > 0 ? (
                                    character.weapons.map((wpn, idx) => (
                                        <div key={idx} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-stone-100 font-bold text-xl font-serif">{wpn.name}</span>
                                                    </div>
                                                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                                                        {wpn.type}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                     <span className="text-2xl font-serif font-bold text-amber-500 block">{wpn.damage}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {wpn.properties.map(p => (
                                                    <span key={p} className="text-[10px] bg-stone-950 text-stone-400 px-2 py-1 rounded border border-stone-800">{p}</span>
                                                ))}
                                            </div>

                                            <div className="bg-stone-950/50 border border-stone-800/50 p-3 rounded-xl flex gap-3">
                                                <div className="mt-1">
                                                    <Zap size={14} className="text-amber-600"/>
                                                </div>
                                                <div>
                                                    <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-0.5">{wpn.mastery}</span>
                                                    <p className="text-stone-500 text-xs leading-relaxed">
                                                        {MASTERY_DESCRIPTIONS[wpn.mastery]}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-600 italic text-center py-10">No weapons equipped.</p>
                                )}
                            </div>
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
