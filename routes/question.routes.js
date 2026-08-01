import express from "express";
import {getQuestions,searchQuestions,getQuestionById,createQuestion,updateQuestion,deleteQuestion,} from "../controllers/question.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {createQuestionValidator,updateQuestionValidator,} from "../validators/question.validator.js";
const router = express.Router();

// Public routes
router.get("/", getQuestions);
router.get("/search", searchQuestions);
router.get("/:id", getQuestionById);

// Protected/Admin routes
router.post("/",protect,createQuestionValidator,validateRequest,createQuestion);
router.put("/:id",protect,updateQuestionValidator,validateRequest,updateQuestion);
router.delete("/:id", protect, deleteQuestion);

export default router;