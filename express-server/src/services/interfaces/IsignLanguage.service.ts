import { ISignLanguage } from "../../models/signLanguage.model";

export interface ISignLanguageService {
  getSignLanguages({
    limit,
    page,
    filter,
  }: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<ISignLanguage[]>;
  addSignLanguage(name: string, video: Express.Multer.File, howtoperform: string): Promise<ISignLanguage>;
  deleteSignLanguage(id: string): Promise<void>;
}
