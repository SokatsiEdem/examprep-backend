import express from "express";
import { getAllSubjects,selectSubjects,getMySubjects,updateSubjects,} from "../controllers/subject.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateSelectSubjects } from "../validators/subject.validator.js";
const router = express.Router();

router.get("/", getAllSubjects);

router.post( "/me", protect, validateSelectSubjects,selectSubjects);
router.get("/me",protect,getMySubjects);
router.put("/me",protect,validateSelectSubjects,updateSubjects);

export default router;