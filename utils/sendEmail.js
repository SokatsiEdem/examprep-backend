import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

await transporter.verify();

console.log("SMTP connection successful");
export const sendVerificationEmail = async (email, token) => {
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
};

export default sendVerificationEmail;