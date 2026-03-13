const express = require("express");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/youtube", youtubeRoutes);

// Root Endpoint for Health Check
app.get("/", (req, res) => {
    res.send("Vel Down API Service is operational! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${PORT}`);
});