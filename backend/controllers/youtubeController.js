const { fetchVideoInfo, downloadStream, fetchVideoQualities } = require("../utils/youtubeService");

/**
 * Controller to fetch basic video metadata.
 * Validates the URL and returns title, thumbnail, and other details.
 */
exports.getVideoInfo = async (req, res) => {
    try {
        let { url } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }

        const decodedUrl = decodeURIComponent(url);

        // Security Check: Ensure the URL belongs to YouTube
        if (!decodedUrl.includes("youtube.com") && !decodedUrl.includes("youtu.be")) {
            return res.status(400).json({ 
                success: false, 
                message: "Security Error: Only valid YouTube links are permitted." 
            });
        }

        const data = await fetchVideoInfo(decodedUrl);
        res.json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Controller to fetch available video qualities.
 * Returns a list of formats that include both video and audio.
 */
exports.getVideoQualities = async (req, res) => {
    try {
        let { url } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }

        const decodedUrl = decodeURIComponent(url);

        // Security Check: Validate YouTube domain
        if (!decodedUrl.includes("youtube.com") && !decodedUrl.includes("youtu.be")) {
            return res.status(400).json({ 
                success: false, 
                message: "Security Error: Invalid source domain." 
            });
        }

        const qualities = await fetchVideoQualities(decodedUrl);
        res.json({ success: true, qualities });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Controller to handle video streaming and download.
 * Sanitizes the filename and pipes the stream directly to the client.
 */
exports.downloadVideo = async (req, res) => {
    try {
        let { url, itag } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }

        const decodedUrl = decodeURIComponent(url);

        // Security Check: Prevent non-YouTube streaming requests
        if (!decodedUrl.includes("youtube.com") && !decodedUrl.includes("youtu.be")) {
            return res.status(400).json({ 
                success: false, 
                message: "Security Error: Download source rejected." 
            });
        }

        const info = await fetchVideoInfo(decodedUrl);
        
        // Filename Sanitization: Remove special characters to prevent header errors
        const cleanTitle = info.title.replace(/[^\w\s]/gi, '');

        // Set response headers for file download
        res.setHeader("Content-Disposition", `attachment; filename="${cleanTitle}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        const stream = downloadStream(decodedUrl, itag);
        
        // Critical Error Handling for live streams
        stream.on("error", (err) => {
            console.error("[SERVER ERROR] Stream failed:", err.message);
            if (!res.headersSent) {
                res.status(500).send("The download stream was interrupted.");
            }
        });

        // Efficiently pipe the video data to the client
        stream.pipe(res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};