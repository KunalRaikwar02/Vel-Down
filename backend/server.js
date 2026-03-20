const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const youtubeRoutes = require('./routes/youtubeRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/youtube', youtubeRoutes);

// Status route
app.get('/status', (req, res) => {
    res.send('Vel Down Backend is Running! 🚀');
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));