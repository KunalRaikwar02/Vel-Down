const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/info', youtubeController.getVideoInfo);
router.get('/download', youtubeController.downloadVideo);

module.exports = router;