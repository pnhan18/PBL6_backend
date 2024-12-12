export interface IGrpcService {
    sendVideoToProcess(userId: string, video: Express.Multer.File): Promise<any>;
}

