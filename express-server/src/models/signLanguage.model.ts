import { Schema, model } from "mongoose";
import { generateSignedUrl } from "../utils";

export interface ISignLanguage {
  name: string;
  video: string;
  howtoperform: string;
  videoUrl?: string
}

const signLanguageSchema = new Schema<ISignLanguage>({
  name: { type: String, required: true },
  video: { type: String, required: true },
  howtoperform: { type: String, required: true },
});

signLanguageSchema.post(['find', 'findOne'], async function (docs: ISignLanguage | ISignLanguage[], next: (err?: Error) => void) {
  if (!docs) return next();
  if (Array.isArray(docs)) {
      await Promise.all(
          docs.map(async (doc: ISignLanguage) => {
              doc.videoUrl = await generateSignedUrl(doc.video as string);
          })
      );
  } else {
      docs.videoUrl = await generateSignedUrl(docs.video as string);
  }
  next();
});

const SignLanguage = model<ISignLanguage>("SignLanguage", signLanguageSchema);
export default SignLanguage;
