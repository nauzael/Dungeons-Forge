import React, { useState } from 'react';
import { DieRollResult } from '../types';
import { Dice5 } from 'lucide-react';

interface DiceRollerProps {
    className?: string;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ className }) => {
    const [lastRoll, setLastRoll] = useState<DieRollResult | null>(null);
    const [history, setHistory] = useState<DieRollResult[]>([]);

    const rollDice = (sides: number, count: number = 1, modifier: number = 0) => {
        const rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        total += modifier;
        
        const formula = `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`;
        
        const result: DieRollResult = {
            total,
            rolls,
            formula
        };

        setLastRoll(result);
        setHistory(prev => [result, ...prev].slice(0, 10));
    };

    return (
        <div className={`bg-stone-900 border border-stone-700 rounded-lg p-4 shadow-xl ${className}`}>
            <h3 className="text-amber-500 font-serif font-bold text-lg mb-3 flex items-center gap-2">
                <Dice5 size={20} /> Dice Tray
            </h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {[4, 6, 8, 10, 12, 20].map(sides => (
                    <button
                        key={sides}
                        onClick={() => rollDice(sides)}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2 rounded border border-stone-600 transition-colors flex flex-col items-center justify-center"
                    >
                        <span className="text-xs text-stone-500">d</span>{sides}
                    </button>
                ))}
            </div>

            <div className="bg-stone-950 rounded p-3 min-h-[80px] flex flex-col items-center justify-center border border-stone-800">
                {lastRoll ? (
                    <>
                        <div className="text-4xl font-bold text-white mb-1 animate-pulse">
                            {lastRoll.total}
                        </div>
                        <div className="text-xs text-stone-500 font-mono">
                            {lastRoll.formula} ({lastRoll.rolls.join(', ')})
                        </div>
                    </>
                ) : (
                    <span className="text-stone-600 italic text-sm">Roll the bones...</span>
                )}
            </div>
            
            {history.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">History</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                        {history.map((roll, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-stone-400 border-b border-stone-800 pb-1 last:border-0">
                                <span>{roll.formula}</span>
                                <span className="font-bold text-stone-200">{roll.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiceRoller;