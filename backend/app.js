const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();

app.use(cors({
    origin: '*',
    exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());

// Main Routes
app.use('/api/youtube', youtubeRoutes);

// Health Check
app.get('/', (req, res) => res.send("VelDown API Status: Online 🚀"));

module.exports = app;