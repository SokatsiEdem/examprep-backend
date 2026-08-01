import express from "express";
import { startPractice,submitPractice,getPracticeHistory,getPracticeById,} from "../controllers/practice.controller.js";
import {validateStartPractice,validateSubmitPractice,} from "../validators/practice.validator.js";
import { protect } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();
// Protect all practice routes
router.use(protect);

// Routes
router.post("/start",validateStartPractice,validateRequest,startPractice);
router.post("/:id/submit",validateSubmitPractice,validateRequest,submitPractice);
router.get("/history", getPracticeHistory);
router.get("/:id", getPracticeById);

export default router;