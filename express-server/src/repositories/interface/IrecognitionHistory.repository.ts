import { Types } from "mongoose";
import { IRecognitionHistory } from "../../models/recognitionHistory.model";
import { BaseRepositoryInterface } from "./Ibase.repository";

export interface IRecognitionHistoryRepository
  extends BaseRepositoryInterface<IRecognitionHistory, Types.ObjectId> {
  getRecognitionHistoryByUserId({
    userId,
    limit,
    page,
    filter,
  }: {
    userId: string;
    limit: number;
    page: number;
    filter: Record<string, any>;
  }): Promise<IRecognitionHistory[]>;
}