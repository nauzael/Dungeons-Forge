
import { GoogleGenAI, Type } from "@google/genai";

// Singleton instance
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!aiClient) {
        // Access process.env.API_KEY strictly inside the function to ensure build-time replacement has occurred
        const key = process.env.API_KEY;
        
        // Check if key is present and not a placeholder string
        if (key && typeof key === 'string' && key.trim().length > 0 && key !== 'undefined') {
            try {
                aiClient = new GoogleGenAI({ apiKey: key });
            } catch (e) {
                console.error("Gemini Client Init Error:", e);
            }
        } else {
            // Only log warning once if needed, or keep silent to avoid console spam
            // console.warn("Gemini API Key missing or invalid."); 
        }
    }
    return aiClient;
};

// Use the fast flash model for responsiveness
const modelId = 'gemini-3-flash-preview'; 

export const generateCharacterName = async (species: string, characterClass: string, gender?: string): Promise<string[]> => {
  const client = getAiClient();
  if (!client) {
      // Fallback names if API is not configured
      return ["Tav", "Durge", "Hero", "Wanderer", "Adventurer"];
  }

  try {
    const prompt = `Generate 5 varied fantasy names for a D&D 2024 character.
    Species: ${species}
    Class: ${characterClass}
    ${gender ? `Gender: ${gender}` : ''}
    
    Output JSON only. Array of strings.`;

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
    if (!text) return [];

    // Clean potential markdown formatting just in case
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Name Gen Error:", error);
    return [];
  }
};

export const generateBackstory = async (
  name: string, 
  species: string, 
  charClass: string, 
  background: string
): Promise<string> => {
  const client = getAiClient();
  if (!client) return "Please configure your API Key to generate a backstory.";

  try {
    const prompt = `Create a short, engaging backstory (max 120 words) for a D&D 2024 character.
    Name: ${name}
    Species: ${species}
    Class: ${charClass}
    Background: ${background}
    
    Focus on a specific event that pushed them to adventure.`;

    const response = await client.models.generateContent({
        model: modelId,
        contents: prompt,
    });

    return response.text || "No backstory available.";
  } catch (error) {
    console.error("Gemini Backstory Gen Error:", error);
    return "The mists of history obscure this character's past (Error generating story).";
  }
};

export const askDndRules = async (query: string): Promise<string> => {
    const client = getAiClient();
    if (!client) return "I cannot consult the rules without my API Key configuration. Please add API_KEY to your environment variables.";

    try {
        const prompt = `You are a helpful D&D 2024 (5.5e) Rules Assistant.
        User Question: "${query}"
        
        Answer based strictly on the 2024 Player's Handbook rules. 
        - Be concise and direct.
        - Mention if a rule has changed significantly from 2014 (5e) if relevant (e.g. Surprise, Smite, Grappling).
        - Use bolding for key terms.
        
        If the question isn't about D&D rules, politely decline.`;

        const response = await client.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "I couldn't find a clear ruling for that.";
    } catch (error) {
        console.error("Gemini Rule Ask Error:", error);
        return "My connection to the rules compendium has been severed momentarily.";
    }
}
