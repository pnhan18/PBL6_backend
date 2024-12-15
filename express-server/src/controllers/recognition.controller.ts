import Container from "typedi";
import { RecognitionService } from "../services/recognition.service";
import { IRecognitionService } from "../services/interfaces/Irecognition.service";
import { OK } from "../core/success.response";
import { NextFunction, Request, Response } from "express";
import wss from "../config/ws.config";

export class RecognitionController {
  private recognitionService: IRecognitionService;

  constructor() {
    this.recognitionService = Container.get(RecognitionService);
    this.recogitionRealTime();
  }

  recognitionVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const video = req.file as Express.Multer.File;
    new OK(
      "Recognition success",
      await this.recognitionService.recognitionVideo(req.body?.userId, video)
    ).send(res);
  };

  recogitionRealTime = async () => {
    wss.on("connection", (ws, req) => {
      const url = new URL(req.url || "", `ws://${req.headers.host}`);
      const userId = url.searchParams.get("userId") as string;
      console.log("User ID:", userId);
      ws.on("message", async (chunk: Buffer) => {
        const result = await this.recognitionService.recognitionRealTime(userId, chunk);
        if(result !== "") {
          ws.send(result);
        }
      });
    });
  };
}
