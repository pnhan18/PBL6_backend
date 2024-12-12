import Container from "typedi";
import { RecognitionService } from "../services/recognition.service";
import { IRecognitionService } from "../services/interfaces/Irecognition.service";
import { OK } from "../core/success.response";
import { NextFunction, Request, Response } from "express";

export class RecognitionController {
  private recognitionService: IRecognitionService;

  constructor() {
    this.recognitionService = Container.get(RecognitionService);
  }

  recognitionVideo = async (req: Request, res: Response, next: NextFunction) => {
    const video = req.file as Express.Multer.File;
    new OK(
      "Recognition success",
      await this.recognitionService.recognitionVideo(req.body?.userId, video)
    ).send(res);
  }
}