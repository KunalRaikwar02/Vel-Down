const express = require("express");
const router = express.Router();
const { getVideoInfo, downloadVideo, getVideoQualities } = require("../controllers/youtubeController");

router.get("/info", getVideoInfo);
router.get("/download", downloadVideo);
router.get("/qualities", getVideoQualities);

module.exports = router;