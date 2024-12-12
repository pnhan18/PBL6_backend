import { Schema, model } from 'mongoose';

export interface ITemplate {
    tem_name: string;
    tem_status?: string;
    tem_html?: string;
}

const templateSchema = new Schema<ITemplate>({
    tem_name: {
        type: String,
        required: true,
        unique: true
    },
    tem_status: {
        type: String,
        default: 'active'
    },
    tem_html: {
        type: String
    }
});

const Template = model<ITemplate>('Template', templateSchema);
export default Template;