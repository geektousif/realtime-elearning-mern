import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/controller-helpers";
import { ApiError } from "../utils/ApiError";
import { Role } from "../models/role.model";

const checkPermission = (requiredPermission: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "User not Logged In");
      }

      const { role: roleId } = req.user;
      const roleInfo = await Role.aggregate([
        {
          $match: {
            _id: roleId,
          },
        },
        {
          $lookup: {
            from: "permissions",
            localField: "permissions",
            foreignField: "_id",
            as: "rolePermissions",
          },
        },
        {
          $project: {
            hasPermission: {
              $in: [requiredPermission, "$rolePermissions.name"],
            },
          },
        },
      ]);
      console.log(roleInfo);

      if (!roleInfo[0]?.hasPermission) {
        throw new ApiError(403, "Access Denied");
      }

      next();
      // TODO handle error better
    } catch (error: any) {
      console.log("Error in check permission: ", error);
      throw new ApiError(500, error?.message || "Something went wrong", error);
    }
  };
};

export default checkPermission;
