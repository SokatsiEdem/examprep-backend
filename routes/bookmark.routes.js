import express from "express";
import {createBookmark,getBookmarks,deleteBookmark,deleteBookmarkByQuestion,} from "../controllers/bookmark.controller.js";
import {createBookmarkValidator,validateBookmarkId,validateQuestionId,} from "../validators/bookmark.validator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all bookmark routes
router.use(protect);
// Create bookmark
router.post("/",createBookmarkValidator,validateRequest,createBookmark);
// Get all bookmarks
router.get("/", getBookmarks);
// Delete bookmark by bookmark ID
router.delete("/:id",validateBookmarkId,validateRequest,deleteBookmark);
// Delete bookmark by question ID
router.delete( "/question/:questionId",validateQuestionId,validateRequest,deleteBookmarkByQuestion);

export default router;