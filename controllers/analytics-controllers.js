const analyticsService = require('../../services/analytics-service');

exports.getDashboardSummary = (req, res) => {
  // In a real app, you would fetch this data from your PostgreSQL database
  const summary = {
    lastPracticeScore: 75,       // Most recent result [10, 11]
    overallProgress: 45,         // Progress percentage [10, 11]
    totalSessions: 12,           // Total tests taken [1, 10]
    accuracyPercentage: 82       // Scanable metric [10, 11]
  };
  res.json(summary);
};

exports.getPerformanceInsights = (req, res) => {
  const mockTopics = [
    { name: "Algebra", accuracyRate: 85 },
    { name: "Geometry", accuracyRate: 45 } // This will be flagged as weak [9]
  ];

  res.json({
    strongestSubject: "English",      // Highest performing [1, 7, 12]
    weakestSubject: "Mathematics",    // Lowest performing [1, 7, 12]
    weakTopics: analyticsService.identifyWeakAreas(mockTopics),
    improvementTrend: analyticsService.getTrend([10, 13, 14]) // Output: "Improving" [7, 12]
  });
};
