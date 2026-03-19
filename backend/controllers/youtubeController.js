const ytdl = require("@distube/ytdl-core");
require('dotenv').config();

/**
 * Fetch YouTube request options including cookies and user agent from environment variables.
 */
const getOptions = () => ({
    requestOptions: {
        headers: {
            'cookie': process.env.YT_COOKIE,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        }
    }
});

/**
 * Retrieves basic video information: title, thumbnail, and author name.
 */
exports.getVideoInfo = async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.query.url, getOptions());
        res.json({ 
            success: true, 
            data: { 
                title: info.videoDetails.title, 
                thumbnail: info.videoDetails.thumbnails.pop().url, 
                author: info.videoDetails.author.name 
            } 
        });
    } catch (error) { 
        res.status(500).json({ success: false }); 
    }
};

/**
 * Filters and retrieves available video+audio formats with metadata like itag, quality, and size.
 */
exports.getQualities = async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.query.url, getOptions());
        const qualities = ytdl.filterFormats(info.formats, 'videoandaudio').map(f => ({
            itag: f.itag, 
            quality: f.qualityLabel || f.container, 
            container: f.container, 
            size: f.contentLength ? (f.contentLength / (1024 * 1024)).toFixed(2) + " MB" : "Auto"
        }));
        res.json({ success: true, qualities });
    } catch (error) { 
        res.status(500).json({ success: false }); 
    }
};

/**
 * Streams the video download directly to the client with sanitized headers.
 */
exports.downloadVideo = async (req, res) => {
    try {
        const { url, itag } = req.query;
        const info = await ytdl.getInfo(url, getOptions());
        
        // Sanitize title for content disposition header
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video";

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        // Execute streaming with high water mark for better performance
        ytdl(url, { 
            ...getOptions(), 
            quality: itag, 
            filter: 'videoandaudio', 
            highWaterMark: 1024 * 1024 * 64 
        }).pipe(res);
    } catch (error) { 
        if (!res.headersSent) res.status(500).send("Error"); 
    }
};