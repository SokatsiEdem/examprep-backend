import express from "express";
import { getQuestions, searchQuestions, getQuestionById,} from "../controllers/questions/questionController.js";
import {validateQuestionQuery,validateSearchQuery,} from "../validators/practiceValidator.js"
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();
// Get all questions
router.get("/",validateQuestionQuery,validateRequest,getQuestions);
// Search questions
router.get("/search",validateSearchQuery,validateRequest,searchQuestions);

// Get a question by ID
router.get("/:id",validateQuestionId,validateRequest,getQuestionById);

export default router;