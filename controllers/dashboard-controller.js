import { getDashboardData } from '../services/dashboard.service.js';

export const getDashboardSummary = async (req, res) => {
  try {
    // 1. Extract data from the request
    const userId = req.user.id; 

    // 2. Pass it to the service layer
    const dashboardData = await getDashboardData(userId);

    // 3. Send the HTTP response
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard." });
  }
};