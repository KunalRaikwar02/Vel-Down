const express = require('express');
const router = express.Router();
const ytDl = require('yt-dlp-exec');

// Metadata Fetch Route
router.get('/info', async (req, res) => {
    const videoUrl = req.query.url;
    
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        const data = await ytDl(videoUrl, {
            dumpJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        // Filter formats for video + audio
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

    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ success: false, error: 'Video fetch failed. Try again.' });
    }
});

// Download Route
router.get('/download', async (req, res) => {
    const { url, itag } = req.query;

    if (!url || !itag) {
        return res.status(400).send('Missing params');
    }

    try {
        res.header('Content-Disposition', `attachment; filename="VelDown_Video.mp4"`);
        res.header('Content-Type', 'video/mp4');

        const stream = ytDl.exec(url, {
            format: itag,
            output: '-',
            noCheckCertificates: true
        });

        stream.stdout.pipe(res);

        stream.on('error', (err) => {
            console.error("Stream Error:", err);
            if (!res.headersSent) res.status(500).send('Download failed');
        });

    } catch (error) {
        console.error("Download Error:", error.message);
        res.status(500).send('Download error occurred');
    }
});

module.exports = router;