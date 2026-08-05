// import transporter from "../config/mail.js";

// const sendVerificationEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify your Email",
//     html: `
//       <h2>ExamPrep Email Verification</h2>
//       <p>Your verification code is:</p>
//       <h1>${otp}</h1>
//       <p>This code expires in 10 minutes.</p>
//     `,
//   });
// };

// export default sendVerificationEmail;