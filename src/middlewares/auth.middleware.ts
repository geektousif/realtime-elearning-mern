import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { TokenPayload, CustomRequest } from "../types/controller-helpers";

const auth = asyncHandler(async (req, res, next) => {
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

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
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
