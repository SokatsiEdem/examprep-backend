import asyncHandler from "../middleware/asyncHandler.js";
import * as authService from "../services/auth.service.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message:
      "Account created successfully. Please check your email to verify your account.",
    data: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});
/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
});

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

/**
 * @desc Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc Update profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const updatedUser = await authService.updateProfile(
    userId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: updatedUser
  });
});
/**
 * @desc Change password
 * @route PUT /api/auth/change-password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

/**
 * @desc Forgot password
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: "Password reset link sent successfully.",
  });
});

/**
 * @desc Reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

/**
 * @desc Verify email
 * @route POST /api/auth/verify-email
 * @access Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body.token);

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});

/**
 * @desc Refresh access token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(
    req.body.refreshToken
  );

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully.",
    data: result,
  });
});

/**
 * @desc Get logged-in user's settings
 * @route GET /api/auth/settings
 * @access Private
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await authService.getSettings(req.user.id);

  res.status(200).json({
    success: true,
    data: settings,
  });
});

/**
 * @desc Save or update user settings
 * @route PUT /api/auth/settings
 * @access Private
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await authService.updateSettings(
    req.user.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Settings updated successfully.",
    data: settings,
  });
});