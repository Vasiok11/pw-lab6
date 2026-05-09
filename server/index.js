import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
let db;
setupDatabase().then((database) => {
  db = database;
}).catch(err => {
  console.error('[ERROR] Failed to connect to database:', err);
});

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
