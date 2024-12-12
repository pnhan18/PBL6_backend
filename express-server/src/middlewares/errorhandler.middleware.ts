import { NextFunction, Request, Response } from "express";

interface Error {
  statusCode?: number;
  message?: string;
  error?: string;
}

export const handleErrorsMiddeleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: "error",
    code: statusCode,
    error: error.message || "Internal Server Error",
  });
};
