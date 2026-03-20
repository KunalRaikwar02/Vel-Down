const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. Path module add kiya static files ke liye
require('dotenv').config();
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();

// Optimized CORS for file downloads
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type'] 
}));

app.use(express.json());

// 2. Static files (CSS, JS, Images) serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// API Routes Registration
app.use('/api/youtube', youtubeRoutes);

// 3. Status check ko /status par move kiya taaki root '/' par frontend dikhe
app.get('/status', (req, res) => {
    res.send('Vel Down Backend is Running! 🚀');
});

// 4. Catch-all route: Ye aapka Frontend (index.html) load karega
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/youtube`);
});