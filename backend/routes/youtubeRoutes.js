const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    const ytDlpPath = path.join(process.cwd(), 'yt-dlp');

    const ytDlp = spawn(ytDlpPath, ['--dump-json', '--flat-playlist', '--no-warnings', '--no-check-certificate', videoUrl]);

    let output = '';
    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => { output += data; });
    ytDlp.stderr.on('data', (data) => { errorOutput += data; });

    const timeout = setTimeout(() => {
        ytDlp.kill();
        if (!res.headersSent) res.status(504).json({ error: "Request timed out" });
    }, 30000); 

    ytDlp.on('close', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
            console.error("yt-dlp error:", errorOutput);
            return res.status(500).json({ success: false, error: 'Binary execute nahi ho paayi' });
        }

        try {
            const data = JSON.parse(output);
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
                video: { title: data.title, thumbnail: data.thumbnail, author: data.uploader },
                qualities: qualities.slice(0, 6)
            });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Data parsing failed' });
        }
    });
});

router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    const ytDlpPath = path.join(process.cwd(), 'yt-dlp');

    res.header('Content-Disposition', `attachment; filename="video.mp4"`);
    const ytDlp = spawn(ytDlpPath, ['-f', itag, '--no-check-certificate', '-o', '-', videoUrl]);
    ytDlp.stdout.pipe(res);
});

module.exports = router;