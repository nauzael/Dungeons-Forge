
import React from 'react';
import { Character } from '../types';
import { Plus, User, Trash2, ArrowRight } from 'lucide-react';

interface DashboardProps {
    characters: Character[];
    onCreateNew: () => void;
    onSelectCharacter: (id: string) => void;
    onDeleteCharacter: (id: string, e: React.MouseEvent) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ characters, onCreateNew, onSelectCharacter, onDeleteCharacter }) => {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-stone-100 mb-2">Adventure Awaits</h1>
                    <p className="text-stone-500 text-lg">Select a hero or forge a new destiny.</p>
                </div>
                <button 
                    onClick={onCreateNew}
                    className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg hover:shadow-amber-900/40 w-full md:w-auto active:scale-95"
                >
                    <Plus size={24} /> <span>Create Character</span>
                </button>
            </div>

            {characters.length === 0 ? (
                <div className="text-center py-24 bg-stone-900/30 rounded-3xl border-2 border-dashed border-stone-800/50 flex flex-col items-center">
                    <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mb-6 border border-stone-800">
                        <User size={32} className="text-stone-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-300 mb-2 font-serif">The tavern is empty</h3>
                    <p className="text-stone-500 max-w-sm mx-auto mb-8 leading-relaxed">Your party hasn't gathered yet. Create your first character to begin the journey into the 2024 ruleset.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {characters.map(char => (
                        <div 
                            key={char.id}
                            onClick={() => onSelectCharacter(char.id)}
                            className="bg-stone-900 border border-stone-800 rounded-2xl p-6 cursor-pointer hover:border-amber-700/50 hover:bg-stone-800 transition-all group relative shadow-md active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-stone-950 rounded-2xl flex items-center justify-center text-3xl font-serif text-amber-600 border border-stone-800 group-hover:border-amber-900/50 transition-colors shadow-inner">
                                        {char.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-100 group-hover:text-amber-500 transition-colors">{char.name}</h3>
                                        <p className="text-stone-500 font-medium">{char.species} {char.class}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm text-stone-400 font-mono mt-auto">
                                <div className="bg-stone-950 px-3 py-2 rounded-lg border border-stone-800 flex-1 flex justify-between">
                                    <span className="text-stone-600 font-bold">LVL</span>
                                    <span className="text-stone-200 font-bold">{char.level}</span>
                                </div>
                                <div className="bg-stone-950 px-3 py-2 rounded-lg border border-stone-800 flex-1 flex justify-between">
                                    <span className="text-stone-600 font-bold">HP</span>
                                    <span className="text-stone-200 font-bold">{char.currentHp}</span>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 flex gap-2">
                                <button 
                                    onClick={(e) => onDeleteCharacter(char.id, e)}
                                    className="text-stone-700 hover:text-red-500 p-2 rounded-lg hover:bg-stone-950 transition-all"
                                    title="Delete Character"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
