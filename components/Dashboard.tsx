import React from 'react';
import { Character } from '../types';
import { Plus, User, Trash2 } from 'lucide-react';

interface DashboardProps {
    characters: Character[];
    onCreateNew: () => void;
    onSelectCharacter: (id: string) => void;
    onDeleteCharacter: (id: string, e: React.MouseEvent) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ characters, onCreateNew, onSelectCharacter, onDeleteCharacter }) => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="flex justify-between items-end mb-8 border-b border-stone-800 pb-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">My Party</h1>
                    <p className="text-stone-400">Manage your heroes for the next adventure.</p>
                </div>
                <button 
                    onClick={onCreateNew}
                    className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-lg hover:shadow-amber-900/40"
                >
                    <Plus size={20} /> New Character
                </button>
            </div>

            {characters.length === 0 ? (
                <div className="text-center py-20 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
                    <User size={64} className="mx-auto text-stone-700 mb-4" />
                    <h3 className="text-xl font-bold text-stone-300 mb-2">No characters found</h3>
                    <p className="text-stone-500 max-w-md mx-auto mb-6">The tavern is empty. Create your first character to begin the journey into the 2024 ruleset.</p>
                    <button 
                        onClick={onCreateNew}
                        className="text-amber-500 hover:text-amber-400 font-bold underline"
                    >
                        Create one now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map(char => (
                        <div 
                            key={char.id}
                            onClick={() => onSelectCharacter(char.id)}
                            className="bg-stone-900 border border-stone-800 rounded-xl p-6 cursor-pointer hover:border-amber-700/50 hover:bg-stone-800 hover:-translate-y-1 transition-all group relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-stone-800 rounded-full flex items-center justify-center text-2xl font-serif text-amber-600 border border-stone-700 group-hover:border-amber-600 transition-colors">
                                    {char.name.charAt(0)}
                                </div>
                                <div className="bg-stone-950 px-2 py-1 rounded text-xs font-bold text-stone-500 border border-stone-800">
                                    Lvl {char.level}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">{char.name}</h3>
                            <p className="text-stone-400 text-sm mb-4">{char.species} {char.class}</p>

                            <div className="flex gap-2 text-xs text-stone-500 font-mono mt-auto pt-4 border-t border-stone-800">
                                <span className="bg-stone-950 px-2 py-1 rounded">HP: {char.currentHp}/{char.maxHp}</span>
                                <span className="bg-stone-950 px-2 py-1 rounded">AC: {char.armorClass}</span>
                            </div>

                            <button 
                                onClick={(e) => onDeleteCharacter(char.id, e)}
                                className="absolute top-4 right-4 text-stone-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                                title="Delete Character"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;