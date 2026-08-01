import asyncHandler from "../middleware/asyncHandler.js";
import * as analyticsService from "../services/analytics.service.js";

/**
 * @desc Get dashboard overview
 * @route GET /api/analytics/dashboard
 * @access Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await analyticsService.getDashboard(req.user.id);

  res.status(200).json({
    success: true,
    data: dashboard,
  });
});

/**
 * @desc Get Practice Analytics
 * @route GET /api/analytics/practice
 * @access Private
 */
export const getPracticeAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getPracticeAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

/**
 * @desc Get CBT Analytics
 * @route GET /api/analytics/cbt
 * @access Private
 */
export const getCBTAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getCBTAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

/**
 * @desc Get Subject Performance Analytics
 * @route GET /api/analytics/subjects
 * @access Private
 */
export const getSubjectAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getSubjectAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

/**
 * @desc Get Performance Trend
 * @route GET /api/analytics/trend
 * @access Private
 */
export const getPerformanceTrend = asyncHandler(async (req, res) => {
  const trend = await analyticsService.getPerformanceTrend(req.user.id);

  res.status(200).json({
    success: true,
    data: trend,
  });
});

/**
 * @desc Get Bookmark Analytics
 * @route GET /api/analytics/bookmarks
 * @access Private
 */
export const getBookmarksAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getBookmarksAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

/**
 * @desc Get Recent Activities
 * @route GET /api/analytics/recent-activities
 * @access Private
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
  const activities = await analyticsService.getRecentActivities(req.user.id);

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
  });
});