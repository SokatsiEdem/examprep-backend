const bookmarkService = require("../services/bookmark.service");
const asyncHandler = require("../middleware/asyncHandler");

const createBookmark = asyncHandler(async (req, res) => {
  const { userId, questionId } = req.body;

  const bookmark = await bookmarkService.createBookmark(
    userId,
    questionId
  );

  res.status(201).json({
    success: true,
    message: "Bookmark created successfully.",
    data: bookmark,
  });
});

module.exports = {
  createBookmark,
};
