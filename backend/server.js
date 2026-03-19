const express = require('express');
const cors = require('cors');
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

// API Routes Registration
app.use('/api/youtube', youtubeRoutes);

// Server Status Check
app.get('/', (req, res) => {
    res.send('Vel Down Backend is Running! 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/youtube`);
});