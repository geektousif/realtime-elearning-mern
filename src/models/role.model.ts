import { Schema, model } from "mongoose";
import { AccessTypes, ProjectSections } from "../constants/enums";
import { IRole, IPermission } from "../types/model-interfaces";

// ROLE SCHEMA ======
const roleDocumentName = "Role";

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

export const Role = model<IRole>(roleDocumentName, roleSchema);
// === =====//

// ============ PERMISSION SCHEMA
const permissionDocumentName = "Permission";

const permissionSchema = new Schema<IPermission>({
  accessType: {
    type: String,
    enum: Object.values(AccessTypes),
    required: true,
  },
  section: {
    type: String,
    enum: Object.values(ProjectSections),
    required: true,
  },
  description: String,
});

export const Permission = model<IPermission>(
  permissionDocumentName,
  permissionSchema
);
// ===================== //
