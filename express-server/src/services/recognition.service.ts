import { Inject, Service } from "typedi";
import { IRecognitionService } from "./interfaces/Irecognition.service";
import { GrpcService } from "./grpc.service";
import { IGrpcService } from "./interfaces/Igrpc.service";
import { UploadSerivce } from "./upload.service";
import { IUploadService } from "./interfaces/Iupload.service";
import { IRecognitionHistoryService } from "./interfaces/IrecognitionHistory.service";
import { RecognitionHistoryService } from "./recognitionHistory.service";
import { promises as fs } from "fs";

@Service()
export class RecognitionService implements IRecognitionService {
  @Inject(() => GrpcService)
  private grpcService!: IGrpcService;

  @Inject(() => UploadSerivce)
  private uploadService!: IUploadService;

  @Inject(() => RecognitionHistoryService)
  private recognitionHistoryService!: IRecognitionHistoryService;

  async recognitionVideo(
    userId: string,
    video: Express.Multer.File
  ): Promise<any> {
    const txtFilePath = await this.grpcService.sendVideoToProcess(
      userId,
      video
    );
    const { url, videoName } = await this.uploadService.uploadVideoFromLocal({
      file: video,
    });
    const { url: result, txtName } =
      await this.uploadService.uploadTxtFromLocal({ txtFilePath: txtFilePath });
    await this.recognitionHistoryService.createRecognitionHistory(
      userId,
      videoName,
      txtName
    );
    await fs.unlink(txtFilePath);
    await fs.unlink(video.path);
    return { url, result };
  }
}
