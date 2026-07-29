const express = require("express");
const router = express.Router();

const bookmarkController = require("../controllers/bookmark.controller");
const {
  createBookmarkValidator,
} = require("../validators/bookmark.validator");

const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

router.post(
  "/",
  createBookmarkValidator,
  validate,
  bookmarkController.createBookmark
);

module.exports = router;