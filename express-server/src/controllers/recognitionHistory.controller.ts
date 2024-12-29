import Container from "typedi";
import RecognitionHistory from "../models/recognitionHistory.model";
import { IRecognitionHistoryService } from "../services/interfaces/IrecognitionHistory.service";
import { RecognitionHistoryService } from "../services/recognitionHistory.service";
import { NextFunction, Request, Response } from "express";
import { OK } from "../core/success.response";

export class RecognitionHistoryController {
  private recognitionHistoryService: IRecognitionHistoryService;
  constructor() {
    this.recognitionHistoryService = Container.get(RecognitionHistoryService);
  }

  getRecognitionHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { limit, page, ...filter } = req.query;
    const limitNumber = limit ? parseInt(limit as string, 10) : undefined;
    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    new OK(
      "Success",
      await this.recognitionHistoryService.getRecognitionHistory({
        userId: req.params["user_id"],
        limit: limitNumber,
        page: pageNumber,
        filter,
      })
    ).send(res);
  };
}
