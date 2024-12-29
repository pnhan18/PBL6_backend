import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IRecognitionHistoryRepository } from "./interface/IrecognitionHistory.repository";
import { Service } from "typedi";
import RecognitionHistory, {
  IRecognitionHistory,
} from "../models/recognitionHistory.model";

@Service()
export class RecognitionHistoryRepository
  extends BaseRepository<IRecognitionHistory, Types.ObjectId>
  implements IRecognitionHistoryRepository
{
  constructor() {
    super(RecognitionHistory);
  }

  async getRecognitionHistoryByUserId({
    userId,
    limit,
    page,
    filter,
  }: {
    userId: string;
    limit: number;
    page: number;
    filter: Record<string, any>;
  }): Promise<IRecognitionHistory[]> {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};
    for (const key in filter) {
      if (filter[key]) {
        const value = filter[key];
        if (!isNaN(Number(value))) {
          query[key] = Number(value);
        } else {
          query[key] = { $regex: value, $options: "i" };
        }
      }
    }
    return this.model
      .find({ userId: new Types.ObjectId(userId) })
      .limit(limit)
      .skip(skip)
      .exec();
  }
}
