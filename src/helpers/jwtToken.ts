import jwt from "jsonwebtoken";
import { App } from "../configs/creds.js";

export const generateToken = async (payload:object)=>{
    const token = jwt.sign(payload, App.JWT_SECRET as string, {
        expiresIn: App.EXPIRES_IN,
    });
    return token;
}

export const verifyToken = async (token:string)=>{
    try{
        const decoded = jwt.verify(token, App.JWT_SECRET as string);
        return decoded;
    }catch(err){
        return null;
    }
}