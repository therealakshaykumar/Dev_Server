var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenAI } from "@google/genai";
import { GenAI } from "../configs/creds.js";
const AI = new GoogleGenAI({
    apiKey: GenAI.GENAI_API_KEY
});
export function generateBioPrompt(firstName, lastName, dob, gender) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Create a short and engaging bio for a user with the following details:
    First Name: ${firstName}
    Last Name: ${lastName}
    Age: ${dob} get age from date of birth.
    Gender: ${gender}
    The bio should be concise, interesting, and reflect the user's personality.
    Return only the bio text without any additional information or formatting.`;
        const response = yield AI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        return response.text || '';
    });
}
