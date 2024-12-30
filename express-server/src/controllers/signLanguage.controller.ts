import Container from "typedi";
import { ISignLanguageService } from "../services/interfaces/IsignLanguage.service";
import { SignLanguageService } from "../services/signLanguage.service";
import { Request, Response, NextFunction } from "express";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export class SignLanguageController {
    private signLanguageService: ISignLanguageService;

    constructor() {
        this.signLanguageService = Container.get(SignLanguageService);
    }

    getSignLanguages = async (req: Request, res: Response, next: NextFunction) => {
        const { limit, page, ...filter } = req.query;
        const limitNumber = limit ? parseInt(limit as string, 10) : undefined;
        const pageNumber = page ? parseInt(page as string, 10) : undefined;
        new OK("Success", await this.signLanguageService.getSignLanguages({ limit: limitNumber, page: pageNumber, filter })).send(
            res
        );
    }

    addSignLanguage = async (req: Request, res: Response, next: NextFunction) => {
        const { name, howtoperform} = req.body;
        const video = req.file;
        if(!video) {
            throw new BadRequestError("Video is required");
        }
        new OK("Success", await this.signLanguageService.addSignLanguage(name, video, howtoperform)).send(res);
    }

    deleteSignLanguage = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.signLanguageService.deleteSignLanguage(id);
        new OK("Success").send(res);
    }
}