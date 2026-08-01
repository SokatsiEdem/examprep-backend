import * as bookmarkService from "../services/bookmark.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc Create a bookmark
 * @route POST /api/bookmarks
 * @access Private
 */
export const createBookmark = asyncHandler(async (req, res) => {
  const { questionId } = req.body;

  const bookmark = await bookmarkService.createBookmark(
    req.user.id,
    questionId
  );

  res.status(201).json({
    success: true,
    message: "Bookmark created successfully.",
    data: bookmark,
  });
});

/**
 * @desc Get all bookmarks for the logged-in user
 * @route GET /api/bookmarks
 * @access Private
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.getBookmarks(req.user.id);

  res.status(200).json({
    success: true,
    count: bookmarks.length,
    data: bookmarks,
  });
});

/**
 * @desc Delete bookmark by bookmark ID
 * @route DELETE /api/bookmarks/:id
 * @access Private
 */
export const deleteBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.deleteBookmark(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Bookmark deleted successfully.",
  });
});

/**
 * @desc Delete bookmark by Question ID
 * @route DELETE /api/bookmarks/question/:questionId
 * @access Private
 */
export const deleteBookmarkByQuestion = asyncHandler(async (req, res) => {
  await bookmarkService.deleteBookmarkByQuestion(
    req.user.id,
    req.params.questionId
  );

  res.status(200).json({
    success: true,
    message: "Bookmark removed successfully.",
  });
});