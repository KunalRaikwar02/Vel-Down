const express = require('express');
const router = require('express').Router();
const { spawn } = require('child_process');
const path = require('path');

// Metadata Fetch Route
router.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL is required' });

    const ytDlpPath = '/opt/render/project/src/yt-dlp';

    const ytDlp = spawn(ytDlpPath, ['--dump-json', videoUrl]);

    let output = '';
    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => { output += data; });
    ytDlp.stderr.on('data', (data) => { 
        errorOutput += data;
        console.error("Binary Error Log:", data.toString()); 
    });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error("yt-dlp process exited with code:", code);
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
                video: { 
                    title: data.title, 
                    thumbnail: data.thumbnail, 
                    author: data.uploader 
                },
                qualities: qualities.slice(0, 6)
            });
        } catch (e) {
            console.error("JSON Parsing Error:", e);
            res.status(500).json({ success: false, error: 'Data parsing failed' });
        }
    });
});

// Download Route
router.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    const ytDlpPath = '/opt/render/project/src/yt-dlp';

    if (!videoUrl || !itag) return res.status(400).send('Missing params');

    res.header('Content-Disposition', `attachment; filename="VelDown_Video.mp4"`);
    res.header('Content-Type', 'video/mp4');

    const ytDlp = spawn(ytDlpPath, ['-f', itag, '-o', '-', videoUrl]);
    ytDlp.stdout.pipe(res);

    ytDlp.on('error', (err) => {
        console.error("Download stream error:", err);
    });
});

module.exports = router;