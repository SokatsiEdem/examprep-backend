import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
//import generateToken from "../utils/generateToken.js";
import  generateAccessToken  from "../utils/generateAccessToken.js";
import  generateRefreshToken  from "../utils/generateRefreshToken.js";
import {sendVerificationEmail, sendPasswordResetEmail,} from "../utils/sendEmail.js";

/**
 * Register User
 */
export const register = async ({
  fullName,
  email,
  password,
  
}) => {
  console.log("1. Checking if user exists");
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
  }
console.log("2. Hashing password");
  const hashedPassword = await bcrypt.hash(password, 12);

console.log("3. Generating verification token");
  const verificationToken = Math.floor(
  10000 + Math.random() * 90000
).toString();
console.log("4. Creating user");
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });
console.log("5. User created");
console.log("6. Sending verification email");
try {
    await sendVerificationEmail(email, verificationToken);
    console.log("7. Verification email sent");
} catch (err) {
    console.error("Verification email failed:", err);
}
  return user;
};

/**
 * Login
 */
export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: await bcrypt.hash(refreshToken, 12),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};
/**
 * Logout User
 */
export const logout = async () => {
  return {
    message: "Logged out successfully."
  };
};
/**
 * Get Profile
 */
export const getProfile = async (userId) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

/**
 * Update Profile
 */
export const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.fullName && {
        fullName: data.fullName,
      }),

      ...(data.email && {
        email: data.email,
        isVerified: false,
      }),
    },
  });

  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    isVerified: updatedUser.isVerified,
  };
};
/**
 * Change Password
 */
export const changePassword = async (
  userId,
  {
    currentPassword,
    newPassword,
  }
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const validPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!validPassword) {
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    12
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};

/**
 * Forgot Password
 */
export const forgotPassword = async (email) => {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }


  const resetToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();


  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


  await prisma.user.update({
    where: {
      email,
    },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    },
  });


  await sendPasswordResetEmail(
    user.email,
    resetToken
  );


  return true;
};

/**
 * Reset Password
 */
export const resetPassword = async ({
  token,
  password,
}) => {

  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

const user = await prisma.user.findFirst({
  where: {
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      gt: new Date(),
    },
  },
});

  if (!user) {
    throw new Error("Invalid token.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
    },
  });

  return true;
};

/**
 * Verify Email
  */

/**
 * Refresh Token
 */
export const refreshToken = async (refreshToken) => {
  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
  };
};
/**
 * Get user settings
 */
export const getSettings = async (userId) => {
  let settings = await prisma.userSetting.findUnique({
    where: {
      userId,
    },
  });

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.userSetting.create({
      data: {
        userId,
      },
    });
  }

  return settings;
};

/**
 * Save/Update settings
 */
export const updateSettings = async (userId, payload) => {
  const {
    preferredExamType,
    preferredSubjects,
    notificationsEnabled,
  } = payload;

  return prisma.userSetting.upsert({
    where: {
      userId,
    },

    update: {
      preferredExamType,
      preferredSubjects,
      notificationsEnabled,
    },

    create: {
      userId,
      preferredExamType,
      preferredSubjects,
      notificationsEnabled,
    },
  });
};

export const verifyEmail = async (email, otp) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified.");
  }

  if (user.verificationToken !== otp) {
    throw new Error("Invalid verification code.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });

  const accessToken = generateAccessToken(updatedUser.id);
  const refreshToken = generateRefreshToken(updatedUser.id);

  await prisma.user.update({
    where: { id: updatedUser.id },
    data: {
      refreshToken: await bcrypt.hash(refreshToken, 12),
    },
  });

  return {
    user: {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    },
    accessToken,
    refreshToken,
  };
};

export const resendVerificationOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified.");
  }

  // Generate a new 5-digit OTP
  const verificationToken = Math.floor(
    10000 + Math.random() * 90000
  ).toString();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendVerificationEmail(user.email, verificationToken);

  return {
    message: "A new verification code has been sent to your email.",
  };
};