import mongoose from "mongoose";
export declare const CONNECTION_STATUSES: readonly ["interested", "accepted", "rejected", "ignored"];
export declare const Connection: mongoose.Model<{
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        fromUserId: mongoose.Types.ObjectId;
        toUserId: mongoose.Types.ObjectId;
        status: "interested" | "accepted" | "rejected" | "ignored";
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        fromUserId: mongoose.Types.ObjectId;
        toUserId: mongoose.Types.ObjectId;
        status: "interested" | "accepted" | "rejected" | "ignored";
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    fromUserId: mongoose.Types.ObjectId;
    toUserId: mongoose.Types.ObjectId;
    status: "interested" | "accepted" | "rejected" | "ignored";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
