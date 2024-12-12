import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IRecognitionHistoryRepository } from "./interface/IrecognitionHistory.repository";
import { Service } from "typedi";
import RecognitionHistory, { IRecognitionHistory } from "../models/recognitionHistory.model";

@Service()
export class RecognitionHistoryRepository extends BaseRepository<IRecognitionHistory, Types.ObjectId> implements IRecognitionHistoryRepository {
    constructor() {
        super(RecognitionHistory);
    }
}