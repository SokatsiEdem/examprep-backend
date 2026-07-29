const express = require("express");
const router = express.Router();

const {
    startCBT,
    submitCBT,
    getResult,
    reviewCBT
} = require("../controllers/cbt.controller");

router.post("/start", startCBT);
router.post("/submit", submitCBT);
router.get("/result/:id", getResult);
router.get("/review/:id", reviewCBT);

module.exports = router;