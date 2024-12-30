import { Service } from "typedi";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import { ISignLanguageRepository } from "./interface/IsignLanguage.repository";
import SignLanguage, { ISignLanguage } from "../models/signLanguage.model";

@Service()
export class SignLanguageRepository
  extends BaseRepository<ISignLanguage, Types.ObjectId>
  implements ISignLanguageRepository {
  constructor() {
    super(SignLanguage);
  }
}
