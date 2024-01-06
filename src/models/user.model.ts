import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { AuthRoles } from "../constants/enums";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import { IUser } from "../types/model-interfaces";

const documentName = "User";

// TODO separate types in another file/folder

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please Provide an username"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    // LATER: implement same user multiple role
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    photo: String, // TODO Make it required after implementing upload
    verified: Boolean,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.error("Error while hashing password:", error);
    throw error;
  }
});

userSchema.methods.isPasswordCorrect = async function (
  enteredPassword: string
) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

// IMPLEMENT Auth0
// SUGGESTION: Later Implement more secure algorithm
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
    },
    `${ACCESS_TOKEN_SECRET}`,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    `${REFRESH_TOKEN_SECRET}`,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  this.refreshToken = refreshToken;
  try {
    await this.save();
    return refreshToken;
  } catch (error) {
    console.error("Error saving the refresh token:", error);
    throw error;
  }
};

userSchema.methods.generateForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(32).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("base64");
  this.forgotPasswordExpiry = Date.now() + 30 * 60 * 1000;

  return forgotToken;
};

userSchema.methods.generateEmailVerificationToken = function () {
  const emailToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = emailToken;
  this.emailVerificationExpiry = Date.now() + 30 * 60 * 1000;

  return emailToken;
};

userSchema.methods.emailVerified = function () {
  this.verified = true;
};

userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = model<IUser>(documentName, userSchema);
