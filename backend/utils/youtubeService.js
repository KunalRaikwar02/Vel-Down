const ytdl = require("@distube/ytdl-core");
const path = require("path");
const fs = require("fs");

// Cookies file ka path
const cookiesPath = path.join(__dirname, "../cookies.txt");

/**
 * Netscape format (.txt) ko string format mein convert karne ke liye
 */
const getCookiesFromNetscape = () => {
    try {
        if (!fs.existsSync(cookiesPath)) {
            console.error("Cookies file not found at:", cookiesPath);
            return null;
        }
        const content = fs.readFileSync(cookiesPath, 'utf8');
        const cookies = [];
        content.split('\n').forEach(line => {
            // Sirf valid lines uthao jo comment na hon
            if (!line.startsWith('#') && line.trim() !== '') {
                const parts = line.split('\t');
                if (parts.length >= 7) {
                    cookies.push(`${parts[5].trim()}=${parts[6].trim()}`);
                }
            }
        });
        return cookies.join('; ');
    } catch (err) {
        console.error("Error parsing cookies:", err.message);
        return null;
    }
};

const getOptions = () => {
    const cookieString = getCookiesFromNetscape();
    return { 
        requestOptions: { 
            headers: { 
                'cookie': cookieString || '',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            } 
        } 
    };
};

exports.fetchVideoInfo = async (url) => {
    try {
        const info = await ytdl.getInfo(url, getOptions());
        return {
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            length: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            viewCount: info.videoDetails.viewCount
        };
    } catch (err) {
        throw new Error("Bot Detection Error: " + err.message);
    }
};

exports.downloadStream = (url, itag) => {
    const options = { 
        ...getOptions(), 
        quality: itag || 'highest', 
        filter: 'videoandaudio' 
    };
    return ytdl(url, options);
};

exports.fetchVideoQualities = async (url) => {
    try {
        const info = await ytdl.getInfo(url, getOptions());
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        return formats.map(f => ({
            quality: f.qualityLabel || f.container,
            itag: f.itag,
            container: f.container,
            size: f.contentLength ? (parseInt(f.contentLength) / (1024 * 1024)).toFixed(2) + " MB" : "Unknown"
        }));
    } catch (err) {
        throw new Error("Qualities Fetch Error: " + err.message);
    }
};