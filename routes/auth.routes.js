import express from "express";
import {register,login,logout,getProfile,updateProfile,changePassword,forgotPassword,resetPassword,verifyEmail,refreshToken,getSettings,updateSettings,resendVerificationOtp} from"../controllers/auth.controller.js";
import {registerValidator,loginValidator,forgotPasswordValidator,resetPasswordValidator,changePasswordValidator,updateProfileValidator,updateSettingsValidator,resendVerificationOtpValidator} from "../validators/auth.validator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register",registerValidator,validateRequest, register);
router.post("/login",loginValidator, validateRequest,login);
router.post("/forgot-password",forgotPasswordValidator,validateRequest,forgotPassword);
router.post("/reset-password",resetPasswordValidator,validateRequest,resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post( "/resend-verification-otp",resendVerificationOtpValidator,validateRequest,resendVerificationOtp);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/update-profile",protect,updateProfileValidator,validateRequest,updateProfile);
router.put("/change-password",protect, changePasswordValidator, validateRequest, changePassword);

router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettingsValidator, validateRequest, updateSettings);

export default router;