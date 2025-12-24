
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is read from the environment variable as per guidelines.
// In Vite, this string replacement happens at build time.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai && apiKey) {
        try {
            ai = new GoogleGenAI({ apiKey: apiKey });
        } catch (e) {
            console.error("Failed to initialize Gemini Client:", e);
        }
    }
    return ai;
};

// Using gemini-3-flash-preview for low latency responses suitable for game flow
const modelId = 'gemini-3-flash-preview'; 

export const generateCharacterName = async (species: string, characterClass: string, gender?: string): Promise<string[]> => {
  try {
    const client = getAiClient();
    if (!client) {
        console.warn("Gemini API Key is missing. AI features disabled.");
        return ["Hero (No AI)", "Adventurer", "Traveler", "Wanderer", "Stranger"];
    }

    const prompt = `Generate 5 fantasy names for a D&D 2024 character.
    Species: ${species}
    Class: ${characterClass}
    ${gender ? `Gender: ${gender}` : ''}
    
    Return ONLY a JSON array of strings. Do not include markdown code blocks or extra text.
    Example: ["Name1", "Name2"]`;

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
        // Robust cleaning in case the model wraps JSON in markdown
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
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
    
    Focus on their motivation for becoming an adventurer. Return plain text.`;

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
        - Surprise is now a condition/initiative penalty, not a lost round.

        Answer the following question based strictly on the 2024 ruleset. Keep it brief, formatted with Markdown, and helpful for a player mid-game.
        
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
