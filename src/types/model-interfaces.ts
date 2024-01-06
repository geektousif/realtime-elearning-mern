import { Schema } from "mongoose";

export interface IRole {
  _id: Schema.Types.ObjectId;
  name: string;
  permissions: Array<Schema.Types.ObjectId>;
}

export interface IPermission {
  _id: Schema.Types.ObjectId;
  accessType: string;
  section: string;
  description: string;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  fullName?: string;
  dob: Date;
  password: string;
  role?: string;
  photo?: string;
  verified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  refreshToken?: string;

  age?: number;

  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
}
