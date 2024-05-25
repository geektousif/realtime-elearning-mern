import { SMTP_MAIL_HOST } from "../config/env.config";
import transporter from "../config/nodemailer.config";
import { mailOptionsType } from "../types/utility.type";

const sendMailService = async (options: mailOptionsType) => {
  const emailMessage = {
    from: SMTP_MAIL_HOST,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(emailMessage);
};

export default sendMailService;
