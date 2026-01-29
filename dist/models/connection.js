import mongoose from "mongoose";
export const CONNECTION_STATUSES = ['interested', 'accepted', 'rejected', 'ignored'];
const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: CONNECTION_STATUSES,
        required: true
    }
}, { timestamps: true });
connectionSchema.index({ fromUserId: 1, toUserId: 1 });
export const Connection = mongoose.model('Connection', connectionSchema);
