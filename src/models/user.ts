import mongoose from "mongoose";
import validator from "validator";

const removeNumbers = (value: string) => {
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
        validate(value: string) {
            if(!validator.isEmail(value)) {
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
    },
    imageUrl: {
        type: String,
        trim: true,
        required: false,
        default: "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg",
        maxLength: 500,
    },
    dob: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: false,
    },
    bio: {
        type: String,
        trim: true,
        maxLength: 500,
        required: false,
    },
    imagePublicId: {
        type: String,
        trim: true,
        required: false,
    },
    githubUrl: {
        type: String,
        trim: true,
        required: false,
    },
    linkedInUrl: {
        type: String,
        trim: true,
        required: false,
    },
}, { timestamps: true, });

export const User = mongoose.model('User', userSchema);