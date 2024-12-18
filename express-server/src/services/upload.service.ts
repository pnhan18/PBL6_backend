import { Service } from "typedi";
import { s3 } from "../config/s3.config";
import { generateSignedUrl, randomName } from "../utils";
import { IUploadService } from "./interfaces/Iupload.service";
import {Upload} from "@aws-sdk/lib-storage";
import fs from "fs";

@Service()
export class UploadSerivce implements IUploadService {
    async uploadVideoFromLocal({ file }: {file: Express.Multer.File}) {
        const videoName = randomName();
        const bucketName = process.env.AWS_BUCKET_NAME;
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: bucketName,
            Key: videoName,
            Body:  fs.createReadStream(file.path),
            ContentType: "video/mp4",
          },
        });
        await upload.done();
        // export url
        const url = await generateSignedUrl(videoName);
        return {
            videoName,
            url,
        }
      }
    
    async uploadImageFromLocal({ file } : {file: Express.Multer.File}) {
        const imageName = randomName();
        const bucketName = process.env.AWS_BUCKET_NAME;
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: bucketName,
            Key: imageName,
            Body: file.buffer,
            ContentType: "image/JPEG",
          },
        });
        await upload.done();
    
        // export url
        const url = await generateSignedUrl(imageName);
        return {
          imageName,
          url,
        };
      }

      async uploadTxtFromLocal({ txtFilePath }: { txtFilePath: string; }): Promise<{ url: string; txtName: string; }> {
        const fileName = randomName();
        const bucketName = process.env.AWS_BUCKET_NAME;
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: bucketName,
            Key: fileName,
            Body: fs.createReadStream(txtFilePath),
            ContentType: "text/vtt",
          },
        });
        await upload.done();
        const url = await generateSignedUrl(fileName);
        return {
          txtName: fileName,
          url,
        }
      }
}