import { GoogleGenAI } from "@google/genai";
import { GenAI } from "../configs/creds.js";

const AI = new GoogleGenAI({
    apiKey: GenAI.GENAI_API_KEY
});

export async function generateBioPrompt(firstName: string, lastName: string, dob: string,gender: string): Promise<string> {
    const prompt = `Create a short and engaging bio for a user with the following details:
    First Name: ${firstName}
    Last Name: ${lastName}
    Age: ${dob} get age from date of birth.
    Gender: ${gender}
    The bio should be concise, interesting, and reflect the user's personality.
    Return only the bio text without any additional information or formatting.`;
    const response = await AI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });
    return response.text || '';
}