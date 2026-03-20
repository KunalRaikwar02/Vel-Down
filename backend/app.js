const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const youtubeRoutes = require('./routes/youtubeRoutes');

dotenv.config();
const app = express();

// Middleware configuration
app.use(cors()); 
app.use(express.json());
app.use(express.static('./public'));

// Main API Routes
app.use('/api/youtube', youtubeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));