import { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // error: err.errors,
    data: err.data, // because this is an exception so no data gonna be provided
  });
}

export default errorHandler;
