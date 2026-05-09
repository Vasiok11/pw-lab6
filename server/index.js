import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from './db.js';
import { generateToken, authenticateToken } from './auth.js';
import { setupRoutes } from './routes.js';
import { setupSwagger } from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
let db;
setupDatabase().then((database) => {
  db = database;
  setupRoutes(app, db); // Mount CRUD routes once DB is ready
  setupSwagger(app);    // Mount Swagger UI
}).catch(err => {
  console.error('[ERROR] Failed to connect to database:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Auth Route
app.post('/api/token', generateToken);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'optimal', message: 'Cyber Tracker API is active.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[SYSTEM] Server active and listening on port ${PORT}`);
});
