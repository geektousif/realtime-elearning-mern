import nodemailer, { createTransport } from "nodemailer";
import {
  SMTP_MAIL_HOST,
  SMTP_MAIL_PASS,
  SMTP_MAIL_PORT,
  SMTP_MAIL_USER,
} from "./env.config";

const transporter = createTransport({
  host: SMTP_MAIL_HOST,
  port: SMTP_MAIL_PORT,
  auth: {
    user: SMTP_MAIL_USER,
    pass: SMTP_MAIL_PASS,
  },
} as nodemailer.TransportOptions);

export default transporter;
