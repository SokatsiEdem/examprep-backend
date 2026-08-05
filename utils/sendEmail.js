import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME,
          email: process.env.EMAIL_FROM,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Brevo Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendVerificationEmail = (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Verify Your ExamPrep Account",
    html: `
      <h2>Welcome to ExamPrep</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
};

export const sendPasswordResetEmail = (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 15 minutes.</p>
    `,
  });
};