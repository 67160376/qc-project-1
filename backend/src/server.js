const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const inspectionsRoutes = require('./routes/inspections');
const ncrsRoutes = require('./routes/ncrs');
const alertsRoutes = require('./routes/alerts');
const dashboardRoutes = require('./routes/dashboard');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// expose /api/v1/me for frontend convenience
app.get('/api/v1/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Alias: check-username at root to match requested API shape
app.get('/api/v1/check-username/:name', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [req.params.name]);
    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// API
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/inspections', inspectionsRoutes);
app.use('/api/v1/ncrs', ncrsRoutes);
app.use('/api/v1/alerts', alertsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// API Home
app.get("/", (req, res) => {
  res.json({
    message: "QC System API is running",
    version: "1.0.0",
    status: "ok",
    health: "/health",
    api: "/api/v1"
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`QC API listening on port ${port}`);
});
