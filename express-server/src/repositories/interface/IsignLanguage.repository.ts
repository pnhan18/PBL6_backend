import { Types } from "mongoose";
import { ISignLanguage } from "../../models/signLanguage.model";
import { BaseRepositoryInterface } from "./Ibase.repository";

export interface ISignLanguageRepository extends BaseRepositoryInterface<ISignLanguage, Types.ObjectId> {
    
}