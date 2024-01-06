import { Role, Permission } from "../models/role.model";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const createRole = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const createdRole = await Role.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(201, createdRole, "Role Created Successfully"));
});

export { createRole };
