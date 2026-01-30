// Sanitize and validate user inputs
export const sanitizeInput = (input) => {
    if (typeof input !== 'string')
        return '';
    return input.trim().slice(0, 100); // Limit length and trim whitespace
};
// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
};
// Validate password strength
export const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password) && password.length <= 128;
};
// Validate name (letters and spaces only)
export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]{1,100}$/;
    return nameRegex.test(name);
};
// DB Abuse detection - check for suspicious patterns
export const checkAbusePatterns = (input) => {
    // Check for common injection patterns
    const abusePatterns = [
        /(\$ne|\$gt|\$lt|\$regex|\$where)/gi, // MongoDB injection
        /(<script|javascript:|onerror=|onclick=)/gi, // XSS patterns
        /(union|select|drop|insert|delete|update|exec|eval)/gi, // SQL injection patterns
    ];
    return abusePatterns.some(pattern => pattern.test(input));
};
