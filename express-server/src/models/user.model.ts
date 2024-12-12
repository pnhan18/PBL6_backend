import { Schema, model, Document } from 'mongoose';
import { generateSignedUrl } from '../utils/index';

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    gender?: 'male' | 'female';
    avatar?: string;
    dateOfBirth?: Date;
    createdAt: Date;
    passwordChangeAt?: Date;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    avatar: {
        type: String,
    },
    dateOfBirth: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    passwordChangeAt: {
        type: Date,
    }
});

userSchema.post(['find', 'findOne'], async function (docs: IUser | IUser[], next: (err?: Error) => void) {
    if (!docs) return next();
    if (Array.isArray(docs)) {
        await Promise.all(
            docs.map(async (doc: IUser) => {
                doc.avatar = await generateSignedUrl(doc.avatar as string);
            })
        );
    } else {
        docs.avatar = await generateSignedUrl(docs.avatar as string);
    }
    next();
});

const User = model<IUser>('User', userSchema);

export default User;