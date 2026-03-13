const ytDlp = require('yt-dlp-exec');
const path = require('path');

// Path to your cookies file for authenticated requests
const cookiesPath = path.join(__dirname, '../cookies.txt');

/**
 * Retrieves metadata for a given YouTube URL
 */
exports.fetchVideoInfo = async (url) => {
    try {
        const output = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            cookies: cookiesPath // Using cookies to prevent bot detection
        });

        return {
            title: output.title,
            author: output.uploader,
            length: output.duration,
            thumbnail: output.thumbnail,
            viewCount: output.view_count
        };
    } catch (err) {
        throw new Error("yt-dlp Metadata Error: " + err.message);
    }
};

/**
 * Creates a readable stream for the video using yt-dlp stdout
 */
exports.downloadStream = (url, itag) => {
    // '-' redirects the output to stdout for streaming
    const process = ytDlp.exec(url, {
        format: itag ? `${itag}+bestaudio/best` : 'best',
        output: '-',
        cookies: cookiesPath
    }, { stdio: ['ignore', 'pipe', 'ignore'] });

    return process.stdout;
};

/**
 * Filters and returns available video qualities with file sizes
 */
exports.fetchVideoQualities = async (url) => {
    try {
        const output = await ytDlp(url, {
            dumpSingleJson: true,
            cookies: cookiesPath
        });
        
        // Filter formats that contain both video and audio for direct playback
        return output.formats
            .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
            .map(f => ({
                quality: f.format_note || f.resolution,
                itag: f.format_id,
                container: f.ext,
                size: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(2) + " MB" : "Unknown"
            }));
    } catch (err) {
        throw new Error("yt-dlp Format Error: " + err.message);
    }
};