import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Character, AbilityScores } from '../types';

// Helper to safely get API key
const getApiKey = () => {
    // In a real app this would be process.env.API_KEY, but for the prompt context we use it directly as instructed
    return process.env.API_KEY || '';
};

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: getApiKey() });
const modelId = 'gemini-3-flash-preview'; 

export const generateCharacterName = async (species: string, characterClass: string, gender?: string): Promise<string[]> => {
  if (!getApiKey()) return ["Hero", "Adventurer", "Traveler"];

  try {
    const prompt = `Generate 5 fantasy names for a D&D 2024 character.
    Species: ${species}
    Class: ${characterClass}
    ${gender ? `Gender: ${gender}` : ''}
    
    Return only a JSON array of strings. Example: ["Name1", "Name2"]`;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const text = response.text;
    if (text) {
        return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Name Generation Error:", error);
    return ["Nameless One"];
  }
};

export const generateBackstory = async (
  name: string, 
  species: string, 
  charClass: string, 
  background: string
): Promise<string> => {
  if (!getApiKey()) return "A mysterious traveler with a past shrouded in mist.";

  try {
    const prompt = `Write a concise (max 150 words) but engaging backstory for a Dungeons & Dragons 2024 character.
    Name: ${name}
    Species: ${species}
    Class: ${charClass}
    Background: ${background}
    
    Focus on their motivation for becoming an adventurer.`;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
    });

    return response.text || "No backstory generated.";
  } catch (error) {
    console.error("Gemini Backstory Generation Error:", error);
    return "The stars were silent when asked about this one's past.";
  }
};

export const askDndRules = async (query: string): Promise<string> => {
    if (!getApiKey()) return "Arcane silence prevents me from answering (Missing API Key).";

    try {
        const prompt = `You are a Dungeon Master rules lawyer for D&D 2024 (5.5e/One D&D). 
        Answer the following question based on the updated ruleset if possible, otherwise standard 5e.
        Keep it brief and helpful.
        Question: ${query}`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "I am unsure of that ruling.";
    } catch (error) {
        return "The weave is disrupted. Try again later.";
    }
}
