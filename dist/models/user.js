import mongoose from "mongoose";
import validator from "validator";
const removeNumbers = (value) => {
    return value.replace(/\d/g, '');
};
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        set: removeNumbers
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 100,
        set: removeNumbers
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxLength: 100,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        maxLength: 100
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false,
    }
}, { timestamps: true, });
export const User = mongoose.model('User', userSchema);
