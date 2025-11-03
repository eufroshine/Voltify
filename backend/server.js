require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const applianceRoutes = require('./routes/appliances');
const usageRoutes = require('./routes/usage');
const settingsRoutes = require('./routes/settings');
const authRoutes = require('./routes/authRoutes'); // ✅ TAMBAHKAN INI

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to Voltify API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',           // ✅ TAMBAHKAN INI
      appliances: '/api/appliances',
      usage: '/api/usage',
      settings: '/api/settings'
    }
  });
});

app.use('/api/auth', authRoutes);        // ✅ TAMBAHKAN INI
app.use('/api/appliances', applianceRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Voltify Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
});