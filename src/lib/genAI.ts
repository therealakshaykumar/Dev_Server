import { GoogleGenAI } from "@google/genai";
import { GenAI } from "../configs/creds.js";

const AI = new GoogleGenAI({
    apiKey: GenAI.GENAI_API_KEY
});

interface BioParams {
    firstName: string, 
    lastName: string,
    dob: string,
    gender: string,
    linkedInUrl?: string,
    githubUrl?: string,
}

export async function generateBioPrompt(data:BioParams): Promise<string> {
    const {firstName,lastName,dob,gender,githubUrl,linkedInUrl} = data;
    const prompt1 = `Create a short and engaging bio for a user with the following details:
    First Name: ${firstName}
    Last Name: ${lastName}
    Age: ${dob} get age from date of birth.
    Gender: ${gender}`;
    if(githubUrl) prompt1 + 'Github URL: '+ githubUrl;
    if(linkedInUrl) prompt1 + 'Github URL: '+ linkedInUrl;
    const prompt2 = `The bio should be concise, interesting, and reflect the user's personality.
    Add some funny elements, similar known faces
    Return only the bio text without any additional information or formatting.`;
    const prompt = `${prompt1} + ${prompt2}`
    const response = await AI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });
    return response.text || '';
}