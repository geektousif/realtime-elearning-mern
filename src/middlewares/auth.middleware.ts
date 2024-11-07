import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.config";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { TokenPayload, CustomRequest } from "../types/utility.type";

const auth = (requiredRole: string[] = []) =>
  asyncHandler(async (req, res, next) => {
    try {
      let token;

      if (
        (req.header("Authorization") &&
          req.header("Authorization")?.startsWith("Bearer")) ||
        req.cookies.accessToken
      ) {
        token =
          req.cookies?.accessToken ||
          req.header("Authorization")?.replace("Bearer ", "");
      }

      if (!token) {
        throw new ApiError(401, "Unauthorized Request");
      }

      const decodedToken = jwt.verify(
        token,
        ACCESS_TOKEN_SECRET!
      ) as TokenPayload;

      const user = await User.findById(decodedToken?._id);

      if (!user || !requiredRole.includes(user.role)) {
        throw new ApiError(403, "Forbidden Request");
      }

      (req as CustomRequest).user = user;
      next();
      // TODO Handle ERROR better
    } catch (error: any) {
      console.log("Error in auth middleware ", error);
      throw new ApiError(401, error?.message || "Invalid Request");
    }
  });

export default auth;
