import { Inject, Service } from "typedi";
import { IRecognitionHistoryService } from "./interfaces/IrecognitionHistory.service";
import { IRecognitionHistory } from "../models/recognitionHistory.model";
import { RecognitionHistoryRepository } from "../repositories/recogitionHistory.repository";
import mongoose, { Types } from "mongoose";

@Service()
export class RecognitionHistoryService implements IRecognitionHistoryService {
  @Inject(() => RecognitionHistoryRepository)
  private recognitionHistoryRepository!: RecognitionHistoryRepository;

  createRecognitionHistory(
    userId: string,
    videoName: string,
    result: string
  ): Promise<IRecognitionHistory> {
    return this.recognitionHistoryRepository.save({
      userId: new Types.ObjectId(userId),
      videoName,
      result,
      createdAt: new Date(),
    });
  }
}
