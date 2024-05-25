import { Schema } from "mongoose";

export interface IRole {
  readonly _id: Schema.Types.ObjectId;
  name: string;
  permissions: Array<Schema.Types.ObjectId>;
}

export interface IPermission {
  readonly _id: Schema.Types.ObjectId;
  name: string;
  accessType: string;
  section: string;
  description: string;
}

export interface IUser {
  readonly _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  fullName?: string;
  dob: Date;
  password: string;
  role?: string;
  // photo?: string;
  isVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  refreshToken?: string;

  age?: number;

  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
  generateForgotPasswordToken(): Promise<string>;
  generateEmailVerificationToken(): Promise<string>;
  emailVerified(): Promise<void>;
}

export interface IProfile {
  readonly _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  description: string;
  profilePic: string;
  billingAddress: string;
}

export interface ICategory {
  readonly _id: Schema.Types.ObjectId;
  name: string;
}
export interface ICourse {
  readonly _id: Schema.Types.ObjectId;
  instructor: Schema.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  posterImage: string;
  published: boolean;
  category: Schema.Types.ObjectId;
}
