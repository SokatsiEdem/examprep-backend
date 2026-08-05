import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ExamPrep <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Email",
      html: `
        <h2>Welcome to ExamPrep</h2>
        <p>Thank you for registering.</p>

        <p>Your verification code is:</p>

        <h1>${token}</h1>

        <p>Enter this code in the app to verify your email.</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ExamPrep <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Token",
      html: `
        <h2>Password Reset Request</h2>

        <p>You requested to reset your password.</p>

        <p>Your password reset token is:</p>

        <h1>${token}</h1>

        <p>This token expires in 15 minutes.</p>

        <p>If you did not request this, ignore this email.</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Password reset email sent successfully");

    return data;

  } catch (err) {
    console.error("Password reset email failed:", err);
    throw err;
  }
};

export default sendVerificationEmail;