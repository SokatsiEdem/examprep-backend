const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics/analytics-controller');

// Routes defined in the Backend Team Structure [1, 2]
router.get('/dashboard', analyticsController.getDashboardSummary); // For the main dashboard [1, 10]
router.get('/insights', analyticsController.getPerformanceInsights); // For detailed subject analysis [12, 13]

module.exports = router;