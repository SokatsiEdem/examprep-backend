import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  await transporter.sendMail({
    from: `"ExamPrep" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Email",
    html: `
      <h2>Welcome to ExamPrep</h2>
      <p>Your verification code is:</p>
      <h1>${token}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  console.log("Email sent successfully");
};

export default sendVerificationEmail;