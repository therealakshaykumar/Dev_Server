import mongoose from "mongoose";

interface IConnection {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
}

const connectionSchema = new mongoose.Schema<IConnection>({
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
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export const Connection = mongoose.model<IConnection>('Connection', connectionSchema);