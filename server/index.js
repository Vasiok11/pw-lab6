import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'optimal', message: 'Cyber Tracker API is active.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[SYSTEM] Server active and listening on port ${PORT}`);
});
