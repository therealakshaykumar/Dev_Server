export type AnyObject = Record<string, any>;
declare global {
    namespace Express {
        interface Request {
            userId?: string | number;
        }
    }
}
