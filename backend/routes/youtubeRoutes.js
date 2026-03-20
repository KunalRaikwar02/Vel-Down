const express = require('express');
const router = express.Router();
const ytDl = require('yt-dlp-exec');

/**
 * GET /info
 * Fetches video metadata.
 */
router.get('/info', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    try {

        const data = await ytDl(videoUrl, {
            dumpJson: true,
            flatPlaylist: true,
            noWarnings: true,
        });

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
        console.error("Bhai error aaya fetch mein:", e.message);
        res.status(500).json({ success: false, error: 'Video fetch failed' });
    }
});

/**
 * GET /download
 * Streams video directly to the user.
 */
router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;

    if (!videoUrl || !itag) return res.status(400).send('Missing parameters');

    res.header('Content-Disposition', `attachment; filename="VelDown_Video.mp4"`);
    res.header('Content-Type', 'video/mp4');

    const subprocess = ytDl.exec(videoUrl, {
        format: itag,
        output: '-',
    });

    subprocess.stderr.on('data', (data) => console.error(`stderr: ${data}`));
    
    subprocess.on('error', (err) => {
        console.error('Bhai download error:', err);
        if (!res.headersSent) res.status(500).send('Download failed');
    });

    subprocess.stdout.pipe(res);

    subprocess.on('close', (code) => {
        if (code !== 0 && !res.headersSent) {
            console.error('yt-dlp error code:', code);
        }
    });
});

module.exports = router;