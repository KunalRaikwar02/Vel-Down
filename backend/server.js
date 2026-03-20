const express = require('express');
const cors = require('cors');
const path = require('path');
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

app.use(express.static(path.join(__dirname, 'public')));

// API Routes Registration
app.use('/api/youtube', youtubeRoutes);

app.get('/status', (req, res) => {
    res.send('Vel Down Backend is Running! 🚀');
});

app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/youtube`);
});