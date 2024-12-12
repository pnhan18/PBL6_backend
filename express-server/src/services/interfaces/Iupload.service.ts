export interface IUploadService {
    uploadImageFromLocal({file}: {file: Express.Multer.File}): Promise<{url: string, imageName: string}>;
    uploadVideoFromLocal({file}: {file: Express.Multer.File}): Promise<{url: string, videoName: string}>;
}