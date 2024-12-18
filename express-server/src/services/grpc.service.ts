import { Service } from "typedi";
import { IGrpcService } from "./interfaces/Igrpc.service";
import fs from "fs";
import { GrpcObject } from "@grpc/grpc-js";
import { client } from "../config/grpc.config";
import { randomName } from "../utils";
import path from "path";

@Service()
export class GrpcService implements IGrpcService {
  private grpcClient: GrpcObject;
  constructor() {
    this.grpcClient = client;
  }

  async sendVideoToProcess(
    userId: string,
    video: Express.Multer.File
  ): Promise<string> {
    const videoPath = video.path;
    const stream = fs.createReadStream(videoPath);

    const result = await new Promise<string>((resolve, reject) => {
      const call = (this.grpcClient as any).UploadVideo(
        (error: any, response: any) => {
          if (error) {
            reject(`gRPC Error: ${error.message}`);
          } else {
            const txtData = response.txt_chunk.toString();
            const uploadDir = path.join(__dirname, "..", "uploads");
            const txtPath = path.join(
              uploadDir,
              `${userId}_result_${randomName()}.vtt`
            );
            fs.writeFileSync(txtPath, txtData);
            resolve(txtPath);
          }
        }
      );

      stream.on("data", (chunk) => {
        call.write({
          data: chunk,
          client_id: userId,
        });
      });

      stream.on("end", () => {
        call.end();
      });

      stream.on("error", (err) => {
        reject(`Stream Error: ${err.message}`);
      });
    });

    return result;
  }

  // async sendChunkToProcess(userId: string, chunk: Buffer): Promise<string> {
  //   const result = await new Promise<string>((resolve, reject) => {
  //     const call = (this.grpcClient as any).RecognizeSignLanguage(
  //       (error: any, response: any) => {
  //         if (error) {
  //           reject(`gRPC Error: ${error.message}`);
  //         } else {
  //           resolve(response.result);
  //         }
  //       }
  //     );
  //     call.write({
  //       data: chunk,
  //       client_id: userId,
  //     })
  //     call.end();
  //   });
  //   return result;
  // }

  async sendChunkToProcess(userId: string, chunk: Buffer): Promise<string> {
    try {
      const result = await new Promise<string>((resolve, reject) => {
        const call = (this.grpcClient as any).RecognizeSignLanguage(
          (error: any, response: any) => {
            if (error) {
              reject(`gRPC Error: ${error.message}`);
            } else {
              resolve(response.result);
            }
          }
        );
        
        call.write({
          data: chunk,
          client_id: userId,
        });
        call.end();
      });
      
      return result;
    } catch (error) {
      console.error('Error in sending chunk:', error);
      throw error; // Re-throw the error after logging it
    }
  }
}
