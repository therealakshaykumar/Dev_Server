import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwtToken.js";
import "../types/type.js";
import { AnyObject } from "../types/type.js";
import { User } from "../models/user.js";
import { Logger } from "../lib/logger.js";

export const userAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        console.log("All cookies:", req.cookies);
        console.log("Headers:", req.headers.cookie);
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = await verifyToken(token) as AnyObject;
        if(!decoded){
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        Logger.error("Authentication Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

export const adminAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = await verifyToken(token) as AnyObject;
        if(!decoded){
            return res.status(401).send("Unauthorized: Invalid token");
        }
        if(!decoded.isAdmin){
            return res.status(403).send("Access denied");
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        Logger.error("Admin Authentication Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}