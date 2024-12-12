import { NextFunction, Request, Response } from "express";
import { AuthFailureError, BadRequestError, ForbiddenRequestError } from "../core/error.response";
import CatchAsync from "../utils/CatchAsync";
import Authentication from "../utils/authentication";
import Container from "typedi";
import { UserService } from "../services/user.service";
import { IUser } from "../models/user.model";
import { Types } from "mongoose";
require("dotenv").config();

const userService = Container.get(UserService);

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
const HEADER = {
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

export const authentication = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.headers[HEADER.CLIENT_ID];
  if (!clientId) {
    throw new AuthFailureError("Invalid request");
  }
  const authorizationHeader = req.headers[HEADER.AUTHORIZATION] as string;
  const accessToken = authorizationHeader.split(" ")[1];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }
  const decoded = Authentication.validateToken(accessToken);
  if (!decoded || decoded.userId !== clientId) {
    throw new AuthFailureError("Invalid request");
  }
  const user = await userService.findUserById(decoded.userId);
  if (!user) {
    throw new AuthFailureError("Invalid request");
  }
  // if(user.updatedAt > decoded.iat) {
  //   throw new AuthFailureError("Invalid request");
  // }
  req.user = user;
  next();
});