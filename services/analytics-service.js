// The accuracy formula: (Correct / Attempted) * 100 [6]
exports.calculateAccuracy = (correct, total) => {
  return total > 0 ? (correct / total) * 100 : 0;
};

// Logic for flagging weak topics below the 60% threshold [6, 8, 9]
exports.identifyWeakAreas = (topics) => {
  return topics
    .filter(topic => topic.accuracyRate < 60) // Flag topics < 60% [6, 9]
    .sort((a, b) => a.accuracyRate - b.accuracyRate); // Rank from weakest to strongest [7, 8]
};

// Logic to determine the performance trend [7, 8]
exports.getTrend = (recentScores) => {
  if (recentScores.length < 2) return "Consistent";
  const latest = recentScores[recentScores.length - 1];
  const previous = recentScores[recentScores.length - 2];
  
  if (latest > previous) return "Improving"; // Student is getting better [7]
  if (latest < previous) return "Declining"; // Student needs more practice [7]
  return "Consistent";
};