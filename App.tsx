
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
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-900 selection:text-white flex flex-col">
            {/* Main container allows native scrolling, removing h-screen/overflow constraints */}
            <main className="flex-1 w-full animate-in fade-in duration-300">
                {view === 'dashboard' && (
                    <div className="p-4 md:p-6">
                        <Dashboard 
                            characters={characters} 
                            onCreateNew={() => setView('create')}
                            onSelectCharacter={handleSelectCharacter}
                            onDeleteCharacter={handleDeleteCharacter}
                        />
                    </div>
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
