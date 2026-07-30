import express from "express";
import {startCBT, saveAnswer,submitCBT,getExam,getResult,reviewCBT,getExamHistory,} from "../controllers/cbt.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {validateStartCBT,validateSaveAnswer,validateSubmitCBT,validateExamId,} from "../validators/cbt.validator.js";

const router = express.Router();

router.use(protect);
router.post("/start",validateStartCBT,validateRequest,startCBT);
router.post("/:id/save-answer",validateSaveAnswer,validateRequest,saveAnswer);
router.post("/:id/submit",validateSubmitCBT,validateRequest,submitCBT);
router.get("/history", getExamHistory);
router.get("/:id",validateExamId,validateRequest,getExam);
router.get("/:id/result",validateExamId,validateRequest,getResult);
router.get("/:id/review",validateExamId,validateRequest,reviewCBT);

export default router;