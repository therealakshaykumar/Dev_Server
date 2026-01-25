import { Request, Response, NextFunction } from 'express';

// This function wraps your async route handlers
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // We call the function and catch any error, passing it to 'next()'
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};