import { Request } from "express";
import { IUser } from "./model-interfaces";

export interface TokenPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: IUser;
}
