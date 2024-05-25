import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/utility.type";
import { ApiError } from "../utils/ApiError";
import { Role, Permission } from "../models/role.model";

const checkPermission = (requiredPermission: string) => {
  return async (req: CustomRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "User not Logged In");
      }

      const permission = await Permission.findOne({ name: requiredPermission });
      if (!permission) {
        throw new ApiError(500, `Permission '${requiredPermission}' not found`);
      }

      //TODO Cache permissions: To improve performance, consider caching permission objects in memory to reduce database queries
      const roleWithPermission = await Role.findOne({
        _id: req.user.role,
        permissions: { $in: permission._id },
      });
      // const roleInfo = await Role.aggregate([
      //   {
      //     $match: {
      //       _id: roleId,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "permissions",
      //       localField: "permissions",
      //       foreignField: "_id",
      //       as: "rolePermissions",
      //     },
      //   },
      //   {
      //     $project: {
      //       hasPermission: {
      //         $in: [requiredPermission, "$rolePermissions.name"],
      //       },
      //     },
      //   },
      // ]);
      console.log(roleWithPermission);

      if (!roleWithPermission) {
        throw new ApiError(403, "Access denied");
      }

      next();
      // TODO handle error better
    } catch (error: any) {
      console.log("Error in check permission: ", error);
      throw new ApiError(500, error?.message || "Something went wrong");
    }
  };
};

export default checkPermission;
