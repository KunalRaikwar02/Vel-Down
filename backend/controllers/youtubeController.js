const ytDl = require('yt-dlp-exec');

// Standard resolutions mapping
const resolutionMap = {
    '1920': '1080p',
    '1280': '720p',
    '854': '480p',
    '640': '360p',
    '426': '240p',
    '256': '144p'
};

/**
 * GET VIDEO INFO (With OAuth2 Bypass & Clean Resolutions)
 */
exports.getVideoInfo = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    try {
        console.log("🔑 Authenticating via OAuth2 for:", url);
        
        const data = await ytDl(url, {
            dumpJson: true,
            noCheckCertificates: true,
            noPlaylist: true,
            extractorArgs: 'youtube:oauth2', 
            youtubeSkipDashManifest: false, 
        });

        const allQualities = (data.formats || [])
            .filter(f => f.vcodec !== 'none' && (f.height || f.width))
            .map(f => {
                
                let qLabel = f.height ? f.height + 'p' : 'Auto';

                if (f.width && resolutionMap[f.width]) {
                    qLabel = resolutionMap[f.width];
                }

                return {
                    itag: f.format_id,
                    quality: qLabel,
                    size: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(1) + ' MB' : 'High Speed',
                    container: f.ext || 'mp4'
                };
            })
   
            .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i)
    
            .sort((a, b) => parseInt(b.quality) - parseInt(a.quality));

        res.json({
            success: true,
            video: { 
                title: data.title, 
                thumbnail: data.thumbnail,
                duration: data.duration_string,
                uploader: data.uploader
            },
            qualities: allQualities.slice(0, 6) 
        });

    } catch (e) {
        console.error("❌ OAuth/Info Error:", e.message);
        res.status(500).json({ success: false, error: "Auth required or YouTube block. Check Terminal!" });
    }
};

/**
 * DOWNLOAD VIDEO
 */
exports.downloadVideo = async (req, res) => {
    const { url, itag } = req.query;
    try {
        console.log(`📥 Streaming itag ${itag} via OAuth2...`);

        res.setHeader('Content-Disposition', `attachment; filename="VelDown_${Date.now()}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        const subprocess = ytDl.exec(url, {
 
            format: itag ? `${itag}+bestaudio[ext=m4a]/best` : 'bestvideo+bestaudio/best',
            output: '-',
            noCheckCertificates: true,
            extractorArgs: 'youtube:oauth2',
        });

        subprocess.stdout.pipe(res);

        req.on('close', () => {
            console.log("⚠️ Connection closed by client.");
            subprocess.kill();
        });

    } catch (e) {
        console.error("❌ Download Error:", e.message);
        if (!res.headersSent) res.status(500).send("Download failed.");
    }
};