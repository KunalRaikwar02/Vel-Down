const ytdl = require("@distube/ytdl-core");

/**
 * Retrieves metadata for a given YouTube URL
 */
exports.fetchVideoInfo = async (url) => {
    try {
        // Fetching info directly using the library (No binary needed)
        const info = await ytdl.getInfo(url);
        
        return {
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            length: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            viewCount: info.videoDetails.viewCount
        };
    } catch (err) {
        // Cleaning up error message for cleaner frontend display
        throw new Error("Metadata Fetch Failed: " + err.message);
    }
};

/**
 * Creates a readable stream for the video
 */
exports.downloadStream = (url, itag) => {
    // Directly returns the stream from ytdl-core
    return ytdl(url, {
        quality: itag || 'highest',
        filter: 'videoandaudio' // Best for simple MP4 downloads
    });
};

/**
 * Filters and returns available video qualities
 */
exports.fetchVideoQualities = async (url) => {
    try {
        const info = await ytdl.getInfo(url);
        
        // Filtering formats that have both video and audio for ease of use
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        
        return formats.map(f => ({
            quality: f.qualityLabel || f.container,
            itag: f.itag,
            container: f.container,
            // Approximating size if available
            size: f.contentLength ? (parseInt(f.contentLength) / (1024 * 1024)).toFixed(2) + " MB" : "Unknown"
        }));
    } catch (err) {
        throw new Error("Qualities Fetch Failed: " + err.message);
    }
};