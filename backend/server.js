require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server initialized on port ${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
});