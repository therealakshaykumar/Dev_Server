var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { asyncHandler } from '../middlewares/wrapper.js';
import { generateBioPrompt } from '../lib/genAI.js';
import { userAuth } from '../middlewares/auth.js';
const ROUTER = Router();
ROUTER.use(userAuth);
ROUTER.post('/generate-bio', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, dob } = req.body;
    const bio = yield generateBioPrompt(firstName, lastName, dob, gender);
    res.json({ bio });
})));
export const GENAI_ROUTER = ROUTER;
