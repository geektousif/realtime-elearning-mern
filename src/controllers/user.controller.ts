import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { REFRESH_TOKEN_SECRET } from "../config/env.config";
import { emailVerficationMail } from "../utils/emailTemplates";
import mailService from "../helpers/sendMail.helper";
import { IUser } from "../types/models.type";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

// const sendVerificationMail = asyncHandler(async (req, res) => {
//   const createdUser = await User.findById(req.user?._id);

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Verification Email sent."));
// });

/*********************************
 * @REGISTER
 * @route /api/v1/users/register
 * @description User Register controller
 * @parameters username, email, fullname, dob, password
 * @returns User Object
 *********************************/

const registerUser = asyncHandler(async (req, res) => {
  // TODO implement standard validator
  const { username, email, fullName, dob, password, role } = req.body;

  if (
    // [username || email || fullName || dob || password].some(
    [username || email || fullName || password].some(
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
    // dob,
    password,
    role,
  });

  const createdUser = await User.findById(user._id)?.select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user");
  }

  // TODO Email Verification Mail
  const verifyToken = await createdUser.generateEmailVerificationToken();
  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify/${verifyToken}`;
  const verifyEmailMessage = emailVerficationMail(verifyUrl);

  try {
    await mailService({
      email: createdUser.email,
      subject: verifyEmailMessage.subject,
      html: verifyEmailMessage.html,
    });
  } catch (error) {
    console.log("Can't send verification mail ", error);
    throw new ApiError(500, "Can't send verification mail");
  }

  // console.log(createdUser);
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

  // TODO build a middleware for verification purpose (if need felt)
  // if (!user.isVerified) {
  //   throw new ApiError(
  //     400,
  //     "Email is not verified. Please verify your mail using the mail sent to your email address."
  //   );
  // }

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

// TODO forgot password
// TODO change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide both passwords");
  }

  const user = await User.findById(req.user?._id);

  const isCurrentPasswordCorrect =
    await user?.isPasswordCorrect(currentPassword);

  if (!isCurrentPasswordCorrect) {
    throw new ApiError(400, "Wrong Current Password");
  }

  user!.password = newPassword;

  await user?.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// TODO email verify
const verifyEmail = asyncHandler(async (req, res) => {
  const { verifyToken: token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Token invalid or Expired");
  }

  await user.emailVerified();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User verified Successfully"));
});

// TODO forogt password controller

export {
  registerUser,
  login,
  logout,
  refreshToken,
  changePassword,
  verifyEmail,
};
