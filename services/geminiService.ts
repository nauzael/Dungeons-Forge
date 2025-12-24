
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization to prevent startup crashes if API_KEY is missing
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        const key = process.env.API_KEY;
        if (key) {
            try {
                ai = new GoogleGenAI({ apiKey: key });
            } catch (e) {
                console.error("Failed to initialize Gemini Client:", e);
            }
        } else {
            console.warn("Gemini API Key is missing. AI features will be disabled.");
        }
    }
    return ai;
};

const modelId = 'gemini-3-flash-preview'; 

export const generateCharacterName = async (species: string, characterClass: string, gender?: string): Promise<string[]> => {
  try {
    const client = getAiClient();
    if (!client) return ["Hero (No AI Key)"];

    const prompt = `Generate 5 fantasy names for a D&D 2024 character.
    Species: ${species}
    Class: ${characterClass}
    ${gender ? `Gender: ${gender}` : ''}
    
    Return only a JSON array of strings. Example: ["Name1", "Name2"]`;

    const response = await client.models.generateContent({
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
  try {
    const client = getAiClient();
    if (!client) return "AI Configuration Missing. Cannot generate backstory.";

    const prompt = `Write a concise (max 150 words) but engaging backstory for a Dungeons & Dragons 2024 character.
    Name: ${name}
    Species: ${species}
    Class: ${charClass}
    Background: ${background}
    
    Focus on their motivation for becoming an adventurer.`;

    const response = await client.models.generateContent({
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
    try {
        const client = getAiClient();
        if (!client) return "I cannot consult the rules without my API Key configuration.";

        const prompt = `You are a Dungeon Master rules lawyer for D&D 2024 (5.5e/One D&D). 
        You have deep knowledge of the 2024 Player's Handbook.
        
        Key 2024 Changes to remember:
        - "Race" is now "Species".
        - Backgrounds provide Ability Scores and Origin Feats.
        - Weapon Mastery properties (Vex, Nick, Sap, etc.) are a core martial mechanic.
        - "Inspiration" is now "Heroic Inspiration".
        - Exhaustion uses the new 1-10 scale.
        - Druids have Wild Resurgence.
        - Paladins use Lay on Hands as a Bonus Action.
        - Monks use Focus Points instead of Ki.

        Answer the following question based strictly on the 2024 ruleset. Keep it brief and helpful for a player mid-game.
        
        Question: ${query}`;

        const response = await client.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "I am unsure of that ruling.";
    } catch (error) {
        console.error("Gemini Rules Ask Error:", error);
        return "The weave is disrupted. Try again later.";
    }
}
