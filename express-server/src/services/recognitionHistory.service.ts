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

  async getRecognitionHistory({
    userId,
    limit = 50,
    page = 1,
    filter = {},
  }: {
    userId: string;
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<IRecognitionHistory[]> {
    return await this.recognitionHistoryRepository.getRecognitionHistoryByUserId({
      userId,
      limit,
      page,
      filter: filter,
    });
  }
}
