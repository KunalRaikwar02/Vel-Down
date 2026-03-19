const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

/**
 * GET /info
 * Fetches video metadata including title, thumbnail, and available formats using yt-dlp.
 */
router.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    // Execute yt-dlp to dump video metadata in JSON format
    const ytDlp = spawn('yt-dlp', ['--dump-json', '--flat-playlist', videoUrl]);

    let output = '';
    ytDlp.stdout.on('data', (data) => { output += data; });

    ytDlp.on('close', (code) => {
        if (code !== 0) return res.status(500).json({ success: false, error: 'Video fetch failed' });

        try {
            const data = JSON.parse(output);
            
            // Filter formats to ensure both video and audio codecs are present
            const qualities = data.formats
                .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
                .map(f => ({
                    itag: f.format_id,
                    quality: f.format_note || f.resolution || 'HD',
                    container: f.ext,
                    size: f.filesize_approx ? `${(f.filesize_approx / (1024 * 1024)).toFixed(1)} MB` : 'HD'
                }))
                .reverse(); 

            res.json({
                success: true,
                video: {
                    title: data.title,
                    thumbnail: data.thumbnail,
                    author: data.uploader
                },
                qualities: qualities.slice(0, 6) 
            });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Parsing error' });
        }
    });
});

/**
 * GET /download
 * Streams the requested video format directly to the client as an attachment.
 */
router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;

    if (!videoUrl || !itag) return res.status(400).send('Missing parameters');

    // Set headers for file attachment and type
    res.header('Content-Disposition', `attachment; filename="VelDown_Video.mp4"`);
    res.header('Content-Type', 'video/mp4');

    // Execute yt-dlp to stream the specific format to stdout
    const ytDlp = spawn('yt-dlp', [
        '-f', itag,
        '--merge-output-format', 'mp4',
        '-o', '-', 
        videoUrl
    ]);

    // Pipe the yt-dlp stdout stream directly to the express response
    ytDlp.stdout.pipe(res);

    ytDlp.on('close', (code) => {
        if (code !== 0 && !res.headersSent) {
            console.error('yt-dlp error code:', code);
        }
    });
});

module.exports = router;