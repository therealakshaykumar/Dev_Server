import mongoose from 'mongoose';
import { DB } from './creds.js';
export async function connectDB() {
    return await mongoose.connect(DB.MONGO_URI);
}
