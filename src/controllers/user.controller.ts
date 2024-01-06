import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { REFRESH_TOKEN_SECRET } from "../config";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

/*********************************
 * @REGISTER
 * @route /api/v1/users/register
 * @description User Register controller
 * @parameters username, email, fullname, dob, password
 * @returns User Object
 *********************************/

const registerUser = asyncHandler(async (req, res) => {
  // TODO implement standard validator
  const { username, email, fullName, dob, password, roleId } = req.body;

  if (
    [username || email || fullName || dob || password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required.");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }

  // TODO check for image
  // TODO upload Image

  const user = await User.create({
    username,
    email,
    fullName,
    dob,
    password,
    role: roleId,
  });

  const createdUser = await User.findById(user._id)?.select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user");
  }

  console.log(createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Registered Successfully"));
});

/*********************************
 * @LOGIN
 * @route /api/v1/users/login
 * @description User Login controller
 * @parameters username/email, password
 * @returns User object with access token
 *********************************/

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // LATER data validation and sanitization
  if (!(username || email) || !password) {
    throw new ApiError(400, "Username/Email and Password is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  console.log(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User LoggedIn Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: incomingToken } = req.cookies || req.body;

  if (!incomingToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingToken,
      REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user || user.refreshToken !== incomingToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error: any) {
    //TODO error handle type
    console.error(error);
    throw new ApiError(401, error?.message || "Refresh Token error");
  }
});

export { registerUser, login, logout, refreshToken };
