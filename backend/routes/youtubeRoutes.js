const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    // AGAR BUILD COMMAND MEIN ./backend/yt-dlp HAI:
    // Toh raasta ye hoga (kyunki routes folder backend ke andar hota hai)
    const ytDlpPath = path.join(__dirname, '../yt-dlp');

    const ytDlp = spawn(ytDlpPath, ['--dump-json', '--flat-playlist', '--no-warnings', videoUrl]);

    let output = '';
    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => { output += data; });
    ytDlp.stderr.on('data', (data) => { errorOutput += data; });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error("Bhai yt-dlp error:", errorOutput);
            return res.status(500).json({ success: false, error: 'Video fetch failed' });
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
            console.error("Parsing error:", e);
            res.status(500).json({ success: false, error: 'Parsing error' });
        }
    });
});

router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    const ytDlpPath = path.join(__dirname, '../yt-dlp');

    if (!videoUrl || !itag) return res.status(400).send('Missing parameters');

    res.header('Content-Disposition', `attachment; filename="VelDown_Video.mp4"`);
    res.header('Content-Type', 'video/mp4');

    const ytDlp = spawn(ytDlpPath, ['-f', itag, '--no-warnings', '-o', '-', videoUrl]);
    ytDlp.stdout.pipe(res);
    
    ytDlp.on('error', (err) => {
        console.error("Streaming error:", err);
    });
});

module.exports = router;