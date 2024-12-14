export interface IGrpcService {
    sendVideoToProcess(userId: string, video: Express.Multer.File): Promise<any>;
    sendChunkToProcess(userId: string, chunk: Buffer): Promise<string>;
}

