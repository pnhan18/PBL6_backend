export interface IUploadService {
    uploadImageFromLocal({file}: {file: Express.Multer.File}): Promise<{url: string, imageName: string}>;
    uploadVideoFromLocal({file}: {file: Express.Multer.File}): Promise<{url: string, videoName: string}>;
    uploadTxtFromLocal({txtFilePath} : {txtFilePath: string}): Promise<{url: string, txtName: string}>;
    uploadVideoFromUrl({url}: {url: string}): Promise<{url: string, videoName: string}>;
    uploadImageFromUrl({url}: {url: string}): Promise<{url: string, imageName: string}>;
    deleteFile({fileName}: {fileName: string}): Promise<void>;
}