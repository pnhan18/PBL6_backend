import Container from "typedi";
import { OK } from "../core/success.response";
import {UserService} from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { IUserService } from "../services/interfaces/Iuser.service";

class UserController {
    private userService: IUserService;
    constructor() {
        this.userService = Container.get(UserService);
    }

    getUsers = async (req: Request, res: Response, next: NextFunction) =>{
        const { limit, page, ...filter } = req.query;
        const limitNumber = limit ? parseInt(limit as string, 10) : undefined;
        const pageNumber = page ? parseInt(page as string, 10) : undefined;
        new OK("Success", await this.userService.getAllUsers({ limit: limitNumber, page: pageNumber, filter })).send(
            res
        );
    }

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        new OK("Success", (await this.userService.findUserById(req.params.user_id as string))!).send(res);
    }

    updateUserById = async (req: Request, res: Response, next: NextFunction) => {
        new OK(
            "Update success",
            await this.userService.updateUserById({ id: req.query.id as string, newData: req.body })
        ).send(res);
    }

    changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
        const { file } = req;
        new OK(
            "Change avatar success",
            await this.userService.changeAvatar(req.params.user_id, file as Express.Multer.File)
        ).send(res);
    }
}

export default UserController;
