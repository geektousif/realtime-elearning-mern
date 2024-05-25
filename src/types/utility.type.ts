import { Request } from "express";
import { IUser } from "./models.type";

export interface TokenPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: IUser;
}

export interface mailOptionsType {
  email?: string;
  subject?: string;
  text?: string;
  html?: string;
}
