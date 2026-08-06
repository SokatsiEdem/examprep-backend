import asyncHandler from "../middlewares/asyncHandler.js";
import * as subjectService from "../services/subject.service.js";

// Get all available subjects
export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await subjectService.getAllSubjects();

  res.status(200).json({
    success: true,
    message: "Subjects retrieved successfully.",
    data: subjects,
  });
});

// Save selected subjects
export const selectSubjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subjectIds } = req.body;

  const result = await subjectService.selectSubjects(userId, subjectIds);

  res.status(200).json({
    success: true,
    message: "Subjects selected successfully.",
    data: result,
  });
});

// Get logged-in user's selected subjects
export const getMySubjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const subjects = await subjectService.getMySubjects(userId);

  res.status(200).json({
    success: true,
    data: subjects,
  });
});

// Update selected subjects
export const updateSubjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subjectIds } = req.body;

  const result = await subjectService.updateSubjects(userId, subjectIds);

  res.status(200).json({
    success: true,
    message: "Subjects updated successfully.",
    data: result,
  });
});