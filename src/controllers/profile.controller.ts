import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(user);
  res
    .status(200)
    .json(new ApiResponse(200, user, "Your Profile retrieved Successfully"));
});

export { getUserProfile };
