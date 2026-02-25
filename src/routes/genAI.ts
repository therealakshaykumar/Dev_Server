import {Request, Response, Router} from 'express';
import { asyncHandler } from '../middlewares/wrapper.js';
import { generateBioPrompt } from '../lib/genAI.js';
import { userAuth } from '../middlewares/auth.js';

const ROUTER = Router();
ROUTER.use(userAuth);

ROUTER.post('/generate-bio', asyncHandler(async (req: Request, res: Response) => {
    const {firstName,lastName,gender,dob,linkedInUrl,githubUrl} = req.body;
    const bio = await generateBioPrompt({firstName,lastName,dob,gender,linkedInUrl,githubUrl})
    res.json({bio});
}));

export const GENAI_ROUTER = ROUTER;