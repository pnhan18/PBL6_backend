import { IRecognitionHistory } from "../../models/recognitionHistory.model";

export interface IRecognitionHistoryService {
    createRecognitionHistory(userId: string, videoId: string, txtFilePath: string): Promise<IRecognitionHistory>;
}