const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB (falls back to local JSON store if offline)
connectDB();

const app = express();

// Allow CORS from GitHub Pages frontend and localhost in dev
const allowedOrigins = [
  'http://localhost:3000',
  'https://sanjaykarthic77sky.github.io',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root health check
app.get('/', (req, res) => {
  res.json({
    message: 'CodeTrack API is running',
    version: '1.0.0',
    endpoints: '/api/problems',
  });
});

// API Routes
app.use('/api/problems', problemRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
