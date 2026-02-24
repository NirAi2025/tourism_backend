import { transporter } from "../config/mail";

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Tourism App" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Hello ${user.name},</p>
      <p>Please click below to verify your email:</p>
      <a href="${verificationUrl}" 
         style="padding:10px 20px;background:#1e90ff;color:white;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};