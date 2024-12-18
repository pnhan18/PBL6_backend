import Container, { Service } from "typedi";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";
import { Request, Response, NextFunction } from "express";
import { IAccessService } from "../services/interfaces/Iaccess.service";

export class AccessController {
  private accessService: IAccessService;
  constructor() {
    this.accessService = Container.get(AccessService);
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = await this.accessService.signUp(req.body);
    new CREATED("Sign in successfully", newUser).send(res);
  }

  logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    new OK("Login successfully", await this.accessService.logIn(req.body)).send(
      res
    );
  }

  logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.accessService.logOut({ user_id: req.user!["_id"] });
    new OK("Logout successfully").send(res);
  }

  changePassword = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    new OK(
      "Change password successfully",
      await this.accessService.changePassword({
        userId: req.user!["_id"],
        ...req.body,
      })
    ).send(res);
  }

  getAccessToken = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>{
    new OK(
      "Get access token successfully",
      await this.accessService.getAccessToken({
        userId: req.headers["x-client-id"] as string,
        ...req.body,
      })
    ).send(res);
  }

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.accessService.forgotPassword(req.body);
    new OK("Password reset email sent").send(res);
  }

  resetPassword = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    new OK(
      "Reset password successfully",
      await this.accessService.resetPassword(req.body)
    ).send(res);
  }
}
