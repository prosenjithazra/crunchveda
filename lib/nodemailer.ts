import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpUser = process.env.SMTP_USER || process.env.SMTP_EMAIL || "info@crunchvedastore.com";
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";
const emailFrom = process.env.EMAIL_FROM || "Crunchveda Store <info@crunchvedastore.com>";
const emailTo = process.env.EMAIL_TO || "info@crunchvedastore.com";

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export interface SendEmailPayload {
  to?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(payload: SendEmailPayload) {
  const mailOptions = {
    from: emailFrom,
    to: payload.to || emailTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    replyTo: payload.replyTo,
  };

  return await transporter.sendMail(mailOptions);
}
