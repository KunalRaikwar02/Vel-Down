const express = require("express");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

// Middleware Configuration - Updated for Deployment
app.use(cors({
    origin: "*", // Ye har kisi ko allow karega (Testing ke liye best hai)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use("/api/youtube", youtubeRoutes);

// Root Endpoint for Health Check
app.get("/", (req, res) => {
    res.send("Vel Down API Service is operational! 🚀");
});

const PORT = process.env.PORT || 10000; // Render usually uses 10000
app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
});