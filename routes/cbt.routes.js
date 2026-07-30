import express from "express";
import {
    startCBT,
    submitCBT,
    getResult,
    getReview
} from "../controllers/cbt.controller.js";

const router = express.Router();

router.post("/start", startCBT);
router.post("/submit", submitCBT);
router.get("/result/:id", getResult);
router.get("/review/:id", getReview);

export default router;