import { IRecognitionHistory } from "../../models/recognitionHistory.model";

export interface IRecognitionHistoryService {
  createRecognitionHistory(
    userId: string,
    videoId: string,
    txtFilePath: string
  ): Promise<IRecognitionHistory>;

  getRecognitionHistory(params: {
    userId: string;
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<IRecognitionHistory[]>;
}
