export interface IRecognitionService {
    recognitionVideo(userId: string, video: Express.Multer.File): Promise<any>;
}