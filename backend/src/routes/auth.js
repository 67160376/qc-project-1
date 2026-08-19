const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'change_me';

// register
router.post('/register',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password, name } = req.body;
    try {
      const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
      if (rows.length) return res.status(400).json({ error: 'Username already taken' });
      const hashed = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING id, username, name',
        [username, hashed, name || null]
      );
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '8h' });
      res.json({ user: { id: user.id, username: user.username, name: user.name }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// login
router.post('/login',
  body('username').exists(),
  body('password').exists(),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT id, username, password, name FROM users WHERE username = $1', [username]);
      if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '8h' });
      res.json({ user: { id: user.id, username: user.username, name: user.name }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// logout (stateless - client should delete token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// change password
router.post('/change-password',
  body('oldPassword').exists(),
  body('newPassword').isLength({ min: 6 }),
  async (req, res) => {
    // token required in Authorization header
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = auth.split(' ')[1];
    try {
      const payload = jwt.verify(token, jwtSecret);
      const userId = payload.id;
      const { oldPassword, newPassword } = req.body;
      const { rows } = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
      if (!rows.length) return res.status(404).json({ error: 'User not found' });
      const ok = await bcrypt.compare(oldPassword, rows[0].password);
      if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashed, userId]);
      res.json({ message: 'Password changed' });
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
);

module.exports = router;
