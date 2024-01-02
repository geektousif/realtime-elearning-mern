import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

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
  const { username, email, fullName, dob, password } = req.body;

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
  const refreshToken = user.generateRefreshToken();

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

export { registerUser, login };
