import nodemailer from "nodemailer";

// Create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
// Generic email sender
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("Verifying SMTP...");

    await transporter.verify();

    console.log("SMTP connection successful");

    const info = await transporter.sendMail({
      from: `"ExamPrep" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    console.log("Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

// Verification Email
export const sendVerificationEmail = async (email, token) => {
  return sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to ExamPrep</h2>

      <p>Thank you for registering.</p>

      <p>Your verification code is:</p>

      <h1>${token}</h1>

      <p>This code expires in 10 minutes.</p>
    `,
  });
};

// Password Reset Email
export const sendPasswordResetEmail = async (email, token) => {
  return sendEmail({
    to: email,
    subject: "Password Reset",
    html: `
      <h2>Password Reset Request</h2>

      <p>Your password reset token is:</p>

      <h1>${token}</h1>

      <p>This token expires in 15 minutes.</p>

      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

export default sendVerificationEmail;