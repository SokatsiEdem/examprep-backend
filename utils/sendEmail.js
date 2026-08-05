import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
await transporter.verify();
console.log("SMTP connection successful");
export const sendVerificationEmail = async (email, token) => {
  try {
    console.log("8. Entered sendVerificationEmail");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome to ExamPrep</h2>
        <p>Thank you for registering.</p>
        <p>Your verification token is:</p>
        <h3>${token}</h3>
        <p>Use this token to verify your account.</p>
      `,
    });

    console.log("9. Mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ sendMail failed:", error);
    throw error;
  }
};
export default sendVerificationEmail;