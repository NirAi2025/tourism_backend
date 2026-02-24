import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: process.env.SMTP_PORT,       // 587
  secure: false,                     // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,     // your email
    pass: process.env.SMTP_PASS,     // app password
  },
});