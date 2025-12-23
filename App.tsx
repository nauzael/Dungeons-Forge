import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CharacterCreator from './components/CharacterCreator';
import CharacterSheet from './components/CharacterSheet';
import { Character } from './types';

const App: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'create' | 'sheet'>('dashboard');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('dnd2024_characters');
        if (saved) {
            try {
                setCharacters(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load characters", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('dnd2024_characters', JSON.stringify(characters));
    }, [characters]);

    const handleSaveCharacter = (char: Character) => {
        setCharacters(prev => [...prev, char]);
        setView('dashboard');
    };

    const handleSelectCharacter = (id: string) => {
        setSelectedCharId(id);
        setView('sheet');
    };

    const handleDeleteCharacter = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this character?")) {
            setCharacters(prev => prev.filter(c => c.id !== id));
            if (selectedCharId === id) {
                setView('dashboard');
                setSelectedCharId(null);
            }
        }
    };

    const getSelectedCharacter = () => characters.find(c => c.id === selectedCharId);

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-900 selection:text-white">
            <nav className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-red-700 rounded-lg rotate-45 flex items-center justify-center shadow-lg shadow-red-900/50">
                            <div className="-rotate-45 font-bold text-white text-xs">D&D</div>
                        </div>
                        <span className="font-serif font-bold text-xl tracking-tight text-stone-100">
                            Companion <span className="text-amber-600 text-sm align-top">2024</span>
                        </span>
                    </div>
                    {/* Placeholder for user profile or settings if needed */}
                </div>
            </nav>

            <main className="p-4 md:p-6 animate-in fade-in duration-500">
                {view === 'dashboard' && (
                    <Dashboard 
                        characters={characters} 
                        onCreateNew={() => setView('create')}
                        onSelectCharacter={handleSelectCharacter}
                        onDeleteCharacter={handleDeleteCharacter}
                    />
                )}
                
                {view === 'create' && (
                    <CharacterCreator 
                        onSave={handleSaveCharacter} 
                        onCancel={() => setView('dashboard')} 
                    />
                )}

                {view === 'sheet' && getSelectedCharacter() && (
                    <CharacterSheet 
                        character={getSelectedCharacter()!} 
                        onBack={() => setView('dashboard')}
                    />
                )}
            </main>
        </div>
    );
};

export default App;