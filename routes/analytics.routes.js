import express from "express";
import {getDashboard,getPracticeAnalytics,getCBTAnalytics,getSubjectAnalytics,getPerformanceTrend,getBookmarksAnalytics,getRecentActivities,} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {dashboardValidator,practiceAnalyticsValidator,cbtAnalyticsValidator,subjectAnalyticsValidator,performanceTrendValidator,recentActivitiesValidator,} from "../validators/analytics.validator.js";

const router = express.Router();
router.use(protect);
router.get("/dashboard",dashboardValidator,validateRequest, getDashboard);
router.get("/practice",practiceAnalyticsValidator,validateRequest,getPracticeAnalytics);
router.get("/cbt",cbtAnalyticsValidator,validateRequest,getCBTAnalytics);
router.get("/subjects",subjectAnalyticsValidator,validateRequest,getSubjectAnalytics);
router.get("/trend",performanceTrendValidator,validateRequest,getPerformanceTrend);
router.get("/bookmarks",getBookmarksAnalytics);
router.get("/activities",recentActivitiesValidator,validateRequest,getRecentActivities);

export default router;