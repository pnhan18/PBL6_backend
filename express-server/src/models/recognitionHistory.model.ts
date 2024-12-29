import mongoose, { Schema, Types } from "mongoose";
import { generateSignedUrl } from "../utils";

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

recognitionHistorySchema.post(['find', 'findOne'], async function (docs: IRecognitionHistory | IRecognitionHistory[], next: (err?: Error) => void) {
    if (!docs) return next();
    if (Array.isArray(docs)) {
        await Promise.all(
            docs.map(async (doc: IRecognitionHistory) => {
                doc.result = await generateSignedUrl(doc.result as string);
                doc.videoName = await generateSignedUrl(doc.videoName as string);
            })
        );
    } else {
        docs.result = await generateSignedUrl(docs.result as string);
        docs.videoName = await generateSignedUrl(docs.videoName as string);
    }
    next();
});

const RecognitionHistory = mongoose.model<IRecognitionHistory>("RecognitionHistory", recognitionHistorySchema);
export default RecognitionHistory;