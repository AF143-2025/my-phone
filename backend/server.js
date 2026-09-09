const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const storesRoutes = require('./routes/storesRoutes');
const productsRoutes = require('./routes/productsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const offersRoutes = require('./routes/offersRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await db.query('SELECT NOW() as current_time');
    res.json({
      status: 'healthy',
      platform: 'Mobilya Abu Ghraib',
      database: 'connected',
      dbTime: dbRes.rows[0].current_time,
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      platform: 'Mobilya Abu Ghraib',
      database: 'disconnected',
      error: err.message,
    });
  }
});

// Fallback to frontend index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود في الـ API.' });
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ غير متوقع في الخادم.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`
  ======================================================
  📱 Mobilya Platform — سوق الموبايلات في قضاء أبو غريب
  🚀 Server running at: http://localhost:${PORT}
  📡 REST API Base:     http://localhost:${PORT}/api
  ======================================================
  `);
});

module.exports = app;
