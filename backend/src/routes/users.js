const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// GET /api/v1/users?page=1&limit=10
router.get('/', auth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
  const offset = (page - 1) * limit;
  try {
    const totalRes = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(totalRes.rows[0].count, 10);
    const { rows } = await pool.query('SELECT id, username, name, role, created_at FROM users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.json({ page, limit, total, users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// GET /api/v1/check-username/:name
router.get('/check-username/:name', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [req.params.name]);
    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// GET /api/v1/users/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username, name, role, created_at FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /api/v1/users/:id
router.put('/:id', auth, async (req, res) => {
  const { name, role } = req.body;
  try {
    const result = await pool.query('UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), updated_at = NOW() WHERE id = $3 RETURNING id, username, name, role', [name || null, role || null, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/v1/users/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/v1/check-username/:name
router.get('/check-username/:name', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [req.params.name]);
    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

module.exports = router;
