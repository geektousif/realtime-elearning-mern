export const emailVerficationMail = (url: string) => {
  return {
    subject: "Email verification message",
    html: `<h2>Email Verification</h2>
    <p><a href="${url}"><strong>Click here</strong></a> to verify your account</p>
    <br><p>NOTE: This link will expire in 30 mins. </p>
    `,
  };
};
