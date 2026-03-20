const express = require('express');
const router = express.Router();
const ytDl = require('yt-dlp-exec');
const path = require('path'); 

router.get('/info', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    try {
        const data = await ytDl(videoUrl, {
            dumpJson: true,
            flatPlaylist: true,
            noWarnings: true,
 
            binaryPath: path.join(__dirname, '../../yt-dlp') 
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
            video: { title: data.title, thumbnail: data.thumbnail, author: data.uploader },
            qualities: qualities.slice(0, 6)
        });
    } catch (e) {
        console.error("Bhai fetch mein error:", e.message);
        res.status(500).json({ success: false, error: 'Video fetch failed' });
    }
});

router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    
    const subprocess = ytDl.exec(videoUrl, {
        format: itag,
        output: '-',
        binaryPath: path.join(__dirname, '../../yt-dlp') 
    });
    
    subprocess.stdout.pipe(res);
});

module.exports = router;