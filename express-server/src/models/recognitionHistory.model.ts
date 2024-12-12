import mongoose, { Schema, Types } from "mongoose";

export interface IRecognitionHistory {
    _id: string;
    userId: Types.ObjectId;
    videoName: string;
    result: string;
    createdAt: Date;
}

const recognitionHistorySchema = new Schema<IRecognitionHistory>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    videoName: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const RecognitionHistory = mongoose.model<IRecognitionHistory>("RecognitionHistory", recognitionHistorySchema);
export default RecognitionHistory;