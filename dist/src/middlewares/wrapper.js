// This function wraps your async route handlers
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        // We call the function and catch any error, passing it to 'next()'
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
