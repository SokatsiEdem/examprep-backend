// utils/generateRefreshToken.js
import jwt from "jsonwebtoken";

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateRefreshToken;