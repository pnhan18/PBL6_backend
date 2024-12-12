import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            cb(null, "./src/uploads");
        },
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            const fileExtension = path.extname(file.originalname);
            cb(null, Date.now() + fileExtension);
        },
    }),
});

const uploadMemory = multer({
    storage: multer.memoryStorage(),
});

export {
    uploadDisk,
    uploadMemory,
};
