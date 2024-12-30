import { Inject, Service } from "typedi";
import { SignLanguageRepository } from "../repositories/signLanguage.repository";
import { ISignLanguageRepository } from "../repositories/interface/IsignLanguage.repository";
import { NotFoundRequestError } from "../core/error.response";
import { ISignLanguageService } from "./interfaces/IsignLanguage.service";
import { ISignLanguage } from "../models/signLanguage.model";
import { UploadSerivce } from "./upload.service";
import { IUploadService } from "./interfaces/Iupload.service";
import { Types } from "mongoose";
import { promises as fs } from "fs";


@Service()
export class SignLanguageService implements ISignLanguageService {
  @Inject(() => SignLanguageRepository)
  private signLanguageRepository!: ISignLanguageRepository;

  @Inject(() => UploadSerivce)
  private uploadService!: IUploadService;

  async getSignLanguages({
    limit = 50,
    page = 1,
    filter,
  }: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }) {
    const {data} = await this.signLanguageRepository.findAll({
      limit,
      page,
      filter: filter || {},
      select: ["name", "video", "howtoperform"],
    });
    if(!data.length) {
      throw new NotFoundRequestError("No sign languages found");
    }
    return data;
  }

  async addSignLanguage(name: string, video: Express.Multer.File, howtoperform: string): Promise<ISignLanguage> {
    const {videoName, url} = await this.uploadService.uploadVideoFromLocal({file: video});
    await fs.unlink(video.path);
    const signLanguage = await this.signLanguageRepository.save({
      name,
      video: videoName,
      howtoperform,
    });
    signLanguage.video = url;
    return signLanguage;
  }
  async deleteSignLanguage(id: string): Promise<void> {
    const signLanguage = await this.signLanguageRepository.findById(new Types.ObjectId(id));
    if (!signLanguage) {
      throw new NotFoundRequestError("Sign language not found");
    }
    await this.uploadService.deleteFile({fileName: signLanguage.video});
    await this.signLanguageRepository.deleteById(new Types.ObjectId(id));
  }
}
