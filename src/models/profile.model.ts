import { Schema, model } from "mongoose";
import { IProfile } from "../types/models.type";

const profileSchema = new Schema<IProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  profilePic: {
    type: String,
  },
  description: String,
  billingAddress: String,
});

export const Profile = model<IProfile>("Profile", profileSchema);
