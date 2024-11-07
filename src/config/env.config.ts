import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;

export const MONGO_URI = process.env.MONGO_URI;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

export const SMTP_MAIL_HOST = process.env.SMTP_MAIL_HOST;
export const SMTP_MAIL_PORT = process.env.SMTP_MAIL_PORT;
export const SMTP_MAIL_USER = process.env.SMTP_MAIL_USER;
export const SMTP_MAIL_PASS = process.env.SMTP_MAIL_PASS;
