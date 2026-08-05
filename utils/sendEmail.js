import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});
export const sendVerificationEmail = async (email, token) => {
  try {
    // Test SMTP connection
    await transporter.verify();
    console.log("SMTP connection successful");
     console.log("Verifying SMTP...");
    transporter.verify();
console.log("SMTP verified successfully");
    const info = await transporter.sendMail({
      from: `"ExamPrep" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Email",
      html: `
        <h2>Welcome to ExamPrep</h2>
        <p>Your verification code is:</p>
        <h1>${token}</h1>
      `,
    });

    console.log("Email sent:", info.response);

    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: `"ExamPrep" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Token",
      html: `
        <h2>Password Reset Request</h2>

        <p>Your password reset token is:</p>

        <h1>${token}</h1>

        <p>This token expires in 15 minutes.</p>
      `,
    });

    console.log("Password reset email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Password reset email failed:", err);
    throw err;
  }
};

export default sendVerificationEmail;